import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Future Global Leadership Programme",
  description:
    "The Future Global Leadership Programme (FGLP) equips emerging Black leaders with the networks, skills and platform to shape policy and drive change.",
  openGraph: { title: "Future Global Leadership Programme | The Black Policy Institute" },
};

export default function FglpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
