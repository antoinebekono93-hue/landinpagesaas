import { WHATSAPP_LINK_HOME } from "@/lib/constants";
import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";

const navLinks = [
  { label: "Solutions", href: "#bibliotheque" },
  { label: "Opportunités", href: "#valeur" },
  { label: "Comment ça marche", href: "#fonctionnement" },
  { label: "FAQ", href: "#faq" },
];

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        <nav
          aria-label="Navigation principale"
          className="hidden lg:block"
        >
          <ul className="flex items-center gap-7 text-sm text-muted">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppButton
            location="header"
            link={WHATSAPP_LINK_HOME}
            ariaLabel="Parler à MERCO (nouvel onglet)"
          >
            <span className="hidden sm:inline">Parler à MERCO</span>
          </WhatsAppButton>

          <details className="group relative lg:hidden">
            <summary
              aria-label="Ouvrir le menu"
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-line text-slate-200 [&::-webkit-details-marker]:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            </summary>
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-line bg-surface p-3 shadow-2xl shadow-black/40">
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-2 border-t border-line pt-2">
                <WhatsAppButton
                  location="header"
                  link={WHATSAPP_LINK_HOME}
                  size="md"
                  fullWidth
                  ariaLabel="Parler à MERCO (nouvel onglet)"
                >
                  Parler à MERCO
                </WhatsAppButton>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}