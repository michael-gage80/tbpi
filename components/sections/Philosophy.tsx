import { ScrollRead } from "@/components/motion/ScrollRead";

export function Philosophy() {
  return (
    <section className="bg-[#F7F5F2] py-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="eyebrow mb-10 text-[#6B6B6B]" data-reveal="up">
          What we believe
        </p>
        <ScrollRead
          className="max-w-5xl text-statement text-[#0A0A0A]"
          text="The most effective policy emerges when rigorous data is informed by lived reality, and when communities are not subjects of research but active participants in shaping it."
          accent="lived reality,"
        />
      </div>
    </section>
  );
}
