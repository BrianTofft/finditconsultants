"use client";
import { useEffect, useState } from "react";
import LeadForm from "./LeadForm";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=80&fit=crop", badge: true, alt: "IT-team samarbejder om projekt på kontor" },
  { src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&q=80&fit=crop", badge: false, alt: "Professionelt forretningsmøde med IT-konsulenter" },
  { src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&q=80&fit=crop", badge: false, alt: "Strategisk IT-planlægning og dataanalyse" },
];

// Fallback-kompetencer hvis DB er tom / fejler
const FALLBACK: { name: string; count: number }[] = [
  { name: "Azure", count: 2 }, { name: "React", count: 2 },
  { name: "SAP", count: 1 }, { name: ".NET", count: 1 },
  { name: "Python", count: 1 }, { name: "Cybersecurity", count: 1 },
];

function ActiveCompetencies() {
  const t = useTranslations("hero");
  const [competencies, setCompetencies] = useState<{ name: string; count: number }[]>([]);
  const [requestCount, setRequestCount] = useState<number | null>(null);
  const [highlighted, setHighlighted] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/active-competencies")
      .then(r => r.json())
      .then((d: { competencies: { name: string; count: number }[]; requestCount: number }) => {
        setCompetencies(d.competencies?.length ? d.competencies : FALLBACK);
        setRequestCount(d.requestCount ?? null);
        setLoaded(true);
      })
      .catch(() => { setCompetencies(FALLBACK); setLoaded(true); });
  }, []);

  // Fremhæv én tag ad gangen i loop
  useEffect(() => {
    if (!competencies.length) return;
    const timer = setInterval(() => setHighlighted(i => (i + 1) % competencies.length), 1800);
    return () => clearInterval(timer);
  }, [competencies.length]);

  return (
    <div className={`bg-white border border-[#ede9e3] rounded-2xl px-4 py-3.5 shadow-md transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-green animate-pulse flex-shrink-0" />
        <span className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40">{t("badge")}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {competencies.map((c, i) => (
          <span
            key={c.name}
            className={`text-xs font-bold px-3 py-1 rounded-full border transition-all duration-500 ${
              i === highlighted
                ? "bg-orange text-white border-orange scale-105 shadow-sm"
                : "bg-[#f8f6f3] text-charcoal/70 border-[#ede9e3]"
            }`}
          >
            {c.name}
          </span>
        ))}
      </div>
      {requestCount !== null && requestCount > 0 && (
        <p className="text-[10px] text-charcoal/35 font-semibold mt-2.5">
          {requestCount === 1
            ? t("requestCountSingular", { count: requestCount })
            : t("requestCountPlural", { count: requestCount })}
        </p>
      )}
    </div>
  );
}

export default function Hero() {
  const t = useTranslations("hero");

  const STATS = [
    { value: "70+",   label: t("statsPartners") },
    { value: "4–9",   label: t("statsCandidates") },
    { value: "3 dage", label: t("statsDays") },
    { value: "0 kr",  label: t("statsPrice") },
  ];

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

          {/* Aktive kompetencer */}
          <div className="mb-8 max-w-sm">
            <ActiveCompetencies />
          </div>

          {/* Headline */}
          <h1 className="font-bold text-5xl lg:text-6xl text-charcoal leading-[1.08] tracking-tight mb-6">
            {t("headline1")}<br />
            <span className="relative inline-block pb-2">
              <span className="text-orange">{t("headline2")}</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M2 6 Q75 2 150 5 Q225 8 298 4" stroke="#2d2c2c" strokeWidth="3" strokeLinecap="round" fill="none" className="draw-underline"/>
              </svg>
            </span>
          </h1>

          <p className="text-charcoal/60 text-lg leading-relaxed mb-8 max-w-lg">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Button href="#hero-form" size="lg">{t("cta")}</Button>
            <Button href="#how" variant="ghost-light" size="lg">{t("howItWorks")}</Button>
          </div>

          {/* Social proof avatarer */}
          <div className="flex items-center gap-3 mb-10 p-4 bg-white/70 border border-[#ede9e3] rounded-2xl max-w-sm shadow-sm">
            <div className="flex -space-x-2">
              {["LT","MP","SA","MH"].map(i => (
                <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-orange to-orange-dark border-2 border-white flex items-center justify-center text-xs font-black text-white shadow-sm">{i}</div>
              ))}
            </div>
            <div>
              <div className="font-bold text-charcoal text-sm">{t("socialProof")}</div>
              <div className="text-charcoal/45 text-xs flex items-center gap-1">
                <span className="text-orange">★★★★★</span> {t("rating")}
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
                    <span className="text-charcoal text-[10px] font-bold">{t("activeBadge")}</span>
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
