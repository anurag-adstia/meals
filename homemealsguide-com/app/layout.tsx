import type { Metadata } from "next";
import Script from "next/script";
import FunnelLayout from "./components/FunnelLayout";
import MetaPixel from "./components/MetaPixel";

export const metadata: Metadata = {
  metadataBase: new URL("https://homemealsguide.com"),
  title: "Free Home-Delivered Meals for NYC and NJ Medicaid Members",
  openGraph: {
    title: "Free Home-Delivered Meals for NYC & NJ Medicaid Members",
    description: "3 meals a day, 7 days a week, at no cost. Check if you qualify in 30 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID;

  return (
    <html lang="en">
      <body>
        {gtmId && (
          <>
            <Script id="gtm-script" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              />
            </noscript>
          </>
        )}
        <FunnelLayout>{children}</FunnelLayout>
        <MetaPixel />
      </body>
    </html>
  );
}
