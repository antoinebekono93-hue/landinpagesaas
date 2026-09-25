import { productInstallLink, productHostLink, productLaunchLink } from "@/lib/catalog/cta";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

const SERVICES = [
  { key: "install", label: "Installer", link: productInstallLink },
  { key: "host", label: "Héberger", link: productHostLink },
  { key: "launch", label: "Lancer", link: productLaunchLink },
] as const;

/**
 * CTAs services (Installer / Héberger / Lancer).
 *
 * Chacun adresse une demande RÉELLE à MERCO via WhatsApp (mêmes canaux que le
 * CTA « Choisir ce SaaS »). Aucun provisioning automatisé ou fictif : MERCO
 * prend en charge la demande et retourne les modalités réelles.
 */
export function ProductServiceCtas({ productName }: { productName: string }) {
  return (
    <div className="mt-5 border-t border-line pt-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
        Services MERCO Business
      </p>
      <div className="mt-3 grid gap-2">
        {SERVICES.map((service) => {
          const href = service.link(productName);
          return (
            <a
              key={service.key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Demander le service ${service.label} sur WhatsApp (nouvel onglet)`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line-soft bg-surface-2/60 px-4 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:bg-surface-2"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {service.label}
            </a>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-muted">
        Installation, hébergement, mise en ligne : un accompagnement réel par
        notre équipe Business.
      </p>
    </div>
  );
}