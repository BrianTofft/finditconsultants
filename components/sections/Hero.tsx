import LeadForm from "./LeadForm";
import Button from "@/components/ui/Button";
import { STATS } from "@/app/data";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80&fit=crop", badge: "70+ aktive leverandører" },
  { src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80&fit=crop", badge: null },
  { src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80&fit=crop", badge: null },
];

export default function Hero() {
  return (
    <section className="bg-[#2d2c2c] pt-16 pb-0 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-12 items-start relative z-10">

        <div className="pb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 mb-8 text-xs font-bold text-white/80">
            <span className="w-2 h-2 rounded-full bg-brand-green" />
            Gratis · 70+ partnere · Svar inden for 3 arbejdsdage
          </div>
          <h1 className="font-bold text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight mb-6">
            Fortæl os hvad I mangler.<br />
            <span className="text-orange">Vi finder konsulenterne.</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
            Gratis og uafhængig multi-sourcing service. Vi aktiverer hele markedet og præsenterer dig for 4–9 relevante kandidater med priser — helt uforpligtende.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Button href="#hero-form" size="lg">Find IT-konsulenter →</Button>
            <Button href="#how" variant="ghost-dark" size="lg">Sådan virker det</Button>
          </div>
          <div className="flex items-center gap-3 mb-10">
            <div className="flex -space-x-2">
              {["LT","MP","SA","MH"].map(i => (
                <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-orange to-orange-dark border-2 border-[#2d2c2c] flex items-center justify-center text-xs font-black text-white">{i}</div>
              ))}
            </div>
            <div className="text-sm">
              <div className="font-bold text-white">+20 tilfredse kunder</div>
              <div className="text-white/45 text-xs">Alle med ★★★★★ anmeldelser</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/6 border border-white/10 rounded-2xl p-4">
                <div className="font-bold text-2xl text-orange">{s.value}</div>
                <div className="text-white/50 text-xs font-semibold mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
            {PHOTOS.map((p, i) => (
              <div key={i} className="relative overflow-hidden h-40 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" loading="lazy" className="w-full h-full object-cover brightness-75 group-hover:scale-105 group-hover:brightness-85 transition-all duration-500" />
                {p.badge && (
                  <div className="absolute bottom-2 left-2 bg-[#2d2c2c]/85 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5 border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                    <span className="text-white text-[10px] font-bold">{p.badge}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-20 pb-8">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
