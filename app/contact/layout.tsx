import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with The Black Policy Institute — commission research, partner with us, enquire about a programme, or just say hello.",
  openGraph: { title: "Contact | The Black Policy Institute" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
