import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Every page on The Black Policy Institute site, gathered in one place for quick navigation.",
  openGraph: { title: "Sitemap | The Black Policy Institute" },
};

export default function SitemapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
