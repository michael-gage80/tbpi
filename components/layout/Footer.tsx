"use client";

import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Instagram, Youtube, Mail } from "lucide-react";

const footerLinks = {
  Organisation: [
    { href: "/about", label: "About Us" },
    { href: "/about#team", label: "Our Team" },
    { href: "/about#governance", label: "Governance" },
    { href: "/policy-areas", label: "Policy Areas" },
  ],
  Work: [
    { href: "/research", label: "Research" },
    { href: "/programmes", label: "Programmes" },
    { href: "/programmes/ypag", label: "YPAG" },
    { href: "/programmes/fglp", label: "FGLP" },
    { href: "/programmes/pioneers-of-change", label: "Pioneers of Change" },
  ],
  Engage: [
    { href: "/events", label: "Events" },
    { href: "/media", label: "Media & Press" },
    { href: "/work-with-us", label: "Work With Us" },
    { href: "/contact", label: "Contact" },
  ],
};

const socials = [
  { href: "https://twitter.com/TBPI_CIC", icon: Twitter, label: "Twitter" },
  { href: "https://www.linkedin.com/company/theblackpolicyinstitute", icon: Linkedin, label: "LinkedIn" },
  { href: "https://instagram.com/theblackpolicyinstitute", icon: Instagram, label: "Instagram" },
  { href: "https://www.youtube.com/@TheBlackPolicyInstitute", icon: Youtube, label: "YouTube" },
  { href: "mailto:info@theblackpolicyinstitute.org", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-white/10">
      {/* Newsletter Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-2xl mb-1">Stay Informed</h3>
              <p className="text-white/60 text-sm">
                Policy analysis, research updates and programme news — straight to your inbox.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 md:w-64 px-4 py-2.5 bg-white/5 border border-white/20 rounded-md text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#E8581A] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#E8581A] hover:bg-[#C44A13] text-white text-sm font-medium rounded-md transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-4 -ml-4">
              <Image
                src="/images/logo/tbpi-white.png"
                alt="The Black Policy Institute"
                width={220}
                height={74}
                className="object-contain"
              />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              A non-partisan racial equity think tank driving evidence-based policy,
              community empowerment and systemic change across the UK.
            </p>
            {/* Socials */}
            <div className="flex gap-3 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-[#E8581A] transition-colors"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#E8581A] mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-white/40 text-xs">
          <p>© {new Date().getFullYear()} TBPI CIC. All rights reserved. TBPI CIC is a Community Interest Company registered in England and Wales (Company No. 16768346), operating under the working name The Black Policy Institute. Registered office: 61 Bridge Street, Kington, HR5 3DJ, United Kingdom.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
