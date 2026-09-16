"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  CatalogProductRow,
  DemoCredentialRow,
} from "@/lib/catalog/types";
import { PRODUCT_STATUSES, STATUS_BADGES } from "@/lib/catalog/status";
import { EnvatoAttribution } from "@/components/catalog/EnvatoAttribution";
import { IconShield } from "@/components/icons";

function toString(arr?: string[] | null) {
  return arr?.join(", ") ?? "";
}
function fromString(value: string): string[] | null {
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : null;
}

interface AdminProductDetailProps {
  product: CatalogProductRow;
  credentials: DemoCredentialRow[];
  categories: { key: string; label: string }[];
  sessionEmail: string | null;
}

export function AdminProductDetail({
  product: initialProduct,
  credentials: initialCredentials,
  categories,
  sessionEmail,
}: AdminProductDetailProps) {
  const [product, setProduct] = useState(initialProduct);
  const [credentialList, setCredentialList] =
    useState<DemoCredentialRow[]>(initialCredentials);

  const [category, setCategory] = useState(product.category_key);
  const [multiTenantStatus, setMultiTenantStatus] = useState(
    product.multi_tenant_status
  );
  const [whiteLabelStatus, setWhiteLabelStatus] = useState(
    product.white_label_status || ""
  );
  const [techStack, setTechStack] = useState(toString(product.tech_stack));
  const [tags, setTags] = useState(toString(product.tags));
  const [targetCustomers, setTargetCustomers] = useState(
    toString(product.target_customers)
  );
  const [features, setFeatures] = useState(toString(product.features));
  const [dependencies, setDependencies] = useState(
    toString(product.dependencies)
  );
  const [externalCosts, setExternalCosts] = useState(
    toString(product.external_costs)
  );
  const [mercoNotes, setMercoNotes] = useState(product.merco_notes ?? "");
  const [mercoScreenshots, setMercoScreenshots] = useState(
    toString(product.merco_screenshots)
  );
  const [status, setStatus] = useState(product.status);
  const [technicallyVerified, setTechnicallyVerified] = useState(
    product.technically_verified
  );
  const [licenseVerified, setLicenseVerified] = useState(
    product.license_verified
  );
  const [commerciallyAvailable, setCommerciallyAvailable] = useState(
    product.commercially_available
  );
  const [licenseConfirmation, setLicenseConfirmation] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const [newCredRole, setNewCredRole] = useState("");
  const [newCredUsername, setNewCredUsername] = useState("");
  const [newCredPassword, setNewCredPassword] = useState("");
  const [newCredLoginUrl, setNewCredLoginUrl] = useState("");
  const [newCredSourceUrl, setNewCredSourceUrl] = useState("");
  const [newCredPublic, setNewCredPublic] = useState(true);

  const [editingCreds, setEditingCreds] = useState<
    Record<
      string,
      {
        role: string;
        username: string;
        password: string;
        loginUrl: string;
        sourceUrl: string;
        publiclyPublished: boolean;
      }
    >
  >({});
  const [credSavingId, setCredSavingId] = useState<string | null>(null);

  function credentialDisplay(id: string, fallback: DemoCredentialRow) {
    return editingCreds[id] ?? {
      role: fallback.role,
      username: fallback.username,
      password: fallback.password,
      loginUrl: fallback.login_url ?? "",
      sourceUrl: fallback.source_url ?? "",
      publiclyPublished: fallback.publicly_published,
    };
  }

  async function refreshCredentials() {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        credentials?: DemoCredentialRow[];
      };
      if (data.credentials) setCredentialList(data.credentials);
    } catch {
      // Silencieux : les credentials restent affichés tels quels.
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSavedNotice(false);

    if (!product.license_verified && licenseVerified && !licenseConfirmation) {
      setError(
        "Confirmez avoir vérifié les droits et la licence avant d’activer cette case."
      );
      setSaving(false);
      return;
    }
    if (commerciallyAvailable && (!licenseVerified || !technicallyVerified)) {
      setError(
        "La licence et la vérification technique doivent être validées avant de déclarer le produit commercialement disponible."
      );
      setSaving(false);
      return;
    }

    const patch: Record<string, unknown> = {
      category_key: category,
      multi_tenant_status: multiTenantStatus,
      white_label_status: whiteLabelStatus || null,
      tech_stack: fromString(techStack),
      tags: fromString(tags),
      target_customers: fromString(targetCustomers),
      features: fromString(features),
      dependencies: fromString(dependencies),
      external_costs: fromString(externalCosts),
      merco_notes: mercoNotes || null,
      merco_screenshots: fromString(mercoScreenshots),
      status,
      technically_verified: technicallyVerified,
      license_verified: licenseVerified,
      commercially_available: commerciallyAvailable,
      license_confirmation:
        licenseVerified && !product.license_verified ? true : undefined,
    };

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Erreur de sauvegarde.");
      }
      const body = (await res.json()) as { product: CatalogProductRow };
      setProduct(body.product);
      setLicenseConfirmation(false);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 5000);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Erreur inconnue."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleAddCredential(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/products/${product.id}/credentials`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: newCredRole,
            username: newCredUsername,
            password: newCredPassword,
            login_url: newCredLoginUrl || null,
            source_url: newCredSourceUrl || null,
            publicly_published: newCredPublic,
          }),
        }
      );
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Erreur d'ajout.");
      }
      setNewCredRole("");
      setNewCredUsername("");
      setNewCredPassword("");
      setNewCredLoginUrl("");
      setNewCredSourceUrl("");
      setNewCredPublic(true);
      await refreshCredentials();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Erreur inconnue."
      );
    }
  }

  function startEdit(credential: DemoCredentialRow) {
    setEditingCreds((prev) => ({
      ...prev,
      [credential.id]: {
        role: credential.role,
        username: credential.username,
        password: credential.password,
        loginUrl: credential.login_url ?? "",
        sourceUrl: credential.source_url ?? "",
        publiclyPublished: credential.publicly_published,
      },
    }));
  }

  async function handleCredentialAction(
    action: "save" | "delete",
    credential: DemoCredentialRow
  ) {
    setError(null);
    setCredSavingId(credential.id);
    try {
      if (action === "delete") {
        const res = await fetch(
          `/api/admin/products/${product.id}/credentials`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credentialId: credential.id }),
          }
        );
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(body?.error ?? "Erreur de suppression.");
        }
      } else {
        const edits = editingCreds[credential.id];
        if (!edits) return;
        const res = await fetch(
          `/api/admin/products/${product.id}/credentials`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              credentialId: credential.id,
              role: edits.role,
              username: edits.username,
              password: edits.password,
              login_url: edits.loginUrl || null,
              source_url: edits.sourceUrl || null,
              publicly_published: edits.publiclyPublished,
            }),
          }
        );
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(body?.error ?? "Erreur de mise à jour.");
        }
      }
      await refreshCredentials();
      setEditingCreds((prev) => {
        const next = { ...prev };
        delete next[credential.id];
        return next;
      });
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Erreur inconnue."
      );
    } finally {
      setCredSavingId(null);
    }
  }

  const readonlyRows: { label: string; value: string | number | null }[] = [
    { label: "ID Nhost", value: product.id },
    { label: "ID Envato", value: product.envato_item_id },
    { label: "Slug", value: product.slug },
    { label: "Titre Envato", value: product.title },
    { label: "Auteur", value: product.author },
    { label: "URL source", value: product.product_url },
    { label: "URL démo source", value: product.preview_url },
    { label: "Miniature source", value: product.thumbnail_url },
    { label: "Prix source", value: product.regular_price_usd },
    { label: "Prix étendu source", value: product.extended_price_usd },
    { label: "Ventes Envato", value: product.sales_count },
    { label: "Note source", value: product.rating },
    { label: "Score MERCO", value: product.saas_score },
    { label: "Source vérifiée", value: product.source_verified ? "Oui" : "Non" },
    { label: "Candidat SaaS", value: product.saas_candidate ? "Oui" : "Non" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted">
            <Link href="/admin/catalogue" className="font-semibold text-accent-soft hover:underline">
              Catalogue
            </Link>
            <span className="mx-2 text-muted">/</span>
            <span className="text-slate-200">{product.title}</span>
          </p>
          <h1 className="mt-2 text-xl font-bold text-white">
            {product.title}
          </h1>
        </div>
        {sessionEmail ? (
          <p className="text-xs text-muted">Connecté : {sessionEmail}</p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white">
            Données source (lecture seule)
          </h2>
          <dl className="mt-3 space-y-2 text-sm">
            {readonlyRows.map((row) => (
              <div key={row.label} className="flex flex-col">
                <dt className="text-muted">{row.label}</dt>
                <dd className="break-all font-mono text-xs text-slate-200">
                  {row.value === null || row.value === "" ? "—" : String(row.value)}
                </dd>
              </div>
            ))}
          </dl>
          <EnvatoAttribution className="mt-5 border-t border-line pt-4" />
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="card space-y-4 p-5">
            <h2 className="text-sm font-semibold text-white">
              Édition MERCO
            </h2>

            <label className="block text-sm">
              <span className="mb-1 block text-muted">Catégorie</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
              >
                {categories.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-muted">
                Statut produit (admin)
              </span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
              >
                {PRODUCT_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {STATUS_BADGES[item].label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-muted">
                Statut multi-tenant
              </span>
              <select
                value={multiTenantStatus}
                onChange={(event) => setMultiTenantStatus(event.target.value)}
                className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
              >
                <option value="unknown">Inconnu / à auditer</option>
                <option value="true">Oui (multi-tenant)</option>
                <option value="false">Non (single-tenant)</option>
                <option value="needs-audit">À auditer manuellement</option>
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-muted">
                White label (optionnel)
              </span>
              <input
                value={whiteLabelStatus}
                onChange={(event) => setWhiteLabelStatus(event.target.value)}
                placeholder="unknown / true / false"
                className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
              />
            </label>

            {[
              {
                label: "Technologies observées",
                value: techStack,
                setter: setTechStack,
              },
              { label: "Tags", value: tags, setter: setTags },
              {
                label: "Cibles recommandées",
                value: targetCustomers,
                setter: setTargetCustomers,
              },
              { label: "Fonctionnalités", value: features, setter: setFeatures },
              {
                label: "Dépendances",
                value: dependencies,
                setter: setDependencies,
              },
              {
                label: "Coûts externes possibles",
                value: externalCosts,
                setter: setExternalCosts,
              },
            ].map((field) => (
              <label key={field.label} className="block text-sm">
                <span className="mb-1 block text-muted">
                  {field.label} (séparés par des virgules)
                </span>
                <input
                  value={field.value}
                  onChange={(event) => field.setter(event.target.value)}
                  className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
                />
              </label>
            ))}

            <label className="block text-sm">
              <span className="mb-1 block text-muted">
                Notes MERCO (visibles internement)
              </span>
              <textarea
                rows={3}
                value={mercoNotes}
                onChange={(event) => setMercoNotes(event.target.value)}
                className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-muted">
                Captures MERCO (URLs séparées par des virgules)
              </span>
              <input
                value={mercoScreenshots}
                onChange={(event) => setMercoScreenshots(event.target.value)}
                className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
              />
            </label>
          </div>

          <div className="card space-y-4 p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <IconShield className="h-4 w-4 text-accent" />
              Vérifications
            </h2>

            <label className="flex items-start gap-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={technicallyVerified}
                onChange={(event) => setTechnicallyVerified(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-line-soft bg-surface-2 text-accent focus:ring-accent-soft"
              />
              <span>
                Technique vérifié
                <span className="block text-xs text-muted">
                  L&apos;installation et le fonctionnement technique ont été testés
                  ou évalués.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={licenseVerified}
                onChange={(event) => {
                  const next = event.target.checked;
                  setLicenseVerified(next);
                  if (!next) setCommerciallyAvailable(false);
                }}
                className="mt-0.5 h-4 w-4 rounded border-line-soft bg-surface-2 text-accent focus:ring-accent-soft"
              />
              <span>
                Licence vérifiée
                <span className="block text-xs text-muted">
                  Les droits d&apos;utilisation en tant que SaaS ont été vérifiés
                  ( licences SaaS ou multi-tenant autorisées).
                </span>
              </span>
            </label>

            {!product.license_verified && licenseVerified ? (
              <label className="flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/10 p-3 text-xs text-accent-soft">
                <input
                  type="checkbox"
                  checked={licenseConfirmation}
                  onChange={(event) => setLicenseConfirmation(event.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-line-soft bg-surface-2 text-accent focus:ring-accent-soft"
                />
                Je confirme avoir vérifié les droits et la licence nécessaires
                pour l&apos;utilisation MERCO.
              </label>
            ) : null}

            <label className="flex items-start gap-3 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={commerciallyAvailable}
                onChange={(event) => setCommerciallyAvailable(event.target.checked)}
                disabled={!licenseVerified || !technicallyVerified}
                className="mt-0.5 h-4 w-4 rounded border-line-soft bg-surface-2 text-accent focus:ring-accent-soft disabled:opacity-40"
              />
              <span>
                Disponible commercialement
                <span className="block text-xs text-muted">
                  {!licenseVerified || !technicallyVerified
                    ? "Licence et vérification technique requises avant activation."
                    : "Ce produit peut être vendu sous abonnement MERCO Business."}
                </span>
              </span>
            </label>
          </div>

          {error ? (
            <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}
          {savedNotice ? (
            <p className="rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent-soft">
              Modifications enregistrées.
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e] disabled:opacity-60"
            >
              {saving ? "Enregistrement…" : "Enregistrer les modifications"}
            </button>
            <Link
              href={`/creer-saas/catalogue/${product.slug}`}
              className="rounded-full border border-line-soft px-6 py-3 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
            >
              Voir la fiche publique
            </Link>
          </div>
        </form>
      </div>

      <section className="mt-10">
        <h2 className="text-base font-semibold text-white">
          Identifiants démo publics
        </h2>
        <p className="mt-1 text-xs text-muted">
          Ajoutez uniquement des accès de démonstration fournis par
          l&apos;éditeur. Ne jamais publier de secrets Nhost, Envato, purchase
          code, comptes MERCO ou clients.
        </p>

        <div className="mt-4 space-y-4">
          {credentialList.map((credential) => {
            const edits = editingCreds[credential.id];
            const display = credentialDisplay(credential.id, credential);
            return (
              <div
                key={credential.id}
                className="card space-y-3 p-4 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{display.role}</p>
                    <p className="mt-1 text-xs text-muted">
                      {credential.publicly_published
                        ? "Identifiant actuellement public"
                        : "Identifiant non publié"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {edits ? (
                      <>
                        <button
                          type="button"
                          disabled={credSavingId === credential.id}
                          onClick={() =>
                            void handleCredentialAction("save", credential)
                          }
                          className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-slate-950 disabled:opacity-60"
                        >
                          {credSavingId === credential.id
                            ? "…"
                            : "Enregistrer"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingCreds((prev) => {
                              const next = { ...prev };
                              delete next[credential.id];
                              return next;
                            })
                          }
                          className="rounded-full border border-line-soft px-3 py-1.5 text-xs font-semibold text-slate-100 hover:border-accent-soft hover:text-white"
                        >
                          Annuler
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(credential)}
                          className="rounded-full border border-line-soft px-3 py-1.5 text-xs font-semibold text-slate-100 hover:border-accent-soft hover:text-white"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          disabled={credSavingId === credential.id}
                          onClick={() =>
                            void handleCredentialAction("delete", credential)
                          }
                          className="rounded-full border border-red-400/40 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:opacity-60"
                        >
                          {credSavingId === credential.id
                            ? "…"
                            : "Supprimer"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    {
                      label: "Rôle",
                      key: "role" as const,
                      type: "text",
                    },
                    {
                      label: "Identifiant",
                      key: "username" as const,
                      type: "text",
                    },
                    {
                      label: "Mot de passe",
                      key: "password" as const,
                      type: "text",
                    },
                    {
                      label: "URL connexion",
                      key: "loginUrl" as const,
                      type: "text",
                    },
                    {
                      label: "URL source",
                      key: "sourceUrl" as const,
                      type: "text",
                    },
                  ].map((field) => (
                    <label key={field.key} className="text-xs">
                      <span className="mb-1 block text-muted">
                        {field.label}
                      </span>
                      <input
                        type={field.type}
                        value={display[field.key] ?? ""}
                        disabled={!edits}
                        onChange={(event) =>
                          setEditingCreds((prev) => ({
                            ...prev,
                            [credential.id]: {
                              ...(prev[credential.id] ?? display),
                              [field.key]: event.target.value,
                            },
                          }))
                        }
                        className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft disabled:opacity-60"
                      />
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={display.publiclyPublished}
                      disabled={!edits}
                      onChange={(event) =>
                        setEditingCreds((prev) => ({
                          ...prev,
                          [credential.id]: {
                            ...(prev[credential.id] ?? display),
                            publiclyPublished: event.target.checked,
                          },
                        }))
                      }
                      className="h-4 w-4 rounded border-line-soft bg-surface-2 text-accent focus:ring-accent-soft disabled:opacity-40"
                    />
                    Public
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <form
          onSubmit={(event) => void handleAddCredential(event)}
          className="card mt-6 space-y-3 p-5"
        >
          <h3 className="text-sm font-semibold text-white">
            Ajouter un identifiant public
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs">
              <span className="mb-1 block text-muted">Rôle</span>
              <input
                required
                value={newCredRole}
                onChange={(event) => setNewCredRole(event.target.value)}
                placeholder="owner / administrator / driver"
                className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
              />
            </label>
            <label className="text-xs">
              <span className="mb-1 block text-muted">Identifiant</span>
              <input
                required
                value={newCredUsername}
                onChange={(event) => setNewCredUsername(event.target.value)}
                className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
              />
            </label>
            <label className="text-xs">
              <span className="mb-1 block text-muted">Mot de passe</span>
              <input
                required
                value={newCredPassword}
                onChange={(event) => setNewCredPassword(event.target.value)}
                className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
              />
            </label>
            <label className="text-xs">
              <span className="mb-1 block text-muted">URL connexion</span>
              <input
                value={newCredLoginUrl}
                onChange={(event) => setNewCredLoginUrl(event.target.value)}
                className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
              />
            </label>
            <label className="text-xs">
              <span className="mb-1 block text-muted">URL source</span>
              <input
                value={newCredSourceUrl}
                onChange={(event) => setNewCredSourceUrl(event.target.value)}
                className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-3 py-2 text-sm text-slate-100 focus:border-accent-soft"
              />
            </label>
            <label className="flex items-center gap-2 pt-5 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={newCredPublic}
                onChange={(event) => setNewCredPublic(event.target.checked)}
                className="h-4 w-4 rounded border-line-soft bg-surface-2 text-accent focus:ring-accent-soft"
              />
              Public
            </label>
          </div>
          <button
            type="submit"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e]"
          >
            Ajouter l&apos;identifiant
          </button>
        </form>
      </section>
    </div>
  );
}
