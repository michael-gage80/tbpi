import { SplitText } from "@/components/motion/SplitText";

const partners = [
  "USC Annenberg",
  "GenBTV",
  "The Voice",
  "NHS",
  "Ministry of Defence",
  "Eastside Community Heritage",
  "KCL",
  "Morgan Stanley",
];

export function PartnersBar() {
  return (
    <section className="bg-white py-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-6 text-[#6B6B6B]" data-reveal="up">
            Partners
          </p>
          <SplitText
            text="Partners and collaborators"
            className="text-h2 font-normal text-[#0A0A0A]"
          />
        </div>

        <div className="marquee-mask overflow-hidden" data-reveal="up">
          <div className="animate-marquee flex w-max" style={{ animationDuration: "45s" }}>
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
                {partners.map((name) => (
                  <li
                    key={name}
                    className="whitespace-nowrap rounded-full border border-[#E5E2DF] bg-[#F7F5F2] px-6 py-3 text-sm font-medium text-[#0A0A0A]"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
