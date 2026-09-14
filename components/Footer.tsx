import { Logo } from "./Logo";

interface FooterProps {
  links?: { label: string; href: string; external?: boolean }[];
}

const defaultLinks = {
  solutions: { href: "#bibliotheque" },
  faq: { href: "#faq" },
};

export function Footer({ links = [] }: FooterProps) {
  const resolvedLinks = [
    { label: "Solutions", href: defaultLinks.solutions.href },
    { label: "FAQ", href: defaultLinks.faq.href },
    ...links,
  ].filter(
    (link, index, all) =>
      all.findIndex((item) => item.label === link.label) === index
  );

  return (
    <footer className="border-t border-line bg-surface/[0.35]">
      <div className="container-page pb-28 pt-12 sm:pb-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <Logo />
          <p className="text-sm text-muted">
            Applications • Scripts • SaaS • Opportunités digitales
          </p>
          {resolvedLinks.length > 0 ? (
            <nav aria-label="Liens du pied de page">
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
                {resolvedLinks.map((link) =>
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
      </div>
    </footer>
  );
}