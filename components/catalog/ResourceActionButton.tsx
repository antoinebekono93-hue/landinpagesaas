"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CatalogResourceView } from "@/lib/catalog/types";
import { getNhostClient } from "@/lib/nhost/client";
import { useMercoAccount } from "./useMercoAccount";

interface ResourceActionButtonProps {
  resource: CatalogResourceView;
  compact?: boolean;
}

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string };

/** Libellé primaire conforme à la spec marketplace (zéro donnée inventée). */
function primaryLabel(resource: CatalogResourceView, isPremium: boolean): string {
  if (resource.type === "preview") return "Voir maintenant";
  if (resource.type === "documentation") return "Consulter";
  if (resource.accessLevel === "premium" && !isPremium) {
    return "Débloquer avec MERCO Premium";
  }
  if (resource.type === "external_download") {
    return resource.accessLevel === "free" ? "Télécharger" : "Télécharger";
  }
  return resource.accessLevel === "free" ? "Télécharger gratuitement" : "Télécharger";
}

export function ResourceActionButton({
  resource,
  compact = false,
}: ResourceActionButtonProps) {
  const account = useMercoAccount();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const isOpenLink =
    resource.type === "preview" || resource.type === "documentation";
  const needsPremium = resource.accessLevel === "premium";
  const needsAuth =
    resource.accessLevel === "free" || resource.accessLevel === "premium";

  // Ressource publique ouverte hors de toute condition → lien direct.
  if (isOpenLink && resource.accessLevel === "public") {
    const canOpen = resource.externalUrl !== null || resource.hasFile;
    return (
      <a
        href={
          resource.externalUrl ?? `/api/resources/${resource.id}/access`
        }
        target={resource.externalUrl ? "_blank" : undefined}
        rel={resource.externalUrl ? "noopener noreferrer" : undefined}
        aria-disabled={!canOpen}
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-accent-soft/50 bg-accent/10 px-4 font-semibold text-accent-soft transition-colors hover:bg-accent/20 disabled:pointer-events-none disabled:opacity-50 ${
          compact ? "py-1.5 text-xs" : "py-2 text-sm"
        }`}
      >
        {primaryLabel(resource, account.isPremium)}
      </a>
    );
  }

  // Premium non débloqué → inviter vers /premium (jamais de téléchargement).
  if (needsPremium && !account.isPremium) {
    return (
      <Link
        href="/premium"
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e] ${
          compact ? "py-1.5 text-xs" : "py-2 text-sm"
        }`}
      >
        Débloquer avec MERCO Premium
      </Link>
    );
  }

  async function handleAccess(event: React.MouseEvent) {
    event.preventDefault();
    if (status.kind === "loading") return;

    // Ressources ouvertes premium/free : aucune URL directe, on passe par la route d'accès.
    if (isOpenLink && resource.accessLevel !== "public" && resource.externalUrl) {
      // Une ressource ouverte avec URL externe est livrée par redirection après autorisation.
    }

    setStatus({ kind: "loading" });
    const session = getNhostClient().getUserSession();
    const token = session?.accessToken ?? null;

    try {
      const res = await fetch(`/api/resources/${resource.id}/access`, {
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        if (mounted.current) {
          setStatus({
            kind: "error",
            message: body?.error ?? "Accès momentanément indisponible.",
          });
        }
        return;
      }
      const body = (await res.json()) as {
        kind?: "redirect" | "download";
        url?: string;
        deliver?: string;
      };
      if (mounted.current) setStatus({ kind: "idle" });
      if (body.kind === "redirect" && body.url) {
        window.location.assign(body.url);
        return;
      }
      if (body.kind === "download" && body.deliver) {
        window.location.href = body.deliver;
        return;
      }
      if (mounted.current) {
        setStatus({
          kind: "error",
          message: "Cette ressource n'est pas encore prête.",
        });
      }
    } catch {
      if (mounted.current) {
        setStatus({ kind: "error", message: "Erreur réseau, réessayez." });
      }
    }
  }

  // Accès conditionnel (gratuit connecté, premium connecté, ressources ouvertes conditionnelles).
  const isButton =
    needsAuth || (isOpenLink && resource.accessLevel !== "public");

  if (isButton) {
    const label = primaryLabel(resource, account.isPremium);
    return (
      <span className="inline-flex flex-col items-start gap-1.5">
        <button
          type="button"
          onClick={(event) => void handleAccess(event)}
          disabled={status.kind === "loading"}
          className={`inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e] disabled:opacity-60 ${
            compact ? "py-1.5 text-xs" : "py-2 text-sm"
          }`}
        >
          {status.kind === "loading" ? "Vérification…" : label}
        </button>
        {status.kind === "error" ? (
          <span className="max-w-xs text-xs leading-relaxed text-warn-soft">
            {status.message}
          </span>
        ) : null}
      </span>
    );
  }

  // Dernier cas : ressource libre publique (download) → bouton direct.
  return (
    <a
      href={`/api/resources/${resource.id}/access`}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e] ${
        compact ? "py-1.5 text-xs" : "py-2 text-sm"
      }`}
    >
      Télécharger
    </a>
  );
}