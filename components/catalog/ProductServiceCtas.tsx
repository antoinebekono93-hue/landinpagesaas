import { waLink } from "@/lib/catalog/cta";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

/**
 * Offre services & tarifs MERCO Business d'un SaaS du catalogue.
 *
 * Chaque CTA adresse une demande RÉELLE à MERCO via WhatsApp (le même canal
 * que le CTA « Choisir ce SaaS » de la fiche). Aucun provisioning automatisé
 * ou fictif : MERCO Business prend en charge la demande et retourne les
 * modalités réelles.
 */

function turnkeyMessage(productName: string): string {
  return `Bonjour MERCO 👋 Je souhaite le pack « Clé en Main » pour ${productName} : achat, installation, sécurisation et mise en ligne sous 48h.`;
}

function installOnlyMessage(productName: string): string {
  return `Bonjour MERCO 👋 Je souhaite l'installation seule de ${productName} sur mon serveur (15 000 FCFA / 29 $).`;
}

function starterMessage(productName: string): string {
  return `Bonjour MERCO 👋 Je souhaite le forfait « Clé en main + Hosting Starter » pour ${productName} (9 900 FCFA/mois).`;
}

function vipMessage(productName: string): string {
  return `Bonjour MERCO 👋 Je souhaite un devis SaaS VIP pour ${productName} : APIs SMS / WhatsApp personnalisées et marque blanche totale.`;
}

const FEATURES = [
  {
    title: "Sous-domaines automatisés",
    text: "Attribution automatique d'URLs uniques à chaque client (ex. votre-saas.clients.com). Mise en ligne sans configuration manuelle.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
        <path d="M5.5 6.5h4M12 4.5c1.5 1 4 3.9 4 7.3" />
        <circle cx="5.5" cy="6.5" r="1.5" />
        <circle cx="12" cy="4.5" r="1.5" />
        <circle cx="3.5" cy="13" r="1.5" />
        <path d="M5 7.8c.8 4.29  pa 0 0 0 0 0 0" opacity="0" />
      </svg>
    ),
  },
  {
    title: "Infrastructure Cloud dédiée",
    text: "Déploiement isolé et optimisé pour la charge sur VPS haute performance (Dokploy/Coolify). Stabilité garantie même en pic.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
        <path d="M5.5 13.5a3.5 3.5 0 0 1-.3-7A4.5 4.5 0 0 1 14 8a3 3 0 0 1-.5 5.5hh" />
        <path d="M10 14l-1.5 3.5M10 14l1.5 3.5M10 14V17.5" />
      </svg>
    ),
  },
  {
    title: "Sécurité & SSL illimités",
    text: "Certificats HTTPS automatiques pour chaque sous-domaine via Cloudflare / Let's Encrypt, renouvelés sans intervention.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
        <rect x="4" y="8.5" width="12" height="8" rx="1.5" />
        <path d="M6.5 8.5V6.5a3.5 3.5 0 0 1 7 0v2M10 12v1.5" />
      </svg>
    ),
  },
  {
    title: "Sauvegardes quotidiennes",
    text: "Backup automatisé chaque nuit, externalisé et chiffré sur AWS S3. Restauration possible en quelques minutes.",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
        <path d="M4 9.5 2.5 11 4 12.5" />
        <path d="M7 4.5 7 5.5l1.5-2" opacity="0" />
        <path d="M6.5 2.5 7.5 5 8.5 2.5" />
        <path d="M4 8.5v1.5h-.5" opacity="0" />
        <path d="M6.2 5.2c-2 .8-3.4 2.4-3.9 4.2" />
        <path d="M16 10.5 17.5 9 16 7.5" />
        <path d="M17 11.5v-2h.5" opacity="0" />
        <path d="M13.8 5.2c2 .8 3.4 2.4 3.9 4.2" />
        <path d="M10 12.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
      </svg>
    ),
  },
];

