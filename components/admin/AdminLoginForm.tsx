"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isNhostConfigured } from "@/lib/nhost/config";
import { getNhostClient } from "@/lib/nhost/client";

export function AdminLoginForm({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const configured = isNhostConfigured();

  if (!configured) {
    return (
      <div className={`card p-6 ${className}`}>
        <p className="text-sm leading-relaxed text-muted">
          Connexion indisponible&nbsp;: les variables publiques Nhost ne sont
          pas définies. Renseignez{" "}
          <code className="font-mono">NEXT_PUBLIC_NHOST_SUBDOMAIN</code> et{" "}
          <code className="font-mono">NEXT_PUBLIC_NHOST_REGION</code> puis
          redéployez.
        </p>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const client = getNhostClient();
      const { body: authBody, status: authStatus } =
        await client.auth.signInEmailPassword({ email, password });
      const session = authBody?.session ?? null;
      if (authStatus >= 400 || !session) {
        throw new Error(
          authBody?.mfa
            ? "Authentification à deux facteurs requise."
            : "Email ou mot de passe incorrect."
        );
      }
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: session.accessToken }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Compte non autorisé.");
      }
      router.push("/admin/catalogue");
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Erreur inconnue."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`card space-y-4 p-6 ${className}`}
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-200">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-accent-soft"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-200">
          Mot de passe
        </span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-line-soft bg-surface-2/50 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-accent-soft"
        />
      </label>

      {error ? (
        <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-[#1fce5e] disabled:opacity-60"
      >
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}