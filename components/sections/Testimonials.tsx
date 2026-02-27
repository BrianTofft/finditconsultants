import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionHeader from "@/components/ui/SectionHeader";
import { TESTIMONIALS } from "@/app/data";
export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll><SectionHeader eyebrow="Kundeanmeldelser" title={<>Hvad siger <span className="text-orange italic">vores kunder?</span></>} sub="Rigtige resultater fra rigtige virksomheder der har brugt vores multi-sourcing service." center /></RevealOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <RevealOnScroll key={t.name} delay={i * 65}>
              <div className={`rounded-2xl p-6 border h-full flex flex-col ${i === 0 ? "bg-[#2d2c2c] border-orange/25 text-white" : "bg-white border-[#ede9e3] hover:border-orange/25 hover:shadow-md transition-all"}`}>
                <div className={`font-serif text-3xl leading-none mb-3 ${i === 0 ? "text-orange" : "text-orange/40"}`}>"</div>
                <p className={`text-sm leading-relaxed flex-1 mb-5 ${i === 0 ? "text-white/75" : "text-charcoal/60"}`}>{t.quote}</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${i === 0 ? "bg-orange text-white" : "bg-orange-light text-orange"}`}>{t.initials}</div>
                  <div>
                    <div className={`font-bold text-sm ${i === 0 ? "text-white" : "text-charcoal"}`}>{t.name}</div>
                    <div className={`text-xs ${i === 0 ? "text-white/45" : "text-charcoal/40"}`}>{t.role} · {t.company}</div>
                  </div>
                  <div className="ml-auto text-orange text-xs">★★★★★</div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
