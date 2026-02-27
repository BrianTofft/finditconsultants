"use client";
import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { COMPETENCIES } from "@/app/data";

const PERKS = [
  { icon: "📥", title: "Modtag relevante forespørgsler", desc: "Adgang til screenede kundebehov der matcher dine kompetencer — direkte i din indbakke." },
  { icon: "🎯", title: "Ingen spildtid på forkerte kunder", desc: "Vi matcher forespørgsler til de rette partnere. Du bruger tid på muligheder der passer til dit speciale." },
  { icon: "💼", title: "Indgå aftaler direkte", desc: "Ingen mellemmænd i kontrakten. Du forhandler og indgår aftalen direkte med kunden." },
  { icon: "📈", title: "Voks dit netværk", desc: "Bliv en del af 70+ konsulenthuse og freelancere og styrk din position i markedet." },
];

const FIELD_STYLE = { background: "#ffffff", borderColor: "#d1d0cf", color: "#2d2c2c" };
const PLACEHOLDER_COLOR = "rgba(45,44,44,0.35)";
const inp = "w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 transition-all";
const lbl = "block text-[10px] font-extrabold text-white/45 uppercase tracking-widest mb-1.5";

export default function Partners() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dropOpen, setDropOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [done, setDone] = useState(false);

  const toggle = (c: string) => setSelected(prev => {
    const n = new Set(prev);
    n.has(c) ? n.delete(c) : n.add(c);
    return n;
  });

  return (
    <section id="partners" className="py-24 bg-[#f8f6f3]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <RevealOnScroll>
            <SectionHeader eyebrow="Bliv leverandør" title={<>Er du konsulenthus <span className="text-orange italic">eller freelancer?</span></>} sub="Tilmeld dig vores netværk og modtag relevante forespørgsler fra screenede kunder." />
            <ul className="space-y-5 mb-8">
              {PERKS.map(p => (
                <li key={p.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-light flex items-center justify-center text-lg flex-shrink-0">{p.icon}</div>
                  <div><h4 className="font-bold text-charcoal mb-0.5">{p.title}</h4><p className="text-charcoal/55 text-sm leading-relaxed">{p.desc}</p></div>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 flex-wrap">
              <Button href="mailto:hej@finditkonsulenter.dk" size="lg">Bliv leverandør →</Button>
              <Button href="tel:+4528340907" variant="ghost-light" size="lg">Ring til os</Button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={150}>
            <div className="bg-[#2d2c2c] rounded-3xl p-8">
              <div className="text-orange text-xs font-extrabold tracking-widest uppercase mb-6">Tilmeld dit konsulenthus</div>

              {done ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="font-bold text-white text-lg mb-1">Tak for din tilmelding!</h3>
                  <p className="text-white/50 text-sm">Vi vender tilbage hurtigst muligt.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); setDone(true); }}>

                  {/* Stamdata */}
                  {[
                    { lbl: "Virksomhed", ph: "Konsulenthus A/S", type: "text" },
                    { lbl: "E-mail",     ph: "kontakt@jeresfirma.dk", type: "email" },
                    { lbl: "Telefon",    ph: "+45 XXXX XXXX", type: "tel" },
                  ].map(f => (
                    <div key={f.lbl}>
                      <label className={lbl}>{f.lbl}</label>
                      <input type={f.type} placeholder={f.ph} className={inp} style={FIELD_STYLE}
                        onFocus={e => e.target.style.borderColor = "#e28100"}
                        onBlur={e => e.target.style.borderColor = "#d1d0cf"} />
                    </div>
                  ))}

                  {/* Type */}
                  <div>
                    <label className={lbl}>Leverandørtype</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setTypeOpen(!typeOpen)}
                        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm focus:outline-none transition-all ${typeOpen ? "rounded-b-none border-orange" : ""}`}
                        style={{ ...FIELD_STYLE, borderColor: typeOpen ? "#e28100" : "#d1d0cf" }}
                      >
                        <span className={selectedType ? "text-charcoal font-semibold" : "text-charcoal/35"}>
                          {selectedType || "Vælg type…"}
                        </span>
                        <svg className={`w-3 h-3 text-charcoal/40 transition-transform ${typeOpen ? "rotate-180" : ""}`} viewBox="0 0 12 8" fill="none">
                          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                      {typeOpen && (
                        <div className="absolute top-full left-0 right-0 z-30 bg-white border border-orange border-t-0 rounded-b-xl shadow-xl overflow-hidden">
                          {["Konsulenthus", "Freelancer", "Formidler (freelance broker)"].map(t => (
                            <div
                              key={t}
                              onClick={() => { setSelectedType(t); setTypeOpen(false); }}
                              className={`px-4 py-2.5 cursor-pointer text-sm font-semibold transition-colors ${selectedType === t ? "bg-orange-light text-charcoal" : "text-charcoal hover:bg-[#f8f6f3]"}`}
                            >
                              {t}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kompetencer dropdown */}
                  <div>
                    <label className={lbl}>Kompetenceområder</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDropOpen(!dropOpen)}
                        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${
                          dropOpen ? "border-orange rounded-b-none" : "border-white/15 hover:border-white/30"
                        }`}
                        style={FIELD_STYLE}
                      >
                        <span className={selected.size ? "text-charcoal font-semibold" : "text-charcoal/35"}>
                          {selected.size ? `${selected.size} kompetence${selected.size > 1 ? "r" : ""} valgt` : "Vælg kompetenceområder…"}
                        </span>
                        <svg className={`w-3 h-3 text-charcoal/40 transition-transform ${dropOpen ? "rotate-180" : ""}`} viewBox="0 0 12 8" fill="none">
                          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>

                      {dropOpen && (
                        <div className="absolute top-full left-0 right-0 z-30 bg-white border border-orange border-t-0 rounded-b-xl shadow-xl max-h-52 overflow-y-auto">
                          {COMPETENCIES.map(c => (
                            <div
                              key={c}
                              onClick={() => toggle(c)}
                              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm font-semibold transition-colors ${
                                selected.has(c) ? "bg-orange-light text-charcoal" : "text-charcoal hover:bg-[#f8f6f3]"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                                selected.has(c) ? "bg-orange border-orange" : "border-[#d4cfc8]"
                              }`}>
                                {selected.has(c) && (
                                  <svg width="8" height="7" viewBox="0 0 10 8" fill="none">
                                    <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                              {c}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {selected.size > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {Array.from(selected).map(c => (
                          <span key={c} className="inline-flex items-center gap-1 bg-orange/20 border border-orange/30 rounded-full px-2.5 py-0.5 text-xs font-bold text-orange">
                            {c}
                            <button type="button" onClick={() => toggle(c)} className="opacity-60 hover:opacity-100 ml-0.5 leading-none">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button type="submit" className="w-full bg-orange hover:bg-orange-dark text-white font-bold rounded-full py-3.5 text-sm transition-colors mt-2">
                    Send tilmelding →
                  </button>
                </form>
              )}
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
}
