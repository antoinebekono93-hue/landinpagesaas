"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { getNhostClient } from "@/lib/nhost/client";
import { Logo } from "@/components/Logo";
import { IconSearch } from "@/components/icons";

interface ProfileUser {
  avatarUrl: string;
  displayName: string;
  email?: string;
}

const profileGroups: { title: string; items: { label: string; href: string }[] }[] = [
    {
      title: "Business",
      items: [
        { label: "Mes applications", href: "/creer-saas/mes-applications" },
        { label: "Déploiements", href: "/creer-saas/deploiements" },
        { label: "MERCO Business", href: "/creer-saas" },
      ],
    },
      {
        title: "Ressources",
        items: [
          { label: "Bibliothèque", href: "/bibliotheque" },
          { label: "Catalogue", href: "/creer-saas/catalogue" },
          { label: "Opportunités", href: "/creer-saas/opportunites" },
        ],
      },
];

const desktopNav = [
  { label: "Catalogue", href: "/creer-saas/catalogue" },
  { label: "Opportunités", href: "/creer-saas/opportunites" },
  { label: "Premium", href: "/creer-saas/premium" },
  { label: "MERCO Business", href: "/creer-saas" },
];

export function MercoHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const session = getNhostClient().getUserSession();
    const active = session?.user ?? null;
    if (active) {
      setUser({
        avatarUrl: active.avatarUrl ?? "",
        displayName: active.displayName ?? "",
        email: active.email ?? undefined,
      });
    }
  }, []);

  useEffect(() => {
    if (!profileOpen) return;
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [profileOpen]);

  useEffect(() => {
    if (profileOpen) {
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setProfileOpen(false);
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [profileOpen]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    router.push(`/creer-saas/catalogue${term ? `?q=${encodeURIComponent(term)}` : ""}`);
    setQuery("");
    setMenuOpen(false);
  }

  function handleProfileKey(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      if (!profileOpen) {
        event.preventDefault();
        setProfileOpen(true);
      }
    }
    if (event.key === "Escape" && profileOpen) {
      event.preventDefault();
      setProfileOpen(false);
    }
  }

  function closeProfile() {
    setProfileOpen(false);
    inputRef.current?.focus();
  }

  async function handleSignOut() {
    const session = getNhostClient().getUserSession();
    await getNhostClient().auth.signOut({
      refreshToken: session?.refreshTokenId ?? undefined,
      all: false,
    });
    closeProfile();
    router.replace("/");
  }

  const userInitial = user?.displayName?.trim().charAt(0).toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 text-white backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            aria-label="MERCO – retour à l’accueil"
            className="flex items-center gap-2"
            onClick={() => setMenuOpen(false)}
          >
            <Logo />
            <span className="hidden rounded-full border border-line-soft bg-surface-2 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-saas sm:inline-flex">
              Launchpad
            </span>
          </Link>

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-1 lg:flex"
          >
            {desktopNav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href === "/creer-saas" &&
                  pathname === "/creer-saas" && !pathname.includes("catalogue")) ||
                (item.href === "/creer-saas/catalogue" &&
                  pathname.startsWith("/creer-saas/catalogue"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-surface-2 text-white"
                      : "text-muted hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden items-center xl:flex"
          >
            <label htmlFor="merco-search" className="relative block">
              <span className="sr-only">Rechercher un SaaS dans le catalogue</span>
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                ref={inputRef}
                id="merco-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un SaaS…"
                className="w-48 rounded-full border border-line-soft bg-surface-2/50 py-2 pl-9 pr-3 text-sm text-slate-100 outline-none transition-all placeholder:text-muted focus:w-64 focus:border-accent-soft"
              />
            </label>
          </form>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              aria-label={profileOpen ? "Fermer le menu profil" : "Ouvrir le menu profil"}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
              onKeyDown={handleProfileKey}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line-soft bg-surface-2/50 transition-colors hover:border-accent-soft"
            >
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </button>

            {profileOpen ? (
              <div
                role="menu"
                aria-label="Profil"
                className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-line bg-surface p-2 pb-1 shadow-2xl shadow-black/40"
              >
                {user ? (
                  <div className="border-b border-line-soft px-3 pb-3 pt-2">
                    <p className="text-sm font-semibold text-white">
                      {user.displayName}
                    </p>
                    {user.email ? (
                      <p className="mt-0.5 truncate text-xs text-muted">
                        {user.email}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {profileGroups.map((group) => (
                  <div key={group.title} role="none">
                    <p
                      role="none"
                      className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-widest text-muted"
                    >
                      {group.title}
                    </p>
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        onClick={closeProfile}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-surface-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}

                {user ? (
                  <div role="none">
                    <p
                      role="none"
                      className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-widest text-muted"
                    >
                      Compte
                    </p>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 transition-colors hover:bg-surface-2 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
                    >
                      Se déconnecter
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-soft text-slate-200 lg:hidden"
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
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h10" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-line bg-surface/95 backdrop-blur lg:hidden">
          <div className="container-page py-4">
            <ul className="space-y-1">
              {desktopNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-surface-2 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 border-t border-line pt-3">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted">
                Mon espace
              </p>
              {[
                { label: "Mes applications", href: "/creer-saas/mes-applications" },
                { label: "Déploiements", href: "/creer-saas/deploiements" },
                { label: "Bibliothèque", href: "/bibliotheque" },
                { label: "Accueil", href: "/" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-surface-2 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}