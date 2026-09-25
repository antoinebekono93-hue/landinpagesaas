import "server-only";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import fs from "fs";
import path from "path";
import { nhostGraphQL } from "@/lib/nhost/server";
import { loadResourceRowById } from "./source";
import { getPremiumEntitlement } from "./premium";
import type {
  CatalogResourceRow,
  ResourceAccessLogRow,
} from "./types";

/**
 * Moteur d'accès aux ressources du marketplace (server-only).
 *
 * - Seule source de vérité : la table `catalog_resources`.
 * - L'autorisation est évaluée PAR ressource : un produit peut mélanger des
 *   ressources publiques, gratuites (authentifié) et Premium sans être verrouillé.
 * - Chaque accès autorisé est enregistré dans `catalog_resource_access_logs`.
 * - Les fichiers hébergés sont livrés via une URL signée à courte durée de vie.
 *   Aucun chemin de fichier serveur n'est jamais exposé.
 */

export class ResourceAccessError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "ResourceAccessError";
    this.status = status;
    this.code = code;
  }
}

export type ResourceDecision =
  | { kind: "redirect"; url: string }
  | { kind: "download"; url: string }
  | { kind: "none"; reason: string };

/* ─────────────────────────── Token de livraison ─────────────────────────── */

function downloadSecret(): string {
  const secret = process.env.MERCO_DOWNLOAD_SECRET;
  if (secret) return secret;
  // Secret stable par déploiement : dérivé du secret admin (serveur uniquement).
  return createHash("sha256")
    .update(String(process.env.NHOST_ADMIN_SECRET ?? "merco-resources-fallback"))
    .digest("hex");
}

