import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Young People's Advisory Group",
  description:
    "The Young People's Advisory Group (YPAG) puts lived experience at the heart of TBPI's work, giving young people a direct voice in policy and research.",
  openGraph: { title: "Young People's Advisory Group | The Black Policy Institute" },
};

export default function YpagLayout({ children }: { children: React.ReactNode }) {
  return children;
}
