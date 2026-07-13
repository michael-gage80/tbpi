import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media & Press",
  description:
    "Conversations, analysis and thought leadership on race, equity and policy — across podcast, press and screen — from The Black Policy Institute.",
  openGraph: { title: "Media & Press | The Black Policy Institute" },
};

export default function MediaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
