import { Logo } from "./Logo";

const nav = [
  { label: "Catalogue", href: "#catalogue" },
  { label: "Comment ça marche", href: "#comment" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="rounded-full border border-line-soft bg-surface px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-saas">
            Business
          </span>
        </div>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#tarifs"
          className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e]"
        >
          Choisir mon plan
        </a>
      </div>
    </header>
  );
}