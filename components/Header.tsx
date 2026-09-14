import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />
        <WhatsAppButton
          location="header"
          ariaLabel="Parler à MERCO sur WhatsApp (nouvel onglet)"
        >
          <span className="hidden sm:inline">Parler à MERCO sur WhatsApp</span>
        </WhatsAppButton>
      </div>
    </header>
  );
}