export function signDownloadToken(resourceId: string, ttlSeconds = 300): { token: string; exp: string } {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${resourceId}:${exp}`;
  const signature = createHmac("sha256", downloadSecret())
    .update(payload)
    .digest("hex");
  return { token: signature, exp: String(exp) };
}

export function verifyDownloadToken(
  resourceId: string,
  token: string,
  expValue: string
): boolean {
  const exp = Number(expValue);
  if (!Number.isFinite(exp) || exp <= 0 || exp < Math.floor(Date.now() / 1000)) {
    return false;
  }
  const payload = `${resourceId}:${exp}`;
  const expected = createHmac("sha256", downloadSecret())
    .update(payload)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ─────────────────────────── Traçabilité ─────────────────────────── */

export async function logResourceAccess(input: {
  resourceId: string;
  userId: string | null;
  ip: string | null;
  userAgent: string | null;
}): Promise<void> {
  try {
    await nhostGraphQL(
      `mutation InsertResourceAccess($object: catalog_resource_access_logs_insert_input!) {
        insert_catalog_resource_access_logs_one(object: $object) { id }
      }`,
      {
        object: {
          resource_id: input.resourceId,
          user_id: input.userId,
          ip: input.ip,
          user_agent: input.userAgent,
        },
      }
    );
  } catch (error) {
    // Le log ne doit jamais bloquer la livraison d'une ressource déjà autorisée.
    console.error(
      "[MERCO] Échec du log d'accès ressource :",
      error instanceof Error ? error.message : error
    );
  }
}

/* ─────────────────────────── Autorisation ─────────────────────────── */

export async function authorizeResourceAccess(input: {
  resource: CatalogResourceRow;
  userId: string | null;
}): Promise<void> {
  if (!input.resource.is_active) {
    throw new ResourceAccessError(
      "Cette ressource n'est plus disponible.",
      404,
      "inactive"
    );
  }
  if (input.resource.access_level === "public") return;

  if (!input.userId) {
    throw new ResourceAccessError(
      "Une connexion MERCO est requise pour accéder à cette ressource.",
      401,
      "authentication-required"
    );
  }

  if (input.resource.access_level === "premium") {
    const entitlement = await getPremiumEntitlement(input.userId);
    if (!entitlement.isPremium) {
      throw new ResourceAccessError(
        "Cette ressource nécessite un abonnement MERCO Premium actif.",
        403,
        "premium-required"
      );
    }
  }
}

/* ─────────────────────────── Décision de livraison ─────────────────────────── */

export function deliverableUrl(resourceId: string): string {
  const { token, exp } = signDownloadToken(resourceId);
  return `/api/resources/${resourceId}/access?dl=1&t=${token}&exp=${exp}`;
}

/** Décide comment livrer une ressource autorisée (ne livre pas le fichier). */
export function resourceDelivery(
  resource: CatalogResourceRow
): ResourceDecision {
  if (resource.type === "hosted_download") {
    if (resource.file_path) {
      return { kind: "download", url: deliverableUrl(resource.id) };
    }
    if (resource.external_url) {
      return { kind: "redirect", url: resource.external_url };
    }
    return { kind: "none", reason: "missing-file" };
  }

  // external_download, preview, documentation → redirection vers l'URL externe.
  if (resource.external_url) {
    return { kind: "redirect", url: resource.external_url };
  }
  // Fichier hébergé sans URL externe → livrable en téléchargement.
  if (resource.file_path) {
    return { kind: "download", url: deliverableUrl(resource.id) };
  }
  return { kind: "none", reason: "missing-url" };
}

/* ─────────────────────────── Livraison fichier hébergé ─────────────────────────── */

export async function streamHostedFile(resourceId: string): Promise<{
  body: NodeJS.ReadableStream;
  fileName: string;
  mimeType: string;
  size: number;
}> {
  const resource = await loadResourceRowById(resourceId);
  if (!resource || !resource.file_path) {
    throw new ResourceAccessError("Fichier introuvable.", 404, "file-missing");
  }
  const baseDir = process.env.MERCO_RESOURCES_DIR?.trim();
  if (!baseDir) {
    throw new ResourceAccessError(
      "Le stockage des fichiers MERCO n'est pas configuré.",
      501,
      "storage-unconfigured"
    );
  }
  // Jamais de chemins absolus soumis par le client : on ne sert que le
  // nom de fichier (basename) contenu dans le dossier configuré.
  const fileName = path.basename(resource.file_path).trim();
  if (!fileName) {
    throw new ResourceAccessError("Fichier introuvable.", 404, "file-missing");
  }
  const fullPath = path.join(baseDir, fileName);
  try {
    const stat = await fs.promises.stat(fullPath);
    if (!stat.isFile()) {
      throw new ResourceAccessError("Fichier introuvable.", 404, "file-missing");
    }
    const stream = fs.createReadStream(fullPath);
    return {
      body: stream,
      fileName,
      mimeType: guessMimeType(fileName),
      size: stat.size,
    };
  } catch (error) {
    if (error instanceof ResourceAccessError) throw error;
    throw new ResourceAccessError("Fichier introuvable.", 404, "file-missing");
  }
}

function guessMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const table: Record<string, string> = {
    ".pdf": "application/pdf",
    ".zip": "application/zip",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".md": "text/markdown",
    ".txt": "text/plain",
    ".json": "application/json",
    ".mp4": "video/mp4",
    ".exe": "application/octet-stream",
  };
  return table[ext] ?? "application/octet-stream";
}

/* ─────────────────────────── Historique téléchargements ─────────────────────────── */

export type MyDownloadEntry = {
  id: string;
  resourceId: string;
  title: string;
  productId: string;
  productSlug: string;
  productName: string;
  createdAt: string;
};

export async function listUserDownloads(
  userId: string,
  limit = 50
): Promise<MyDownloadEntry[]> {
  try {
    const data = await nhostGraphQL<{
      catalog_resource_access_logs: (ResourceAccessLogRow & {
        resource: CatalogResourceRow & { product: { slug: string; title: string } };
      })[];
    }>(
      `query MyDownloads($userId: uuid!, $limit: Int!) {
        catalog_resource_access_logs(
          where: { user_id: { _eq: $userId } }
          order_by: { created_at: desc }
          limit: $limit
        ) {
          id
          resource_id
          user_id
          created_at
          resource {
            title
            product_id
            product {
              slug
              title
            }
          }
        }
      }`,
      { userId, limit }
    );
    return (data.catalog_resource_access_logs ?? []).map((row) => ({
      id: row.id,
      resourceId: row.resource_id,
      title: row.resource.title,
      productId: row.resource.product_id,
      productSlug: row.resource.product.slug,
      productName: row.resource.product.title,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error(
      "[MERCO] Lecture de l'historique de téléchargements impossible :",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}