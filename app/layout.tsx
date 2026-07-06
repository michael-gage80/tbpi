import type { Metadata } from "next";
import Script from "next/script";
import { DM_Serif_Display, Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/CookieBanner";
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
    template: "The Black Policy Institute | %s",
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
  // Google Search Console ownership — keep even after verification succeeds.
  verification: {
    google: "GQg1UFItemwZ7GJoKanGoKPOvj_IMULCVkl3JVyb5U0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${dmSerifDisplay.variable} ${inter.variable}`}>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LHXMQ2RF68"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-LHXMQ2RF68');
          `}
        </Script>
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
