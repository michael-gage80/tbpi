"use client";

import { motion } from "framer-motion";

const advisors = [
  {
    name: "Diontre Davis",
    initials: "DD",
    title: "YPAG Co-lead",
    bio: "Diontre brings a background in youth advocacy and community organising, co-leading TBPI's Young People's Advisory Group to ensure young voices are centred in policy development.",
  },
  {
    name: "Nadjah Osman",
    initials: "NO",
    title: "YPAG Co-lead",
    bio: "Nadjah is a civic engagement specialist and education advocate, co-leading the YPAG to bridge the gap between young people and the policy processes that shape their futures.",
  },
];

export function Advisory() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-3xl sm:text-4xl text-[#0A0A0A]">
            Advisory &amp; YPAG Leadership
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
          {advisors.map((advisor, i) => (
            <motion.div
              key={advisor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-[#F7F5F2] rounded-xl p-8 flex gap-6"
            >
              <div className="flex-shrink-0 size-14 rounded-full bg-zinc-200 flex items-center justify-center">
                <span
                  className="text-base font-semibold text-zinc-600"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {advisor.initials}
                </span>
              </div>
              <div>
                <h3 className="text-lg text-[#0A0A0A]">{advisor.name}</h3>
                <p
                  className="text-sm text-[#E8581A] font-medium mb-2"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {advisor.title}
                </p>
                <p
                  className="text-sm text-zinc-600 leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {advisor.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
