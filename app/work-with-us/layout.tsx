import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work With Us",
  description:
    "Commission research, collaborate on projects, or join the team. Partner with The Black Policy Institute to turn evidence into equitable change.",
  openGraph: { title: "Work With Us | The Black Policy Institute" },
};

export default function WorkWithUsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
