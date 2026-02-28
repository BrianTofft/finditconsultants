"use client";
import { useEffect, useRef, useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const COUNTERS = [
  { end: 120, suffix: "+", label: "Opgaver løst", icon: "✅", desc: "succesfulde matchmakings" },
  { end: 580, suffix: "+", label: "Konsulenter præsenteret", icon: "👤", desc: "screenede kandidater leveret" },
  { end: 70, suffix: "+", label: "Aktive partnere", icon: "🤝", desc: "konsulenthuse og bureauer" },
];

function AnimatedCount({ end, suffix, active }: { end: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, end]);

  return <span>{count}{suffix}</span>;
}

export default function StatsCounter() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 bg-charcoal relative overflow-hidden">
      {/* Dekorative elementer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-orange/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <p className="text-[10px] font-extrabold tracking-widest uppercase text-orange mb-3">Resultater i tal</p>
            <h2 className="font-bold text-3xl md:text-4xl text-white leading-tight">
              Vi leverer resultater — <span className="text-orange italic">dag efter dag</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {COUNTERS.map((c, i) => (
            <RevealOnScroll key={c.label} delay={i * 100}>
              <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/8 hover:border-orange/30 transition-all duration-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-charcoal border border-white/10 rounded-xl flex items-center justify-center text-lg group-hover:border-orange/40 transition-colors">
                  {c.icon}
                </div>
                <div className="mt-4 font-bold text-4xl md:text-5xl text-orange tabular-nums">
                  <AnimatedCount end={c.end} suffix={c.suffix} active={active} />
                </div>
                <div className="font-bold text-white text-sm mt-2">{c.label}</div>
                <div className="text-white/35 text-xs mt-1">{c.desc}</div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
