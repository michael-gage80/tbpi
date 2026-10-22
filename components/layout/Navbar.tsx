"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DURATION, EASE, EASE_IN_OUT } from "@/lib/motion";
import { setSmoothScrollPaused } from "@/components/motion/SmoothScroll";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/policy-areas", label: "Policy Areas" },
  { href: "/programmes", label: "Programmes" },
  { href: "/events", label: "Events" },
  { href: "/media", label: "Media" },
  { href: "/work-with-us", label: "Work With Us" },
  { href: "/contact", label: "Contact" },
  { href: "/staff", label: "Staff" },
];

const HIDE_AFTER = 400;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(true);
  const headerRef = useRef<HTMLElement>(null);

  // Scroll: frosted bar once off the top, hide on the way down, return on the way up,
  // and switch to dark text whenever the bar sits over a light section.
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setAtTop(y < 24);
      if (Math.abs(y - lastY) > 4) {
        setHidden(y > lastY && y > HIDE_AFTER);
        lastY = y;
      }
      const header = headerRef.current;
      if (header) {
        const probeY = header.getBoundingClientRect().bottom / 2;
        setOnDark(isDarkBehind(window.innerWidth / 2, probeY, header));
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    setSmoothScrollPaused(open);
  }, [open]);

  const light = !onDark && !open;

  return (
    <motion.header
      ref={headerRef}
      initial={false}
      animate={{ y: hidden && !open ? "-120%" : "0%" }}
      transition={{ duration: DURATION.fast, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4"
    >
      <nav
        className={cn(
          "mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border px-4 sm:h-[72px] sm:px-6",
          "transition-[background-color,border-color,box-shadow,color] duration-500 ease-[var(--ease)]",
          atTop && !open
            ? "border-transparent bg-transparent"
            : light
              ? "border-black/5 bg-[#F7F5F2]/80 shadow-[0_12px_32px_-18px_rgba(10,10,10,0.25)] backdrop-blur-xl backdrop-saturate-150"
              : "border-white/10 bg-[#0A0A0A]/70 shadow-[0_12px_32px_-18px_rgba(0,0,0,0.6)] backdrop-blur-xl backdrop-saturate-150",
          light ? "text-[#0A0A0A]" : "text-white"
        )}
      >
        <Link href="/" className="relative block h-[44px] w-[130px] shrink-0" aria-label="The Black Policy Institute, home">
          <Image
            src="/images/logo/tbpi-white.png"
            alt=""
            fill
            sizes="130px"
            priority
            className={cn("object-contain transition-opacity duration-500", light ? "opacity-0" : "opacity-100")}
          />
          <Image
            src="/images/logo/logo.png"
            alt=""
            fill
            sizes="130px"
            className={cn("object-contain transition-opacity duration-500", light ? "opacity-100" : "opacity-0")}
          />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 xl:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "link-grow py-1 text-sm font-medium transition-colors",
                  active ? "text-[#E8581A]" : light ? "text-[#0A0A0A]/75 hover:text-[#0A0A0A]" : "text-white/75 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/work-with-us"
            className="group hidden items-center gap-2 rounded-full bg-[#E8581A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#C44A13] xl:inline-flex"
          >
            Commission Us <ArrowRight className="nudge size-4" />
          </Link>

          <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger asChild>
              <button
                className="relative flex size-11 items-center justify-center xl:hidden"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                <span className="sr-only">Menu</span>
                <Burger open={open} />
              </button>
            </DialogPrimitive.Trigger>
            <AnimatePresence>
              {open && (
                <DialogPrimitive.Portal forceMount>
                  <DialogPrimitive.Content
                    forceMount
                    aria-describedby={undefined}
                    className="fixed inset-0 z-[60] outline-none"
                  >
                    <DialogPrimitive.Title className="sr-only">Site menu</DialogPrimitive.Title>
                    <MobileMenu pathname={pathname} onNavigate={() => setOpen(false)} />
                  </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
              )}
            </AnimatePresence>
          </DialogPrimitive.Root>
        </div>
      </nav>
    </motion.header>
  );
}

function MobileMenu({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  return (
    <motion.div
      className="grain relative flex h-full flex-col overflow-y-auto bg-[#0A0A0A] px-6 pb-10 sm:px-10"
      initial={{ clipPath: "circle(0% at calc(100% - 50px) 44px)" }}
      animate={{ clipPath: "circle(150% at calc(100% - 50px) 44px)" }}
      exit={{ clipPath: "circle(0% at calc(100% - 50px) 44px)" }}
      transition={{ duration: 0.7, ease: EASE_IN_OUT }}
      data-lenis-prevent
    >
      {/* Same geometry as the header bar, so the logo and burger don't move */}
      <div className="sticky top-0 z-10 -mx-6 mb-10 bg-[#0A0A0A] px-3 pt-3 sm:-mx-10 sm:px-4">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 text-white sm:h-[72px] sm:px-6">
          <Link href="/" onClick={onNavigate} className="relative block h-[44px] w-[130px]" aria-label="The Black Policy Institute, home">
            <Image src="/images/logo/tbpi-white.png" alt="" fill sizes="130px" className="object-contain" />
          </Link>
          <DialogPrimitive.Close className="flex size-11 items-center justify-center" aria-label="Close menu">
            <Burger open />
          </DialogPrimitive.Close>
        </div>
      </div>
      <p className="eyebrow mb-6 text-white/50">Menu</p>
      <ul className="flex flex-col">
        {navLinks.map((link, i) => {
          const active = isActive(pathname, link.href);
          return (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, ease: EASE, delay: 0.2 + i * 0.05 }}
              className="border-b border-white/10"
            >
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center justify-between py-3 font-heading text-[clamp(1.75rem,7vw,2.75rem)] leading-tight transition-colors",
                  active ? "text-[#E8581A]" : "text-white hover:text-[#E8581A]"
                )}
              >
                {link.label}
                <ArrowRight className="nudge size-5 opacity-40" />
              </Link>
            </motion.li>
          );
        })}
      </ul>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.base, ease: EASE, delay: 0.2 + navLinks.length * 0.05 }}
        className="mt-10"
      >
        <Link
          href="/work-with-us"
          onClick={onNavigate}
          className="group inline-flex items-center gap-2 rounded-full bg-[#E8581A] px-6 py-3.5 font-medium text-white hover:bg-[#C44A13]"
        >
          Commission Us <ArrowRight className="nudge size-4" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

function Burger({ open }: { open: boolean }) {
  const line = "absolute left-1/2 h-[1.5px] w-6 -translate-x-1/2 rounded-full bg-current transition-transform duration-500 ease-[var(--ease)]";
  return (
    <span aria-hidden className="relative block size-6">
      <span className={cn(line, "top-[8px]", open && "translate-y-[4px] rotate-45")} />
      <span className={cn(line, "top-[16px]", open && "-translate-y-[4px] -rotate-45")} />
    </span>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Walk the elements under a point (skipping the header itself) until one has a
// solid background, then judge it by luminance.
function isDarkBehind(x: number, y: number, header: HTMLElement) {
  for (const el of document.elementsFromPoint(x, y)) {
    if (header.contains(el)) continue;
    const bg = getComputedStyle(el).backgroundColor;
    const m = bg.match(/rgba?\(([^)]+)\)/);
    if (!m) continue;
    const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    if (a < 0.5) continue;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 140;
  }
  return false;
}
