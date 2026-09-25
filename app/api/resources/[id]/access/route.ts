import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { apiError, apiOk } from "@/lib/http";
import { authorizeUserRequest } from "@/lib/nhost/server";
import { loadResourceRowById } from "@/lib/catalog/source";
import {
  authorizeResourceAccess,
  logResourceAccess,
  resourceDelivery,
  streamHostedFile,
  verifyDownloadToken,
  ResourceAccessError,
} from "@/lib/catalog/resource-access";

export const dynamic = "force-dynamic";

function respondError(error: unknown) {
  if (error instanceof ResourceAccessError) {
    return apiError(error.message, error.status, { code: error.code });
  }
  return apiError("Erreur d'accès à la ressource.", 500);
}

/**
 * Route d'accès sécurisée aux ressources.
 *
 * - Sans `dl` : vérifie l'autorisation (public / authentifié / Premium), trace
 *   l'accès, puis répond soit par une redirection (ressource externe) soit par
 *   une URL signée courte durée (ressource hébergée).
 * - Avec `dl=1&t=...&exp=...` : livre réellement le fichier hébergé après
 *   validation du jeton signé. Aucun chemin serveur n'est exposé.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(request.url);
  const wantsJson = (request.headers.get("accept") ?? "").includes(
    "application/json"
  );

  /* ── Livraison du fichier hébergé via jeton signé ── */
  const dl = url.searchParams.get("dl");
  if (dl === "1") {
    const token = url.searchParams.get("t") ?? "";
    const exp = url.searchParams.get("exp") ?? "";
    if (!token || !exp || !verifyDownloadToken(id, token, exp)) {
      return apiError(
        "Lien de téléchargement invalide ou expiré.",
        403,
        { code: "invalid-token" }
      );
    }
    try {
      const file = await streamHostedFile(id);
      const webStream = Readable.toWeb(
        file.body as unknown as import("stream").Readable
      ) as unknown as ReadableStream;
      return new NextResponse(webStream, {
        headers: {
          "Content-Type": file.mimeType,
          "Content-Length": String(file.size),
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
            file.fileName
          )}`,
          "Cache-Control": "private, no-store",
        },
      });
    } catch (error) {
      return respondError(error);
    }
  }

  /* ── Décision d'accès (avec autorisation + traçabilité) ── */
  const user = await authorizeUserRequest(request);
  const resource = await loadResourceRowById(id);
  if (!resource) {
    return apiError("Ressource introuvable.", 404, { code: "not-found" });
  }

  try {
    await authorizeResourceAccess({ resource, userId: user?.id ?? null });
  } catch (error) {
    return respondError(error);
  }

  const decision = resourceDelivery(resource);
  await logResourceAccess({
    resourceId: id,
    userId: user?.id ?? null,
    ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: request.headers.get("user-agent"),
  });

  if (decision.kind === "none") {
    return apiError(
      decision.reason === "missing-file"
        ? "Le fichier de cette ressource est en cours de mise en ligne."
        : "Le lien de cette ressource est en cours de mise à jour.",
      422,
      { code: decision.reason }
    );
  }
  if (wantsJson) {
    return apiOk({
      ok: true,
      kind: decision.kind,
      url: decision.kind === "redirect" ? decision.url : undefined,
      deliver: decision.kind === "download" ? decision.url : undefined,
    });
  }
  // Navigation directe sans JavaScript : tout mené côté serveur.
  return NextResponse.redirect(decision.url, 307);
}