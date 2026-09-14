import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";

const SITE_URL = "https://landinpagesaas.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "MERCO – Applications, Scripts & Solutions SaaS",
  description:
    "Accédez à vie à une bibliothèque d'applications, scripts et solutions SaaS avec MERCO. Paiement unique de 10 000 FCFA.",
  keywords: [
    "MERCO",
    "applications",
    "scripts",
    "solutions SaaS",
    "accès à vie",
    "bibliothèque numérique",
    "développeurs",
    "entrepreneurs",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "MERCO",
    title: "MERCO – Applications, Scripts & Solutions SaaS",
    description:
      "Accédez à vie à une bibliothèque d'applications, scripts et solutions SaaS avec MERCO. Paiement unique de 10 000 FCFA.",
  },
  twitter: {
    card: "summary",
    title: "MERCO – Applications, Scripts & Solutions SaaS",
    description:
      "Accédez à vie à une bibliothèque d'applications, scripts et solutions SaaS avec MERCO.",
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