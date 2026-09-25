import type { CatalogResourceView } from "@/lib/catalog/types";
import { ResourceActionButton } from "./ResourceActionButton";
import { IconBox, IconCompass, IconCode, IconLayers } from "@/components/icons";

const TYPE_META: Record<
  CatalogResourceView["type"],
  { label: string; Icon: typeof IconBox }
> = {
  hosted_download: { label: "Fichier", Icon: IconBox },
  external_download: { label: "Téléchargement externe", Icon: IconBox },
  preview: { label: "Aperçu", Icon: IconLayers },
  documentation: { label: "Documentation", Icon: IconCode },
};

const ACCESS_META: Record<
  CatalogResourceView["accessLevel"],
  { label: string; className: string }
> = {
  public: {
    label: "Public",
    className: "border-line-soft bg-surface-2 text-slate-300",
  },
  free: {
    label: "Gratuit (compte requis)",
    className: "border-accent/40 bg-accent/10 text-accent-soft",
  },
  premium: {
    label: "Premium",
    className: "border-coral/40 bg-coral/10 text-coral",
  },
};

export function ResourcesList({
  resources,
}: {
  resources: CatalogResourceView[];
}) {
  return (
    <div className="grid gap-4">
      {resources.map((resource) => {
        const typeMeta = TYPE_META[resource.type];
        const accessMeta = ACCESS_META[resource.accessLevel];
        const TypeIcon = typeMeta.Icon;
        return (
          <div
            key={resource.id}
            className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line-soft bg-surface-2 text-accent-soft">
                  <TypeIcon className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-semibold text-white">
                  {resource.title}
                </h3>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${accessMeta.className}`}
                >
                  {accessMeta.label}
                </span>
                <span className="rounded-full border border-line-soft bg-surface-2 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                  {typeMeta.label}
                </span>
                {resource.version ? (
                  <span className="rounded-full border border-line-soft bg-surface-2 px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                    v{resource.version}
                  </span>
                ) : null}
              </div>
              {resource.description ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  {resource.description}
                </p>
              ) : null}
              {resource.changelog ? (
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {resource.changelog}
                </p>
              ) : null}
            </div>
            <div className="shrink-0">
              <ResourceActionButton resource={resource} compact />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ResourcesEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-line-soft p-8 text-center">
      <IconCompass className="mx-auto h-8 w-8 text-muted" />
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Aucune ressource disponible pour ce produit pour le moment.
      </p>
    </div>
  );
}