"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Building2, Briefcase, MessageCircle, Scale, Home } from "lucide-react";

type SiteLink = { href: string; label: string; desc?: string };
type SiteGroup = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  links: SiteLink[];
};

const siteMap: SiteGroup[] = [
  {
    label: "Main",
    icon: Home,
    links: [
      { href: "/", label: "Home", desc: "Our mission, impact and latest work at a glance." },
    ],
  },
  {
    label: "Organisation",
    icon: Building2,
    links: [
      { href: "/about", label: "About Us", desc: "Who we are, our story and what drives our work." },
      { href: "/about#team", label: "Our Team" },
      { href: "/about#governance", label: "Governance" },
      { href: "/policy-areas", label: "Policy Areas", desc: "The domains where we focus our research and advocacy." },
    ],
  },
  {
    label: "Our Work",
    icon: Briefcase,
    links: [
      { href: "/research", label: "Research", desc: "Publications, reports and evidence-based analysis." },
      { href: "/programmes", label: "Programmes", desc: "Leadership and community programmes we run." },
      { href: "/programmes/ypag", label: "Young People's Advisory Group (YPAG)" },
      { href: "/programmes/fglp", label: "Future Global Leadership Programme (FGLP)" },
    ],
  },
  {
    label: "Engage",
    icon: MessageCircle,
    links: [
      { href: "/events", label: "Events", desc: "Upcoming and past roundtables and convenings." },
      { href: "/media", label: "Media & Press", desc: "Podcasts, press coverage and newsletters." },
      { href: "/work-with-us", label: "Work With Us", desc: "Consultancy, partnerships and ways to collaborate." },
      { href: "/contact", label: "Contact", desc: "Get in touch with the team." },
    ],
  },
  {
    label: "Legal",
    icon: Scale,
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

const FadeUp = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function SitemapPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A0A0A] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8581A]" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full text-[#E8581A] bg-[#E8581A]/10 border border-[#E8581A]/30">
              Sitemap
            </span>
            <h1
              className="text-5xl sm:text-6xl font-normal text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Site<span className="text-[#E8581A]">map</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              Every page on The Black Policy Institute site, gathered in one place
              for quick navigation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Groups */}
      <section className="bg-[#F7F5F2] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteMap.map((group, i) => (
            <FadeUp key={group.label} delay={i * 0.08}>
              <div className="bg-white rounded-xl border border-[#E5E2DF] p-6 hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#E8581A]/10 flex items-center justify-center shrink-0">
                    <group.icon className="h-5 w-5 text-[#E8581A]" />
                  </div>
                  <h2
                    className="text-xl font-normal text-[#0A0A0A]"
                    style={{ fontFamily: "var(--font-dm-serif)" }}
                  >
                    {group.label}
                  </h2>
                </div>
                <div className="space-y-1">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-start gap-2.5 rounded-lg px-3 py-2.5 -mx-1 hover:bg-[#F7F5F2] transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-[#E8581A] mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      <span className="min-w-0">
                        <span
                          className="block text-sm font-medium text-[#0A0A0A] leading-snug"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {link.label}
                        </span>
                        {link.desc && (
                          <span className="block text-xs text-[#6B6B6B] mt-0.5 leading-snug">
                            {link.desc}
                          </span>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </>
  );
}
