import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionHeader from "@/components/ui/SectionHeader";
import { TESTIMONIALS } from "@/app/data";

export default function Testimonials() {
  const [featured, ...rest] = TESTIMONIALS;

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader
            eyebrow="Kundeanmeldelser"
            title={<>Hvad siger <span className="text-orange italic">vores kunder?</span></>}
            sub="Rigtige resultater fra rigtige virksomheder der har brugt vores multi-sourcing service."
            center
          />
        </RevealOnScroll>

        {/* Fremhævet stort testimonial */}
        <RevealOnScroll>
          <div className="relative bg-charcoal rounded-3xl p-8 md:p-12 mb-6 overflow-hidden">
            {/* Dekorativt baggrundselement */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange/0 via-orange to-orange/0" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="font-serif text-6xl text-orange/50 leading-none mb-4">"</div>
                <p className="text-white/85 text-lg md:text-xl leading-relaxed italic mb-6 max-w-2xl">
                  {featured.quote}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["★★★★★"].map((s, i) => (
                    <span key={i} className="text-orange text-lg tracking-wider">{s}</span>
                  ))}
                  <span className="text-white/30 text-sm ml-2 self-center">5.0 · Verificeret anmeldelse</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-sm font-black text-white border-2 border-white/20">
                    {featured.initials}
                  </div>
                  <div>
                    <div className="text-white font-bold">{featured.name}</div>
                    <div className="text-white/50 text-sm">{featured.role} · {featured.company}</div>
                  </div>
                </div>
              </div>
              {/* Stats på siden */}
              <div className="flex flex-row md:flex-col gap-4 md:gap-6 flex-shrink-0">
                {[
                  { val: "3", unit: "dage", label: "Til første kandidater" },
                  { val: "6", unit: "profiler", label: "Modtaget og screenet" },
                  { val: "1", unit: "hit", label: "Perfekt match fundet" },
                ].map(s => (
                  <div key={s.label} className="bg-white/8 border border-white/10 rounded-2xl p-4 text-center min-w-[100px]">
                    <span className="font-bold text-2xl text-orange">{s.val}</span>
                    <span className="text-white/50 text-xs ml-1">{s.unit}</span>
                    <div className="text-white/35 text-[10px] mt-1 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Øvrige testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {rest.map((t, i) => (
            <RevealOnScroll key={t.name} delay={i * 60}>
              <div className="bg-white rounded-2xl p-5 border border-[#ede9e3] hover:border-orange/25 hover:shadow-md transition-all h-full flex flex-col">
                <div className="text-orange/40 text-2xl font-serif leading-none mb-2">"</div>
                <p className="text-charcoal/60 text-xs leading-relaxed flex-1 mb-4">{t.quote}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-orange/10 text-orange flex items-center justify-center text-xs font-black flex-shrink-0">{t.initials}</div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-charcoal truncate">{t.name}</div>
                    <div className="text-charcoal/40 text-[10px] truncate">{t.role} · {t.company}</div>
                  </div>
                  <span className="ml-auto text-orange text-[10px] flex-shrink-0">★★★★★</span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
