"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CatalogProductRow } from "@/lib/catalog/types";
import type { DashboardStats } from "@/lib/catalog/admin";

interface AdminCatalogWorkspaceProps {
  categories: { key: string; label: string }[];
  sessionEmail: string | null;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: "research", label: "À l'étude" },
  { value: "review", label: "Sélection MERCO" },
  { value: "technical_review", label: "Audit technique" },
  { value: "license_review", label: "Licence en vérification" },
  { value: "active", label: "Actif" },
  { value: "rejected", label: "Rejeté" },
  { value: "archived", label: "Archivé" },
  { value: "source_unavailable", label: "Source indisponible" },
];

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card px-4 py-3">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

function FlagCell({ value }: { value: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
        value
          ? "bg-accent/15 text-accent-soft ring-1 ring-accent-soft/40"
          : "bg-surface-2 text-muted ring-1 ring-line-soft"
      }`}
    >
      {value ? "Oui" : "Non"}
    </span>
  );
}

export function AdminCatalogWorkspace({
  categories,
  sessionEmail,
}: AdminCatalogWorkspaceProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<CatalogProductRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  async function refreshDashboard() {
    try {
      const [statsRes, productsRes] = await Promise.all([
        fetch("/api/admin/dashboard"),
        fetch("/api/admin/products?limit=500"),
      ]);
      if (!statsRes.ok || !productsRes.ok) {
        throw new Error("Impossible de charger le tableau de bord.");
      }
      const statsData = (await statsRes.json()) as { stats: DashboardStats };
      const productsData = (await productsRes.json()) as {
        products: CatalogProductRow[];
      };
      setStats(statsData.stats);
      setProducts(productsData.products);
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Erreur inconnue.");
    }
  }

  useEffect(() => {
    void refreshDashboard();
  }, []);

  async function handleSync() {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/catalog/sync", { method: "POST" });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        startedAt?: string;
      } | null;
      if (!res.ok) {
        throw new Error(data?.error ?? `Échec (${res.status}).`);
      }
      await refreshDashboard();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Erreur de synchronisation."
      );
    } finally {
      setSyncing(false);
    }
  }

  const normalized = search.trim().toLowerCase();
  const filtered = products.filter((product) => {
    if (category !== "all" && product.category_key !== category) return false;
    if (status !== "all" && product.status !== status) return false;
    if (!normalized) return true;
    return [product.title, product.author ?? "", product.slug]
      .join(" ")
      .toLowerCase()
      .includes(normalized);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Catalogue MERCO</h1>
          {sessionEmail ? (
            <p className="mt-1 text-xs text-muted">
              Connecté : {sessionEmail}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="rounded-full border border-accent-soft/60 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent-soft transition-colors hover:bg-accent/20 disabled:opacity-60"
          >
            {syncing ? "Synchronisation…" : "Synchroniser Envato"}
          </button>
          <Link
            href="/creer-saas/catalogue"
            className="rounded-full border border-line-soft px-5 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
          >
            Voir le site public
          </Link>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {stats ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard label="Total produits" value={stats.total} />
          <StatCard label="Nouveaux (7 j)" value={stats.newThisWeek} />
          <StatCard label="À l'étude" value={stats.research} />
          <StatCard label="Sélection MERCO" value={stats.review} />
          <StatCard label="Audit technique" value={stats.technicalReview} />
          <StatCard label="Licence en vérif." value={stats.licenseReview} />
          <StatCard label="Actifs" value={stats.active} />
          <StatCard label="Rejetés" value={stats.rejected} />
          <StatCard
            label={
              stats.lastSync
                ? `Dernière sync : ${stats.lastSync.status ?? "inconnu"}`
                : "Jamais synchronisé"
            }
            value={
              stats.lastSync?.finishedAt
                ? new Date(stats.lastSync.finishedAt).toLocaleDateString("fr-FR")
                : "—"
            }
          />
        </div>
      ) : null}

      {stats?.lastSync?.errorMessage ? (
        <p className="mt-3 rounded-xl border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-warn-soft">
          Sync Envato en échec : {stats.lastSync.errorMessage}
        </p>
      ) : null}

      <div className="mt-10 flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher un produit, un auteur, un slug…"
          className="rounded-full border border-line-soft bg-surface-2/50 px-4 py-2.5 text-sm text-slate-100 outline-none placeholder:text-muted focus:border-accent-soft lg:max-w-xs"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-full border border-line-soft bg-surface-2/50 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-accent-soft"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-full border border-line-soft bg-surface-2/50 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-accent-soft"
        >
          {STATUS_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
        <table className="min-w-full divide-y divide-line text-sm">
          <thead className="bg-surface-2/50 text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-3 py-3 font-semibold">Produit</th>
              <th className="px-3 py-3 font-semibold">Catégorie</th>
              <th className="px-3 py-3 font-semibold">Statut</th>
              <th className="px-3 py-3 font-semibold">Score</th>
              <th className="px-3 py-3 font-semibold">Prix</th>
              <th className="px-3 py-3 font-semibold">Ventes</th>
              <th className="px-3 py-3 font-semibold">Note</th>
              <th className="px-3 py-3 font-semibold">MAJ source</th>
              <th className="px-3 py-3 font-semibold">Licence</th>
              <th className="px-3 py-3 font-semibold">Technique</th>
              <th className="px-3 py-3 font-semibold">Commercial</th>
              <th className="px-3 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((product) => (
              <tr key={product.id} className="text-slate-200">
                <td className="whitespace-nowrap px-3 py-3">
                  <div className="font-medium text-white">{product.title}</div>
                  {product.author ? (
                    <div className="text-xs text-muted">{product.author}</div>
                  ) : null}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {product.category_key}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <span className="rounded-full border border-line-soft bg-surface-2 px-2 py-0.5 text-[11px] text-slate-200">
                    {product.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-3">{product.saas_score}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  {product.regular_price_usd === null
                    ? "—"
                    : `${product.regular_price_usd} $`}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {product.sales_count ?? "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  {product.rating ?? "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-xs text-muted">
                  {product.updated_at_envato
                    ? new Date(product.updated_at_envato).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <FlagCell value={product.license_verified} />
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <FlagCell value={product.technically_verified} />
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <FlagCell value={product.commercially_available} />
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <Link
                    href={`/admin/catalogue/${product.slug}`}
                    className="font-semibold text-accent-soft hover:underline"
                  >
                    Ouvrir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            Aucun produit ne correspond à ces filtres.
          </p>
        ) : null}
      </div>
    </div>
  );
}