import React from "react";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import LeadForm from "@/components/sections/LeadForm";
import ConsultantGraphic from "@/components/ConsultantGraphic";

interface Section {
  title: string;
  content: string;
  bullets?: string[];
}

interface Props {
  title: string;
  eyebrow: string;
  hero: React.ReactNode;
  intro: string;
  price?: string;
  sections: Section[];
  faq?: { q: string; a: string }[];
  icon?: string;
  graphic?: "network" | "cloud" | "chart" | "gears" | "people" | "globe" | "database" | "shield";
}

// SVG Graphic components — each unique to the competence area
export default function ConsultantPage({ title, eyebrow, hero, intro, price, sections, faq, graphic = "network" }: Props) {

  return (
    <>
      <Nav />
      <main>
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="bg-[#2d2c2c] pt-16 pb-0 relative overflow-hidden">
          {/* Background radial glow */}
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

          {/* Subtle grid texture */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `linear-gradient(#e28100 1px, transparent 1px), linear-gradient(90deg, #e28100 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }} />

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 items-start relative z-10">
            <div className="pt-8 pb-16">
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-2 text-xs font-extrabold tracking-widest uppercase text-orange mb-6">
                <span className="w-6 h-px bg-orange" />{eyebrow}
              </span>

              {/* Title */}
              <h1 className="font-bold text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-6">
                {hero}
              </h1>
              <p className="text-white/55 text-lg leading-relaxed mb-8 max-w-xl">{intro}</p>

              {/* CTA row */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button href="#form" size="lg">Find konsulenter gratis →</Button>
                <Button href="#info" variant="ghost-dark" size="lg">Læs mere</Button>
              </div>

              {/* Price badge */}
              {price && (
                <div className="inline-flex items-center gap-3 bg-white/6 border border-white/12 rounded-2xl px-5 py-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <div className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Typisk timepris</div>
                    <div className="text-white font-bold text-sm mt-0.5">{price}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Form column */}
            <div id="form" className="lg:sticky lg:top-20 pb-8">
              <LeadForm />
            </div>
          </div>

          {/* SVG Graphic strip — sits at bottom of hero, overlapping next section */}
          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="relative h-[220px] w-full max-w-2xl mx-auto lg:mx-0">
              {/* Card container */}
              <div className="absolute inset-0 bg-white/4 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <ConsultantGraphic type={graphic} />
                </div>
                {/* Glowing border top */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/60 to-transparent" />
              </div>
            </div>
          </div>

          {/* Fade to next section */}
          <div className="h-16 bg-gradient-to-b from-[#2d2c2c] to-[#f8f6f3] relative z-0 -mt-4" />
        </section>

        {/* ── STATS STRIP ──────────────────────────────────── */}
        <section className="bg-[#f8f6f3] py-12">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: "70+", lbl: "Leverandører aktiveret", icon: "🤝" },
              { val: "3",   lbl: "Arbejdsdage til første profiler", icon: "⚡" },
              { val: "0",   lbl: "Kr. for kunder", icon: "✓" },
              { val: "100%", lbl: "Fortrolig behandling", icon: "🔒" },
            ].map(s => (
              <div key={s.lbl} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-black text-4xl text-orange leading-none mb-1">{s.val}</div>
                <div className="text-charcoal/50 text-xs font-semibold leading-tight">{s.lbl}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTENT SECTIONS ─────────────────────────────── */}
        <section id="info" className="py-20 bg-[#f8f6f3]">
          <div className="max-w-3xl mx-auto px-6 space-y-6">
            {sections.map((s, i) => (
              <div key={i} className="bg-white rounded-3xl border border-[#ede9e3] overflow-hidden shadow-sm">
                {/* Colored top bar */}
                <div className="h-1 bg-gradient-to-r from-orange via-orange/60 to-transparent" />
                <div className="p-8">
                  {/* Section number */}
                  <div className="flex items-start gap-4 mb-4">
                    <span className="w-8 h-8 rounded-xl bg-orange-light border border-orange/20 flex items-center justify-center text-orange font-black text-sm flex-shrink-0">
                      {String(i+1).padStart(2,"0")}
                    </span>
                    <h2 className="font-bold text-xl text-charcoal leading-snug pt-0.5">{s.title}</h2>
                  </div>
                  <p className="text-charcoal/60 leading-relaxed mb-5 pl-12">{s.content}</p>
                  {s.bullets && (
                    <ul className="pl-12 space-y-3">
                      {s.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-3 text-charcoal/65 text-sm leading-relaxed">
                          <span className="w-5 h-5 rounded-full bg-orange-light border border-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg width="8" height="7" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4l3 3 5-6" stroke="#e28100" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          <span dangerouslySetInnerHTML={{ __html: b }} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}

            {/* FAQ */}
            {faq && faq.length > 0 && (
              <div className="pt-6">
                <h2 className="font-bold text-2xl text-charcoal mb-5 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-orange flex items-center justify-center text-white text-sm">?</span>
                  Ofte stillede spørgsmål
                </h2>
                <div className="space-y-3">
                  {faq.map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-[#ede9e3] p-6">
                      <h3 className="font-bold text-charcoal mb-2 flex items-start gap-2">
                        <span className="text-orange mt-0.5 flex-shrink-0">Q</span>
                        {item.q}
                      </h3>
                      <p className="text-charcoal/60 text-sm leading-relaxed pl-5">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── BOTTOM CTA ───────────────────────────────────── */}
        <section className="py-20 bg-[#2d2c2c] text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `radial-gradient(circle, #e28100 1px, transparent 1px)`,
            backgroundSize: "30px 30px"
          }} />
          <div className="relative z-10 max-w-xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 text-orange text-xs font-extrabold tracking-widest uppercase mb-6">
              <span className="w-4 h-px bg-orange" />Klar til at starte?<span className="w-4 h-px bg-orange" />
            </div>
            <h2 className="font-bold text-4xl text-white mb-4">Find din {title} i dag</h2>
            <p className="text-white/50 mb-8 leading-relaxed">Gratis og uforpligtende. Vi aktiverer markedet og vender tilbage med screenede profiler inden for 3 arbejdsdage.</p>
            <Button href="#form" size="lg">Kom i gang gratis →</Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
