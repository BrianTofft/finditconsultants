import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="relative py-28 text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&fit=crop" alt="" loading="lazy" className="w-full h-full object-cover brightness-[0.3] saturate-75" />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#1a1919]/70 via-[#2d2c2c]/55 to-[#1a1919]/88" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-orange/15 blur-3xl rounded-full z-[1]" />
      <RevealOnScroll className="relative z-10 max-w-2xl mx-auto px-6">
        <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase text-orange mb-6">
          <span className="w-5 h-px bg-orange" />Klar til at starte?
        </span>
        <h2 className="font-bold text-4xl md:text-5xl text-white leading-tight tracking-tight mb-5">
          Find din næste IT-konsulent <span className="text-orange italic">i dag</span>
        </h2>
        <p className="text-white/55 text-lg leading-relaxed mb-10">Det er gratis, uforpligtende og hurtigt. Beskriv dit behov — vi aktiverer markedet og vender tilbage inden for 3 arbejdsdage.</p>
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <Button href="#hero-form" size="lg">Find IT-konsulenter →</Button>
          <Button href="#partners" variant="ghost-dark" size="lg">Bliv leverandør</Button>
        </div>
        <div className="flex flex-wrap gap-6 justify-center items-center">
          {[["70+","Partnere"],["3 dage","Til overblik"],["0 kr","For kunder"],["100%","Fortroligt"]].map(([val, lbl], i, arr) => (
            <div key={lbl} className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-bold text-3xl text-orange">{val}</div>
                <div className="text-white/45 text-xs font-semibold mt-0.5">{lbl}</div>
              </div>
              {i < arr.length - 1 && <div className="w-px h-8 bg-white/12" />}
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
