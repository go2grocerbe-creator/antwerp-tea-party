import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@/data/site";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sans = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  metadataBase: new URL("https://antwerp-tea-party.vercel.app"),
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    images: [
      {
        url: "/images/shop-interior-wide.jpg",
        width: 1350,
        height: 1800,
        alt: "The Antwerp Tea Party interior",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
