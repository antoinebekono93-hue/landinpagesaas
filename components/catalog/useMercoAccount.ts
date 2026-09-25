"use client";

import { useEffect, useState } from "react";
import { getNhostClient } from "@/lib/nhost/client";

export type MercoAccountState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  displayName: string | null;
  email: string | null;
  isPremium: boolean;
  /** Données réelles uniquement ; `false` tant qu'aucun backend de facturation n'existe. */
  premiumReason: "no-billing-backend" | "subscription-inactive" | "active";
};

type EntitlementResponse = {
  isAuthenticated: boolean;
  user: { displayName?: string | null; email?: string | null } | null;
  premium: {
    isPremium: boolean;
    reason: "no-billing-backend" | "subscription-inactive" | "active";
  };
};

/** Lecture unique de la session Nhost + état réel de l'entitlement Premium. */
export function useMercoAccount(): MercoAccountState {
  const [state, setState] = useState<MercoAccountState>({
    isLoading: true,
    isAuthenticated: false,
    displayName: null,
    email: null,
    isPremium: false,
    premiumReason: "subscription-inactive",
  });

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      const client = getNhostClient();
      const session = client.getUserSession();
      const accessToken = session?.accessToken ?? null;

      let premium = { isPremium: false, reason: "subscription-inactive" } as {
        isPremium: boolean;
        reason: "no-billing-backend" | "subscription-inactive" | "active";
      };

      const isAuthenticated = Boolean(accessToken);
      let displayName: string | null = null;
      let email: string | null = null;

      if (session?.user) {
        displayName = session.user.displayName ?? null;
        email = session.user.email ?? null;
      }

      if (accessToken) {
        try {
          const res = await fetch("/api/account/entitlement", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (res.ok) {
            const body = (await res.json()) as EntitlementResponse;
            premium = body.premium;
          }
        } catch {
          // L'entitlement reste à son état par défaut (honnête).
        }
      }

      if (!cancelled) {
        setState({
          isLoading: false,
          isAuthenticated,
          displayName,
          email,
          isPremium: Boolean(isAuthenticated && premium.isPremium),
          premiumReason: isAuthenticated
            ? premium.reason
            : "subscription-inactive",
        });
      }
    }

    void resolve();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}