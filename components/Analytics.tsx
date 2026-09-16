import Script from "next/script";
import { GA_ID, GOOGLE_ADS_ID } from "@/lib/constants";

const loaderId = GA_ID || GOOGLE_ADS_ID;

export function Analytics() {
  if (!loaderId) return null;

  const configIds = [GA_ID, GOOGLE_ADS_ID].filter(Boolean) as string[];
  const configLines = configIds.map((id) => `gtag('config', '${id}');`).join("\n");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-config" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configLines}`}
      </Script>
    </>
  );
}