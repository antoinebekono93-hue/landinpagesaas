import { Logo } from "./Logo";

interface FooterProps {
  links?: { label: string; href: string; external?: boolean }[];
  tagline?: string;
  /** Si vrai, les liens par défaut (Solutions / FAQ) ne sont pas ajoutés. */
  replaceDefaults?: boolean;
}

const defaultLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "Solutions", href: "#bibliotheque" },
  { label: "FAQ", href: "#faq" },
];

export function Footer({ links = [], tagline, replaceDefaults }: FooterProps) {
  const resolvedLinks = replaceDefaults
    ? [...links]
    : [...defaultLinks, ...links];
  const finalLinks = resolvedLinks.filter(
    (link, index, all) =>
      all.findIndex((item) => item.label === link.label) === index
  );

  return (
    <footer className="border-t border-line bg-surface/[0.35]">
      <div className="container-page pb-28 pt-12 sm:pb-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <Logo />
          <p className="text-sm text-muted">
            {tagline ?? "Applications • Scripts • SaaS • Opportunités digitales"}
          </p>
          {finalLinks.length > 0 ? (
            <nav aria-label="Liens du pied de page">
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
                {finalLinks.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-muted transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </nav>
          ) : null}
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <ul className="space-y-2 text-center text-xs leading-relaxed text-muted/70">
            <li>MERCO ne garantit aucun revenu ou résultat financier.</li>
            <li>MERCO n&apos;est pas nécessairement l&apos;auteur des ressources disponibles.</li>
            <li>
              Les droits d&apos;utilisation dépendent des licences et conditions
              propres aux différentes ressources.
            </li>
          </ul>
        </div>

        <p className="mt-6 text-center text-xs font-medium text-muted/70">
          © 2026 MERCO Business
        </p>
      </div>
    </footer>
  );
}