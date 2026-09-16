"use client";

import { useState } from "react";
import { EVENT_DEMO_CREDENTIAL_COPY } from "@/lib/constants";
import { trackEvent } from "@/lib/tracking";
import type { DemoCredentialView } from "@/lib/catalog/types";

interface PublicDemoCredentialsProps {
  credentials: DemoCredentialView[];
  productId: string;
  envatoItemId: string | null;
  category: string;
  location: string;
}

function CopyField({
  value,
  label,
  onCopy,
}: {
  value: string;
  label: string;
  onCopy: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard indisponible : l'utilisateur peut copier manuellement.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-surface-2/40 px-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
        <p className="truncate font-mono text-sm text-slate-100">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded-full border border-line-soft px-3 py-1.5 text-xs font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
      >
        {copied ? "Copié" : "Copier"}
      </button>
    </div>
  );
}

export function PublicDemoCredentials({
  credentials,
  productId,
  envatoItemId,
  category,
  location,
}: PublicDemoCredentialsProps) {
  const published = credentials.filter((item) => item.publiclyPublished);
  if (published.length === 0) return null;

  function trackCopy(role: string, field: "username" | "password") {
    trackEvent(EVENT_DEMO_CREDENTIAL_COPY, {
      product_id: productId,
      envato_item_id: envatoItemId ?? undefined,
      category,
      location,
      role,
      field,
    });
  }

  return (
    <div className="card p-5">
      <h2 className="text-base font-semibold text-white">
        Identifiants de démonstration
      </h2>
      <div className="mt-2 space-y-1 text-xs leading-relaxed text-muted">
        <p>Identifiants fournis par l&apos;éditeur pour tester la démo.</p>
        <p>À ne pas modifier. Peuvent changer ou être désactivés à tout moment.</p>
        <p>
          Ne jamais saisir de données sensibles dans cette démonstration. Aucun
          identifiant MERCO ou client n&apos;est publié ici.
        </p>
      </div>

      <div className="mt-4 space-y-4">
        {published.map((credential) => (
          <div key={credential.id ?? credential.role} className="space-y-2">
            <p className="text-sm font-semibold text-slate-100">
              {credential.role}
            </p>
            <CopyField
              label="Identifiant"
              value={credential.username}
              onCopy={() => trackCopy(credential.role, "username")}
            />
            <CopyField
              label="Mot de passe"
              value={credential.password}
              onCopy={() => trackCopy(credential.role, "password")}
            />
            {credential.loginUrl ? (
              <a
                href={credential.loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-line-soft px-4 py-2 text-xs font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
              >
                Ouvrir la page de connexion
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}