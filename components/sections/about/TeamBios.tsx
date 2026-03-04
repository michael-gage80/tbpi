"use client";

import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

const team = [
  {
    name: "Brian Channer",
    initials: "BC",
    title: "CEO & Founder",
    bio: "Brian is a policy strategist and community advocate with 15+ years experience in racial equity, public sector reform and civic leadership.",
    linkedin: "https://linkedin.com/in/brianchanner/",
  },
  {
    name: "Michael Gage",
    initials: "MG",
    title: "Chief Operating Officer",
    bio: "Michael oversees TBPI's operational strategy, partnerships and programme delivery, ensuring the organisation's work achieves maximum impact.",
    linkedin: "https://linkedin.com/in/michaelvgage/",
  },
  {
    name: "Valerie Bossman-Quarshie",
    initials: "VB",
    title: "Executive Director",
    bio: "Valerie brings extensive experience in governance, public leadership and community advocacy, driving TBPI's strategic direction and organisational growth.",
    linkedin: "https://linkedin.com/in/councillor-valerie-owura-ama-wirekvau-bossman-quarshie-66baa560/",
  },
  {
    name: "Mashhuda Kazi",
    initials: "MK",
    title: "Director of Strategy & Policy",
    bio: "Mashhuda leads TBPI's policy research agenda and strategic partnerships, translating evidence into actionable recommendations for institutional and governmental change.",
    linkedin: "https://linkedin.com/in/mashhuda-k-1226a48b/",
  },
];

export function TeamBios() {
  return (
    <section id="team" className="bg-[#F7F5F2] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-3xl sm:text-4xl text-[#0A0A0A]">
            Meet the Team
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-xl p-8 flex gap-6"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 size-16 rounded-full bg-zinc-200 flex items-center justify-center">
                <span
                  className="text-lg font-semibold text-zinc-600"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {member.initials}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg text-[#0A0A0A]">{member.name}</h3>
                    <p
                      className="text-sm text-[#E8581A] font-medium"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {member.title}
                    </p>
                  </div>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-[#0A66C2] transition-colors flex-shrink-0"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <Linkedin className="size-5" />
                  </a>
                </div>
                <p
                  className="mt-3 text-sm text-zinc-600 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
