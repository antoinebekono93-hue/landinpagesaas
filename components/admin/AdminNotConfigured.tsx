export function AdminNotConfigured() {
  const variables = [
    "NEXT_PUBLIC_NHOST_SUBDOMAIN",
    "NEXT_PUBLIC_NHOST_REGION",
    "NHOST_ADMIN_SECRET",
    "ENVATO_API_TOKEN",
    "CATALOG_SYNC_SECRET",
    "CRON_SECRET",
  ];
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-sm">
      <h1 className="text-xl font-bold text-white">Espace admin MERCO</h1>
      <div className="card mt-6 p-6">
        <p className="leading-relaxed text-muted">
          L&apos;espace admin est disponible après configuration de la
          synchronisation Envato → Nhost. Ajoutez ces variables
          d&apos;environnement (jamais préfixées{" "}
          <code className="font-mono">NEXT_PUBLIC_</code> pour les secrets) dans
          Vercel puis redéployez&nbsp;:
        </p>
        <ul className="mt-4 space-y-2">
          {variables.map((name) => (
            <li
              key={name}
              className="rounded-lg border border-line bg-surface-2/40 px-3 py-2 font-mono text-xs text-slate-200"
            >
              {name}
            </li>
          ))}
        </ul>
        <ol className="mt-6 list-decimal space-y-1 pl-5 text-muted">
          <li>Appliquer les migrations Nhost (dossier <code className="font-mono">nhost/</code>).</li>
          <li>
            Appliquer les permissions Hasura décrites dans{" "}
            <code className="font-mono">nhost/permissions.md</code>.
          </li>
          <li>
            Créer un utilisateur avec le rôle <code className="font-mono">admin</code> sur Nhost Auth.
          </li>
          <li>
            Déclencher la première synchronisation{" "}
            <code className="font-mono">GET /api/catalog/sync</code> (Bearer{" "}
            <code className="font-mono">CRON_SECRET</code>).
          </li>
        </ol>
      </div>
    </main>
  );
}