const PLANS = [
  {
    key: "install",
    badge: null,
    price: "15 000 FCFA",
    priceHint: "(~29 $)",
    period: "paiement unique",
    title: "Installation Seule",
    description: "Installation complète du script sur le serveur de votre client + configuration de base.",
    features: ["Installation du script", "Configuration de base", "Accompagnement WhatsApp"],
    href: installOnlyMessage,
    cta: "Commander l'installation",
  },
  {
    key: "starter",
    badge: "Le plus choisi",
    price: "9 900 FCFA",
    priceHint: "/mois",
    period: "abonnement mensuel",
    title: "Clé en main + Hosting Starter",
    description: "Installation, hébergement managé multi-tenant, SSL illimité et sauvegardes quotidiennes.",
    features: ["Hébergement managé multi-tenant", "SSL illimité", "Sauvegardes quotidiennes", "Support Business"],
    href: starterMessage,
    cta: "Démarrer en 48h",
    highlighted: true,
  },
  {
    key: "vip",
    badge: null,
    price: "Sur devis",
    priceHint: null,
    period: "sur mesure",
    title: "SaaS VIP",
    description: "Configurations avancées, intégration d'APIs de communication personnalisées (SMS / WhatsApp) et marque blanche totale.",
    features: ["APIs SMS & WhatsApp", "Marque blanche totale", "Déploiement sur mesure", "Priorité Business"],
    href: vipMessage,
    cta: "Demander un devis",
  },
];

export function ProductServiceCtas({ productName }: { productName: string }) {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
          Services MERCO Business
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Recommandé pour les entrepreneurs
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-100">
          Pack Clé en Main : votre SaaS prêt à l&apos;emploi
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Nous achetons, installons, sécurisons et mettons en ligne{" "}
          <span className="font-semibold text-slate-100">{productName}</span>. Vous
          n&apos;avez plus qu&apos;à encaisser vos clients.
        </p>
        <a
          href={waLink(turnkeyMessage(productName))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Lancer mon SaaS en 48h sur WhatsApp (nouvel onglet)"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-bold text-slate-950 shadow-[0_12px_32px_-10px] shadow-accent/40 transition-colors hover:bg-accent-strong hover:shadow-accent/50"
        >
          <WhatsAppIcon className="h-5 w-5" />
          Lancer mon SaaS en 48h
        </a>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
          Infrastructure &amp; hébergement
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-line-soft bg-surface-2/60 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                {feature.icon}
              </div>
              <h4 className="mt-3 text-sm font-semibold text-slate-100">{feature.title}</h4>
              <p className="mt-1 text-[13px] leading-relaxed text-muted">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
          Forfaits &amp; tarifs
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className={
                plan.highlighted
                  ? "relative rounded-2xl border border-accent/50 bg-surface-2 p-5 shadow-[0_8px_32px_-12px] shadow-accent/20"
                  : "rounded-2xl border border-line-soft bg-surface-2/60 p-5"
              }
            >
              {plan.badge && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950">
                  {plan.badge}
                </span>
              )}
              <h4 className="text-sm font-bold text-slate-100">{plan.title}</h4>
              <div className="mt-3">
                <span className="text-2xl font-bold tracking-tight text-slate-100">{plan.price}</span>
                {plan.priceHint && <span className="ml-1 text-xs font-semibold text-muted">{plan.priceHint}</span>}
                <p className="text-[11px] text-muted">{plan.period}</p>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">{plan.description}</p>
              <ul className="mt-4 space-y-1.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[13px] text-slate-100">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={waLink(plan.href(productName))}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${plan.cta} pour ${productName} sur WhatsApp (nouvel onglet)`}
                className={
                  plan.highlighted
                    ? "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-accent-strong"
                    : "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line-soft bg-surface-2/60 px-4 py-2.5 text-sm font-semibold text-slate-100 transition-colors hover:border-accent-soft hover:text-white"
                }
              >
                <WhatsAppIcon className="h-4 w-4" />
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          Prix FCFA pour les entrepreneurs africains, USD pour les autres marchés. Paiement unique pour
          l&apos;installation, abonnement mensuel sans engagement pour le hosting.
        </p>
      </div>
    </div>
  );
}
