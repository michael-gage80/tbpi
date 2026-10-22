import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SplitText } from "@/components/motion/SplitText";

const programmes = [
  {
    title: "YPAG",
    subtitle: "Young People's Advisory Group",
    description:
      "YPAG unites exceptional young people across the UK to tackle real policy challenges and keep Black communities' priorities in national debates.",
    href: "/programmes",
  },
  {
    title: "FGLP",
    subtitle: "Future Global Leadership Programme",
    description:
      "A 3-day immersive seminar equipping emerging leaders with the skills, networks and knowledge to drive change on a global stage.",
    href: "/programmes",
  },
];

export function ProgrammesOverview() {
  return (
    <section className="bg-[#F7F5F2] py-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="eyebrow mb-6 text-[#6B6B6B]" data-reveal="up">
          Programmes
        </p>
        <SplitText
          text="Building the next generation of policy leaders."
          accent="policy leaders."
          className="mb-14 max-w-3xl text-h2 font-normal text-[#0A0A0A]"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {programmes.map((prog, i) => (
            <Link
              key={prog.title}
              href={prog.href}
              data-reveal="up"
              style={{ "--d": `${i * 0.12}s` } as React.CSSProperties}
              className="spot lift group flex min-h-[22rem] flex-col rounded-2xl bg-white p-8 sm:p-10"
            >
              <p className="eyebrow text-[#C44A13]">{prog.subtitle}</p>
              <h3 className="mt-6 font-heading text-[clamp(4rem,9vw,7rem)] leading-none tracking-tight text-[#0A0A0A]">
                {prog.title}
              </h3>
              <p className="mt-6 max-w-md leading-relaxed text-zinc-600">{prog.description}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-medium text-[#0A0A0A]">
                Learn more <ArrowRight className="nudge size-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
