import type { Metadata } from "next";
import { SmoothScroll } from "@/components/mainpage2/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "Los Angeles Moving Company from $119/hr | 4.9 Star — SOS Moving & Storage",
  description:
    "SOS Moving & Storage — licensed and insured movers in LA. Local & long-distance moves from $119/hr. 4.9-star rating, 2,500+ reviews. Free estimate!",
  metadataBase: new URL("https://www.sosmovingla.net"),
  openGraph: {
    title: "SOS Moving Company in Los Angeles",
    description:
      "Full-service local and interstate movers. Licensed, insured, 4.9-star rated.",
    type: "website",
    locale: "en_US",
  },
};

export default function NewDesignRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
