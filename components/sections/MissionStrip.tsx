import { SplitText } from "@/components/motion/SplitText";

const pillars = [
  {
    title: "Inspiration",
    description:
      "Spark evidence-based thinking and intellectual courage across communities and institutions.",
  },
  {
    title: "Education",
    description:
      "Build knowledge, capacity and critical understanding through research and programmes.",
  },
  {
    title: "Empowerment",
    description:
      "Transform communities through policy advocacy and civic leadership development.",
  },
];

export function MissionStrip() {
  return (
    <section className="bg-white py-section">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow mb-6 text-[#6B6B6B]" data-reveal="up">
              Our pillars
            </p>
            <SplitText
              text="Three commitments behind every piece of work."
              accent="every"
              className="text-h2 font-normal text-[#0A0A0A]"
            />
          </div>
        </div>

        <ol className="lg:col-span-7">
          {pillars.map((pillar, i) => (
            <li key={pillar.title} className="relative py-10">
              <div
                aria-hidden
                data-reveal="rule"
                className="absolute inset-x-0 top-0 h-px bg-[#0A0A0A]/15"
                style={{ "--d": `${i * 0.12}s` } as React.CSSProperties}
              />
              <div
                data-reveal="up"
                className="grid grid-cols-[3.5rem_1fr] gap-x-6 sm:grid-cols-[5rem_1fr]"
                style={{ "--d": `${0.1 + i * 0.12}s` } as React.CSSProperties}
              >
                <span className="font-heading text-2xl italic text-[#E8581A] sm:text-3xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-h3 text-[#0A0A0A]">{pillar.title}</h3>
                  <p className="mt-3 max-w-xl text-lg leading-relaxed text-zinc-600">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
