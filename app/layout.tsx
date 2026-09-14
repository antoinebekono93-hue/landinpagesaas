import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";

const SITE_URL = "https://merco-landing.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "MERCO – Lancez votre SaaS plus rapidement",
  description:
    "Découvrez des applications, scripts et solutions SaaS avec MERCO. Accès à vie à 10 000 FCFA et démonstration disponible.",
  keywords: [
    "créer un SaaS",
    "lancer un SaaS",
    "micro SaaS",
    "code source SaaS",
    "solution SaaS clé en main",
    "MERCO",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "MERCO",
    title: "MERCO – Lancez votre SaaS plus rapidement",
    description:
      "Découvrez des applications, scripts et solutions SaaS avec MERCO. Accès à vie à 10 000 FCFA et démonstration disponible.",
  },
  twitter: {
    card: "summary",
    title: "MERCO – Lancez votre SaaS plus rapidement",
    description:
      "Découvrez des applications, scripts et solutions SaaS avec MERCO.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}