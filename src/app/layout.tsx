import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
    <html lang="en" className="w-mod-js">
      <head>
        {/* Webflow CSS */}
        <link href="/webflow.css" rel="stylesheet" type="text/css" />
        {/* Google Fonts - Lato */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css?family=Lato:100,100italic,300,300italic,400,400italic,700,700italic,900,900italic" rel="stylesheet" />
        {/* Slick carousel CSS */}
        <link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css" rel="stylesheet" />
        {/* Datepicker CSS */}
        <link href="https://cdnjs.cloudflare.com/ajax/libs/datepicker/1.0.10/datepicker.min.css" rel="stylesheet" />
        {/* Select2 CSS */}
        <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css" rel="stylesheet" />
      </head>
      <body>
        {children}

        {/* jQuery - must load first */}
        <Script src="https://code.jquery.com/jquery-3.7.1.min.js" strategy="beforeInteractive" />
        {/* Slick Carousel */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js" strategy="afterInteractive" />
        {/* Masonry */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js" strategy="afterInteractive" />
        {/* Select2 */}
        <Script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js" strategy="afterInteractive" />
        {/* Datepicker */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/datepicker/1.0.10/datepicker.min.js" strategy="afterInteractive" />
        {/* Input Mask */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/5.0.8/jquery.inputmask.min.js" strategy="afterInteractive" />
        {/* GSAP */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js" strategy="afterInteractive" />
        {/* Finsweet ScrollDisable */}
        <Script src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-scrolldisable@1/scrolldisable.js" strategy="afterInteractive" />
        {/* Webflow JS chunks */}
        <Script src="/webflow.schunk.f2efb3c5440a81cf.js" strategy="afterInteractive" />
        <Script src="/webflow.schunk.81d31091c363b462.js" strategy="afterInteractive" />
        <Script src="/webflow.schunk.f919141e3448519b.js" strategy="afterInteractive" />
        <Script src="/webflow.987c289e.df925483dbcdb1a9.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
