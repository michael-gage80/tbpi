"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Twitter, Linkedin, Instagram, Youtube, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const teamContacts = [
  {
    initials: "BC",
    name: "Brian Channer",
    role: "CEO & Founder",
    email: "brian@tbpi.co.uk",
    note: "Partnerships, commissions, speaking",
  },
  {
    initials: "MG",
    name: "Michael Gage",
    role: "Chief Operating Officer",
    email: "michael@tbpi.co.uk",
    note: "Operations, programmes, general enquiries",
  },
  {
    initials: "NA",
    name: "Nathaniel Adeleye",
    role: "Communications Director",
    email: "press@tbpi.co.uk",
    note: "Media, press, interviews",
  },
  {
    initials: "GE",
    name: "General Enquiries",
    role: "TBPI",
    email: "info@tbpi.co.uk",
    note: "All other enquiries",
  },
];

const socials = [
  { icon: Twitter, label: "Twitter / X", href: "https://twitter.com/TBPI_CIC", handle: "@TBPI_CIC" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/tbpi", handle: "The Black Policy Institute" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/tbpi_cic", handle: "@tbpi_cic" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@tbpi", handle: "TBPI Official" },
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

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
              Contact
            </span>
            <h1
              className="text-5xl sm:text-6xl font-normal text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Get in{" "}
              <span className="text-[#E8581A]">Touch</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              Whether you want to commission research, partner with us, enquire
              about a programme or just say hello — we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#F7F5F2] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <FadeUp>
                <div className="bg-white rounded-2xl p-8 border border-[#E5E2DF] shadow-sm">
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <CheckCircle className="h-16 w-16 text-[#E8581A] mb-4" />
                      <h3
                        className="text-2xl font-normal text-[#0A0A0A] mb-2"
                        style={{ fontFamily: "var(--font-dm-serif)" }}
                      >
                        Message sent!
                      </h3>
                      <p className="text-[#6B6B6B] max-w-sm">
                        Thank you for getting in touch. We'll respond within 2
                        working days.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="mt-6 text-sm text-[#E8581A] hover:underline"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2
                        className="text-2xl font-normal text-[#0A0A0A] mb-6"
                        style={{ fontFamily: "var(--font-dm-serif)" }}
                      >
                        Send Us a Message
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <Label
                              htmlFor="name"
                              className="text-sm font-medium text-[#0A0A0A] mb-1.5 block"
                            >
                              Full Name <span className="text-[#E8581A]">*</span>
                            </Label>
                            <Input
                              id="name"
                              required
                              placeholder="Your full name"
                              className="border-[#E5E2DF] focus-visible:ring-[#E8581A]"
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="org"
                              className="text-sm font-medium text-[#0A0A0A] mb-1.5 block"
                            >
                              Organisation
                            </Label>
                            <Input
                              id="org"
                              placeholder="Your organisation"
                              className="border-[#E5E2DF] focus-visible:ring-[#E8581A]"
                            />
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-[#0A0A0A] mb-1.5 block"
                          >
                            Email Address <span className="text-[#E8581A]">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="border-[#E5E2DF] focus-visible:ring-[#E8581A]"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-[#0A0A0A] mb-1.5 block">
                            Enquiry Type <span className="text-[#E8581A]">*</span>
                          </Label>
                          <Select
                            required
                            onValueChange={setInquiryType}
                          >
                            <SelectTrigger className="border-[#E5E2DF] focus:ring-[#E8581A]">
                              <SelectValue placeholder="What are you enquiring about?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="commission">Commission Research</SelectItem>
                              <SelectItem value="partner">Partner With Us</SelectItem>
                              <SelectItem value="pioneers">Pioneers of Change Programme</SelectItem>
                              <SelectItem value="fglp">Future Global Leadership Programme</SelectItem>
                              <SelectItem value="ypag">YPAG Application</SelectItem>
                              <SelectItem value="media">Media / Press Enquiry</SelectItem>
                              <SelectItem value="speaking">Speaking Engagement</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor="message"
                            className="text-sm font-medium text-[#0A0A0A] mb-1.5 block"
                          >
                            Message <span className="text-[#E8581A]">*</span>
                          </Label>
                          <Textarea
                            id="message"
                            required
                            rows={5}
                            placeholder="Tell us about your enquiry..."
                            className="border-[#E5E2DF] focus-visible:ring-[#E8581A] resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-[#E8581A] hover:bg-[#C44A13] text-white h-12 flex items-center gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Send Message
                        </Button>
                      </form>
                    </>
                  )}
                </div>
              </FadeUp>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Team contacts */}
              <FadeUp delay={0.1}>
                <div>
                  <h3
                    className="text-xl font-normal text-[#0A0A0A] mb-4"
                    style={{ fontFamily: "var(--font-dm-serif)" }}
                  >
                    Direct Contacts
                  </h3>
                  <div className="space-y-3">
                    {teamContacts.map((c) => (
                      <div
                        key={c.email}
                        className="bg-white rounded-xl p-4 border border-[#E5E2DF]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0A0A0A] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {c.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#0A0A0A] truncate">
                              {c.name}
                            </p>
                            <p className="text-xs text-[#6B6B6B]">{c.role}</p>
                          </div>
                        </div>
                        <div className="mt-3 pl-12">
                          <a
                            href={`mailto:${c.email}`}
                            className="text-xs text-[#E8581A] hover:underline flex items-center gap-1"
                          >
                            <Mail className="h-3 w-3" />
                            {c.email}
                          </a>
                          <p className="text-xs text-[#6B6B6B] mt-0.5">
                            {c.note}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>

              {/* Address */}
              <FadeUp delay={0.2}>
                <div className="bg-white rounded-xl p-5 border border-[#E5E2DF]">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#E8581A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#0A0A0A] mb-1">
                        Location
                      </h4>
                      <p className="text-sm text-[#6B6B6B] leading-relaxed">
                        The Black Policy Institute CIC
                        <br />
                        Catford, London
                        <br />
                        SE6
                      </p>
                    </div>
                  </div>
                </div>
              </FadeUp>

              {/* Socials */}
              <FadeUp delay={0.3}>
                <div className="bg-white rounded-xl p-5 border border-[#E5E2DF]">
                  <h4 className="text-sm font-semibold text-[#0A0A0A] mb-4">
                    Follow Us
                  </h4>
                  <div className="space-y-3">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-md bg-[#F7F5F2] group-hover:bg-[#E8581A] flex items-center justify-center transition-colors">
                          <s.icon className="h-4 w-4 text-[#6B6B6B] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#0A0A0A]">
                            {s.label}
                          </p>
                          <p className="text-xs text-[#6B6B6B]">{s.handle}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
