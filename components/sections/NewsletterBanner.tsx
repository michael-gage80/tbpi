import { NewsletterForm } from "@/components/NewsletterForm";
import { SplitText } from "@/components/motion/SplitText";

export function NewsletterBanner() {
  return (
    <section className="grain bg-[#0A0A0A] py-section text-white">
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <p className="eyebrow mb-6 text-white/50" data-reveal="up">
          Newsletter
        </p>
        <SplitText
          text="Stay ahead of the policy curve"
          accent="policy curve"
          className="text-h2 font-normal"
        />
        <p className="mx-auto mb-10 mt-6 max-w-xl text-lede text-white/60" data-reveal="up">
          Join thousands of practitioners, policymakers and advocates
          receiving our research updates.
        </p>
        <div data-reveal="up" style={{ "--d": "0.1s" } as React.CSSProperties}>
          <NewsletterForm variant="banner" />
        </div>
      </div>
    </section>
  );
}
