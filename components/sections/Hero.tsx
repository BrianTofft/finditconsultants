"use client";
import { useEffect, useState } from "react";
import LeadForm from "./LeadForm";
import Button from "@/components/ui/Button";
import { STATS } from "@/app/data";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80&fit=crop", badge: "70+ aktive leverandører", alt: "IT-team samarbejder om projekt på kontor" },
  { src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80&fit=crop", badge: null, alt: "Professionelt forretningsmøde med IT-konsulenter" },
  { src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80&fit=crop", badge: null, alt: "Strategisk IT-planlægning og dataanalyse" },
];

const NOTIFICATIONS = [
  { icon: "📩", text: "Ny forespørgsel modtaget — 70+ leverandører notificeret", time: "Nu" },
  { icon: "✅", text: "Konsulent fundet til DSV A/S — under 3 dage", time: "4 min" },
  { icon: "👤", text: "7 screenede kandidater klar til gennemgang", time: "11 min" },
  { icon: "🤝", text: "Kontrakt underskrevet — PFA Pension", time: "32 min" },
  { icon: "📋", text: "Rockwool modtog 6 konsulentprofiler til review", time: "1 t" },
  { icon: "⚡", text: "William Demant søger Azure-arkitekt — aktiveret nu", time: "2 t" },
  { icon: "✅", text: "Coop fandt den rette IT-konsulent på rekordtid", time: "3 t" },
  { icon: "📡", text: "Nordic Bioscience — markedet aktiveret med det samme", time: "I dag" },
];

function LiveNotification() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % NOTIFICATIONS.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const n = NOTIFICATIONS[idx];
  return (
    <div className={`flex items-center gap-3 bg-white border border-[#ede9e3] rounded-2xl px-4 py-3 shadow-md transition-all duration-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
      <span className="text-lg">{n.icon}</span>
      <span className="text-xs font-semibold text-charcoal flex-1">{n.text}</span>
      <span className="text-[10px] text-charcoal/35 font-bold whitespace-nowrap">{n.time}</span>
      <span className="w-2 h-2 rounded-full bg-green animate-pulse flex-shrink-0" />
    </div>
  );
}

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-[#f8f6f3] via-white to-[#fff4ee] pt-16 pb-0 relative overflow-hidden">
      {/* Dekorative blobs */}
      <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-orange/6 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange/4 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      {/* Dot-mønster */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{ backgroundImage: "radial-gradient(circle, #e8632a 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-12 items-start relative z-10">
        <div className="pb-16 pt-4">

          {/* Live notifikation */}
          <div className="mb-8 max-w-sm">
            <LiveNotification />
          </div>

          {/* Headline */}
          <h1 className="font-bold text-5xl lg:text-6xl text-charcoal leading-[1.08] tracking-tight mb-6">
            Fortæl os hvad I mangler.<br />
            <span className="relative inline-block pb-2">
              <span className="text-orange">Vi finder konsulenterne.</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M2 6 Q75 2 150 5 Q225 8 298 4" stroke="#2d2c2c" strokeWidth="3" strokeLinecap="round" fill="none" className="draw-underline"/>
              </svg>
            </span>
          </h1>

          <p className="text-charcoal/60 text-lg leading-relaxed mb-8 max-w-lg">
            Gratis og uafhængig multi-sourcing service. Vi aktiverer hele markedet og præsenterer dig for 4–9 relevante kandidater med priser — helt uforpligtende.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Button href="#hero-form" size="lg">Find IT-konsulenter →</Button>
            <Button href="#how" variant="ghost-light" size="lg">Sådan virker det</Button>
          </div>

          {/* Social proof avatarer */}
          <div className="flex items-center gap-3 mb-10 p-4 bg-white/70 border border-[#ede9e3] rounded-2xl max-w-sm shadow-sm">
            <div className="flex -space-x-2">
              {["LT","MP","SA","MH"].map(i => (
                <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-orange to-orange-dark border-2 border-white flex items-center justify-center text-xs font-black text-white shadow-sm">{i}</div>
              ))}
            </div>
            <div>
              <div className="font-bold text-charcoal text-sm">+20 tilfredse kunder</div>
              <div className="text-charcoal/45 text-xs flex items-center gap-1">
                <span className="text-orange">★★★★★</span> 5.0 gennemsnitlig rating
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {STATS.map(s => (
              <div key={s.label} className="bg-white border border-[#ede9e3] shadow-sm rounded-2xl p-4 hover:border-orange/30 hover:shadow-md transition-all group">
                <div className="font-bold text-2xl text-orange group-hover:scale-105 transition-transform inline-block">{s.value}</div>
                <div className="text-charcoal/50 text-xs font-semibold mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Foto-strip */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden shadow-lg border border-[#ede9e3]">
            {PHOTOS.map((p, i) => (
              <div key={i} className="relative overflow-hidden h-40 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} loading="lazy" className="w-full h-full object-cover brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent" />
                {p.badge && (
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                    <span className="text-charcoal text-[10px] font-bold">{p.badge}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Form */}
        <div className="lg:sticky lg:top-20 pb-8">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
