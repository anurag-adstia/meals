import Script from "next/script";
import ClarityTracker from "./ClarityTracker";
import InitScript from "./InitScript";
import ReplaceShortcodesClient from "./ReplaceShortcodesClient";
import { VoluumScript } from "./VoluumScript";
import "./funnel.css";

/*
 * Shared wrapper for the ad funnel pages (/landers/* and /quiz/*).
 * Loads the tracking stack those pages depend on (window.jitsu, adstiaScripts,
 * VoluumScripts, ...) without adding it to the rest of the content site.
 * GTM is already loaded by the root layout, so it is not repeated here.
 */
export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  const JITSU_EVENT_URL = process.env.NEXT_PUBLIC_JITSU_URL;
  const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID;
  const IP_ADDRESS_API_KEY = process.env.NEXT_PUBLIC_IP_ADDRESS_API_KEY;
  const VOLUUM_URL = process.env.NEXT_PUBLIC_VOLUUM_URL || "";

  return (
    <div className="funnel-root">
      <Script
        id="cf-variables"
        dangerouslySetInnerHTML={{
          __html: `
            window.cf_variable = {
              JITSU_EVENT_URL: "${JITSU_EVENT_URL}",
              GTM_ID: "${GTM_CONTAINER_ID}",
              IP_ADDRESS_API_KEY: "${IP_ADDRESS_API_KEY}"
            }
          `,
        }}
      />
      {/* Jitsu Script */}
      <Script src="https://adstia-scripts.netlify.app/jitsu-script.js" strategy="afterInteractive" />
      {/* Voluum Script */}
      <Script src="https://adstia-scripts.netlify.app/voluum-scripts.js" strategy="afterInteractive" />
      {/* Adstia Script */}
      <Script src="https://adstia-scripts.netlify.app/adstia-scripts.js" strategy="afterInteractive" />
      {/* Content Privacy, Terms, & Partners */}
      <Script src="https://adstia-scripts.netlify.app/content.js" strategy="afterInteractive" />
      {/* UA Parser */}
      <Script id="ua-parser" src="https://cdn.jsdelivr.net/npm/ua-parser-js/dist/ua-parser.min.js" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GTM_CONTAINER_ID}');
        `}
      </Script>

      {children}

      <InitScript />
      <ReplaceShortcodesClient />
      <VoluumScript url={VOLUUM_URL} />
      <ClarityTracker />
    </div>
  );
}
