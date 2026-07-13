import type { Metadata } from "next";

// The page itself is a client component ("use client") and cannot export
// metadata, so this segment layout supplies the per-page title/description.
export const metadata: Metadata = {
  title: "Programmes",
  description:
    "TBPI's programmes develop the next generation of Black leaders — from the Future Global Leadership Programme to the Young People's Advisory Group.",
  openGraph: { title: "Programmes | The Black Policy Institute" },
};

export default function ProgrammesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
