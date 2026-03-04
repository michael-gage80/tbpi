import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | The Black Policy Institute",
    default: "The Black Policy Institute — Evidence-Based Policy, Community-Powered Change",
  },
  description:
    "The Black Policy Institute (TBPI CIC) is a non-partisan racial equity think tank offering research, policy development, DEI consultancy, training, and community empowerment programmes.",
  keywords: [
    "racial equity",
    "think tank",
    "policy research",
    "DEI consultancy",
    "Black British",
    "community empowerment",
    "UK policy",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "The Black Policy Institute",
  },
  twitter: {
    card: "summary_large_image",
    site: "@TBPI_CIC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${dmSerifDisplay.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
