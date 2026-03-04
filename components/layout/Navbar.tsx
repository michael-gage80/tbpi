"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/policy-areas", label: "Policy Areas" },
  { href: "/programmes", label: "Programmes" },
  { href: "/events", label: "Events" },
  { href: "/media", label: "Media" },
  { href: "/work-with-us", label: "Work With Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-[#0A0A0A] border-b border-white/10 shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo/tbpi-white.png"
            alt="The Black Policy Institute"
            width={160}
            height={54}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === link.href
                  ? "text-[#E8581A]"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA + Mobile */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            size="sm"
            className="hidden lg:flex bg-[#E8581A] hover:bg-[#C44A13] text-white border-0"
          >
            <Link href="/work-with-us">Commission Us</Link>
          </Button>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden text-white p-2" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#0A0A0A] border-white/10 w-[300px]">
              <div className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-3 text-base font-medium rounded-md transition-colors",
                      pathname === link.href
                        ? "text-[#E8581A] bg-white/5"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 px-4">
                  <Button
                    asChild
                    className="w-full bg-[#E8581A] hover:bg-[#C44A13] text-white"
                  >
                    <Link href="/work-with-us" onClick={() => setOpen(false)}>
                      Commission Us
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
