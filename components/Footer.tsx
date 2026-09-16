import { WHATSAPP_LINK_HOME } from "@/lib/constants";
import { Logo } from "./Logo";

interface FooterProps {
  links?: { label: string; href: string; external?: boolean }[];
  tagline?: string;
}

const produitLinks = [
  { label: "Catalogue SaaS", href: "/creer-saas/catalogue" },
  { label: "Starter", href: "/creer-saas/starter" },
  { label: "Pro", href: "/creer-saas/pro" },
  { label: "Démo", href: "/creer-saas/demo" },
];

const ressourcesLinks = [
  { label: "Comment ça marche", href: "/creer-saas/comment-ca-marche" },
  { label: "FAQ", href: "/creer-saas/faq" },
  { label: "Entrepreneurs", href: "/creer-saas/entrepreneurs" },
];

function LinkList({ items }: { items: { label: string; href: string; external?: boolean }[] }) {
  return (
    <ul className="space-y-2.5 text-sm">
      {items.map((item) =>
        item.external ? (
          <li key={item.label}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-white"
            >
              {item.label}
            </a>
          </li>
        ) : (
          <li key={item.label}>
            <a href={item.href} className="text-muted transition-colors hover:text-white">
              {item.label}
            </a>
          </li>
        )
      )}
    </ul>
  );
}

export function Footer({ links = [], tagline }: FooterProps) {
  const mercoLinks = [
    { label: "Accueil", href: "/" },
    { label: "Bibliothèque", href: "/bibliotheque" },
    { label: "WhatsApp", href: WHATSAPP_LINK_HOME, external: true },
    ...links,
  ].filter(
    (link, index, all) =>
      all.findIndex((item) => item.label === link.label) === index
  );

  return (
    <footer className="border-t border-line bg-surface/[0.35]">
      <div className="container-page pb-28 pt-12 sm:pb-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted">
              {tagline ?? "Applications • Scripts • SaaS • Opportunités digitales"}
            </p>
          </div>

          <nav aria-label="Liens Produit">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-300">
              Produit
            </h2>
            <div className="mt-4">
              <LinkList items={produitLinks} />
            </div>
          </nav>

          <nav aria-label="Liens Ressources">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-300">
              Ressources
            </h2>
            <div className="mt-4">
              <LinkList items={ressourcesLinks} />
            </div>
          </nav>

          <nav aria-label="Liens MERCO">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-300">
              MERCO
            </h2>
            <div className="mt-4">
              <LinkList items={mercoLinks} />
            </div>
          </nav>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="text-center text-xs leading-relaxed text-muted/70">
            MERCO ne garantit aucun revenu. Les droits applicables dépendent de
            chaque solution et de sa licence.
          </p>
          <p className="mt-3 text-center text-xs font-medium text-muted/70">
            © 2026 MERCO Business
          </p>
        </div>
      </div>
    </footer>
  );
}