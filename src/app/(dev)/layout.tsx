// Dev gallery layout — reuses the (webflow) stylesheet and ScriptLoader so
// legacy components render identically to how they appear on live pages
// (sliders, IX2 animations, exit popup scripts all initialize). BUT we skip
// SharedHtmlBlock navbar/footer/exit-popup so the dev shell stays minimal.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../(webflow)/globals.css";
import ScriptLoader from "@/components/ScriptLoader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Dev Gallery",
  robots: { index: false, follow: false },
};

export default function DevLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} w-mod-js`}
      data-wf-site="645ab1d97922876b775bef4f"
    >
      <head>
        <link href="/webflow.css" rel="stylesheet" type="text/css" />
      </head>
      <body>
        {children}
        <ScriptLoader />
      </body>
    </html>
  );
}
