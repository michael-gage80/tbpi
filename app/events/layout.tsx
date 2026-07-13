import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Where policy meets community. Join The Black Policy Institute at roundtables, launches, workshops and convenings shaping racial equity in the UK.",
  openGraph: { title: "Events | The Black Policy Institute" },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
