import { IconChart } from "./icons";

export function ApiCosts() {
  return (
    <section className="section-pad border-t border-line">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-line-soft bg-surface p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                <IconChart className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Certains SaaS utilisent des services externes
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
                  <p>
                    Les coûts liés à des API tierces telles que IA, WhatsApp,
                    SMS, e-mail, téléphonie, passerelles de paiement ou autres
                    services ne sont pas nécessairement inclus dans
                    l&apos;abonnement MERCO.
                  </p>
                  <p>
                    Selon la solution, le client peut devoir connecter ses
                    propres clés API ou payer sa consommation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}