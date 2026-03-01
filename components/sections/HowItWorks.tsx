import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionHeader from "@/components/ui/SectionHeader";
import { STEPS } from "@/app/data";

export default function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-[#f8f6f3]">
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader
            eyebrow="Sådan fungerer det"
            title={<>Fra behov til konsulent — <span className="text-orange italic">i 5 trin</span></>}
            sub="En simpel, gennemsigtig proces der sparer dig for tid og giver dig det bredeste markedsoverblik."
            center
          />
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative">
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-orange/40 to-transparent pointer-events-none" />
          {/* Desktop arrow dots */}
          {[1,2,3,4].map(i => (
            <div
              key={i}
              className="hidden lg:block absolute top-[46px] w-3 h-3 rounded-full bg-orange/30 border border-orange/50 pointer-events-none"
              style={{ left: `calc(${i * 20}% - 6px)` }}
            />
          ))}

          {STEPS.map((s, i) => (
            <RevealOnScroll key={s.n} delay={i * 80}>
              <div className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg border border-[#ede9e3] hover:border-orange/30 transition-all duration-300 hover:-translate-y-1 h-full relative z-10">
                {/* Number + icon row */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-light border-2 border-orange/15 flex items-center justify-center font-bold text-orange text-xs shrink-0 group-hover:bg-orange group-hover:text-white transition-all duration-300">
                    {s.n}
                  </div>
                  <span className="text-2xl leading-none" role="img" aria-hidden="true">{s.icon}</span>
                </div>
                <h3 className="font-bold text-charcoal text-sm mb-2 group-hover:text-orange transition-colors">
                  {s.title}
                </h3>
                <p className="text-charcoal/50 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Mobile linear progress indicator */}
        <div className="flex justify-center mt-8 gap-2 sm:hidden">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange/40" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <RevealOnScroll delay={200}>
          <div className="mt-12 text-center">
            <a
              href="#hero-form"
              className="inline-flex items-center gap-2 bg-orange text-white font-bold rounded-full px-8 py-4 text-base hover:bg-orange-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Kom i gang — det er gratis →
            </a>
            <p className="text-charcoal/40 text-xs mt-3">Ingen binding · Svar inden for 3 arbejdsdage</p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
