interface VerifyFlags {
  saasCandidate: boolean;
  licenseVerified: boolean;
  technicallyVerified: boolean;
  commerciallyAvailable: boolean;
}

interface MercoVerificationStatusProps {
  product: VerifyFlags;
}

type StepKey = "source" | "license" | "technical" | "commercial";

type Step = {
  key: StepKey;
  title: string;
  note: string;
};

const STEPS: Step[] = [
  {
    key: "source",
    title: "Source identifiée",
    note: "Le produit est un candidat SaaS détecté dans le catalogue.",
  },
  {
    key: "license",
    title: "Licence vérifiée",
    note: "La licence d'utilisation a été contrôlée manuellement par MERCO.",
  },
  {
    key: "technical",
    title: "Audit technique",
    note: "La faisabilité technique de mise en production a été validée.",
  },
  {
    key: "commercial",
    title: "Disponibilité MERCO",
    note: "Toutes les conditions manuelles sont réunies pour vendre le produit.",
  },
];

function isDone(key: StepKey, product: VerifyFlags): boolean {
  switch (key) {
    case "source":
      return product.saasCandidate === true;
    case "license":
      return product.licenseVerified === true;
    case "technical":
      return product.technicallyVerified === true;
    case "commercial":
      return Boolean(
        product.saasCandidate === true &&
          product.licenseVerified === true &&
          product.technicallyVerified === true &&
          product.commerciallyAvailable === true
      );
  }
}

export function MercoVerificationStatus({
  product,
}: MercoVerificationStatusProps) {
  const doneCount = STEPS.filter((step) => isDone(step.key, product)).length;
  const mastered = doneCount === STEPS.length;

  return (
    <div
      className="card p-5"
      role="group"
      aria-label="Statut de vérification MERCO"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">
          Vérification MERCO
        </h2>
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
            mastered
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-line-soft bg-surface-2 text-muted"
          }`}
        >
          {doneCount} / {STEPS.length}
        </span>
      </div>

      <ol className="mt-4 space-y-1">
        {STEPS.map((step) => {
          const done = isDone(step.key, product);
          return (
            <li key={step.key} className="flex gap-3">
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${
                  done
                    ? "border-accent/40 bg-accent/15 text-accent"
                    : "border-line-soft bg-surface-2 text-muted"
                }`}
                aria-hidden="true"
              >
                {done ? "✓" : "·"}
              </span>
              <div>
                <p
                  className={`text-sm font-medium ${
                    done ? "text-white" : "text-muted"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted">{step.note}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 border-t border-line-soft pt-3 text-xs leading-relaxed text-muted">
        Statut calculé depuis les vérifications réelles du catalogue. Le
        scoring et la synchronisation Envato ne modifient jamais ces états :
        seule une validation manuelle le permet.
      </p>
    </div>
  );
}