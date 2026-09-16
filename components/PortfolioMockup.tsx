import {
  IconBuilding,
  IconCalendar,
  IconCart,
  IconGraduation,
  IconTruck,
  IconUsers,
} from "./icons";

const apps = [
  { label: "CRM", icon: <IconUsers className="h-4 w-4" />, hue: "border-saas/30 bg-saas/10 text-saas" },
  { label: "Réservation", icon: <IconCalendar className="h-4 w-4" />, hue: "border-accent/30 bg-accent/10 text-accent" },
  { label: "E-commerce", icon: <IconCart className="h-4 w-4" />, hue: "border-line-soft bg-surface-2 text-slate-200" },
  { label: "Éducation", icon: <IconGraduation className="h-4 w-4" />, hue: "border-line-soft bg-surface-2 text-slate-200" },
  { label: "RH", icon: <IconBuilding className="h-4 w-4" />, hue: "border-line-soft bg-surface-2 text-slate-200" },
  { label: "Logistique", icon: <IconTruck className="h-4 w-4" />, hue: "border-line-soft bg-surface-2 text-slate-200" },
];

export function PortfolioMockup() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-accent/[0.05] blur-2xl" />

      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line-soft" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-soft/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/50" />
          </span>
          <span className="text-[11px] font-semibold text-muted">
            Votre portefeuille SaaS
          </span>
        </div>

        <div className="relative p-4 sm:p-5">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-2xl"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {apps.map((app) => (
              <div
                key={app.label}
                className="rounded-xl border border-line bg-surface-2/50 p-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border ${app.hue}`}
                  >
                    {app.icon}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Actif
                  </span>
                </div>
                <p className="mt-2.5 truncate text-xs font-semibold text-slate-200">
                  {app.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-accent/30 bg-accent/[0.06] px-4 py-3">
            <p className="text-xs font-semibold text-white">
              Choisissez 2 ou 5 SaaS actifs.
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              MERCO les met en ligne. Vous gérez vos clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}