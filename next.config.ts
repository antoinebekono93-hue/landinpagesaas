import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/creer-saas/launchpad/decouvrir",
        destination: "/creer-saas/catalogue",
        permanent: true,
      },
      {
        source: "/creer-saas/launchpad/catalogue/:slug",
        destination: "/creer-saas/catalogue/:slug",
        permanent: true,
      },
      {
        source: "/creer-saas/launchpad/catalogue",
        destination: "/creer-saas/catalogue",
        permanent: true,
      },
      {
        source: "/creer-saas/launchpad/opportunites",
        destination: "/creer-saas/opportunites",
        permanent: true,
      },
      {
        source: "/creer-saas/launchpad/enregistres",
        destination: "/creer-saas/enregistres",
        permanent: true,
      },
      {
        source: "/creer-saas/launchpad/deploiements",
        destination: "/creer-saas/deploiements",
        permanent: true,
      },
      {
        source: "/creer-saas/launchpad/mes-applications",
        destination: "/creer-saas/mes-applications",
        permanent: true,
      },
      {
        source: "/creer-saas/launchpad",
        destination: "/creer-saas/catalogue",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;