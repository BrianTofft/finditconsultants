import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionHeader from "@/components/ui/SectionHeader";
import { STEPS } from "@/app/data";
export default function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-[#f8f6f3]">
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll><SectionHeader eyebrow="Sådan fungerer det" title={<>Fra behov til konsulent — <span className="text-orange italic">i 5 trin</span></>} sub="En simpel, gennemsigtig proces der sparer dig for tid og giver dig det bredeste markedsoverblik." center /></RevealOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative">
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/25 to-transparent" />
          {STEPS.map((s, i) => (
            <RevealOnScroll key={s.n} delay={i * 80}>
              <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg border border-[#ede9e3] hover:border-orange/30 transition-all duration-300 hover:-translate-y-1 h-full relative z-10">
                <div className="w-10 h-10 rounded-full bg-orange-light border-2 border-orange/15 flex items-center justify-center font-bold text-orange text-sm mb-4 group-hover:bg-orange group-hover:text-white transition-all duration-300">{s.n}</div>
                <h3 className="font-bold text-charcoal text-sm mb-2 group-hover:text-orange transition-colors">{s.title}</h3>
                <p className="text-charcoal/50 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
