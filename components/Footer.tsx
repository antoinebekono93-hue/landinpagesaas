import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface/[0.35]">
      <div className="container-page pb-28 pt-12 sm:pb-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <Logo />
          <p className="text-sm text-muted">
            Applications • Scripts • SaaS • Opportunités digitales
          </p>
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