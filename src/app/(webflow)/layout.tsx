import type { Metadata } from "next";
import "./globals.css";
import ScriptLoader from "@/components/ScriptLoader";
import { SharedHtmlBlock } from "@/components/shared/SharedHtmlBlock";

export const metadata: Metadata = {
  title: {
    default: "Los Angeles Moving Company from $119/hr | 4.9\u2605 \u2014 SOS Moving & Storage",
    template: "%s | SOS Moving & Storage",
  },
  description:
    "SOS Moving \u2014 4.9\u2605 rated LA moving company. Local & long-distance moves from $119/hr. Free blankets, shrink wrap & wardrobe boxes included.",
  metadataBase: new URL("https://www.sosmovingla.net"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-mod-js" data-wf-site="645ab1d97922876b775bef4f">
      <head>
        <link href="/webflow.css" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
        {/* Lato: reduced from 10 variants to 3 (400, 400italic, 700).
            Previously webflow.css called font-weight 500/600/800 which weren't
            loaded anyway — browser was already falling back to 400/700.
            Only site-wide impact: font-weight:300 in .w-lightbox-backdrop (Webflow
            lightbox overlay) now renders as 400. Saves ~250KB on initial load. */}
        <link href="https://fonts.googleapis.com/css?family=Lato:400,400italic,700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SharedHtmlBlock name="exit-popup" />
        <SharedHtmlBlock name="navbar" />
        {children}
        <SharedHtmlBlock name="footer" />
        <ScriptLoader />
      </body>
    </html>
  );
}
