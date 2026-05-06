import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./styles.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mainpage3-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SOS Moving — Reinventing the Future of Local Moves",
  description:
    "SOS Moving & Storage — licensed and insured movers in LA. Local & long-distance moves. 4.9-star rating, 2,500+ reviews.",
};

export default function Mainpage3Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`mainpage3-root ${geistMono.variable}`}>{children}</div>
  );
}
