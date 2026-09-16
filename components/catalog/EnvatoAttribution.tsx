export function EnvatoAttribution({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs leading-relaxed text-muted ${className}`}>
      Powered by Envato API · Informations produit issues d&apos;Envato Market.
      MERCO n&apos;est ni affilié à Envato, ni une filiale, ni un service
      officiel Envato. Les prix et statistiques source sont indicatifs et
      susceptibles d&apos;évoluer.
    </p>
  );
}