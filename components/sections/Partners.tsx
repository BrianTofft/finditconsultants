"use client";
import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { COMPETENCIES } from "@/app/data";

const PERKS = [
  { icon: "🔥", title: "Modtag relevante forespørgsler", desc: "Adgang til screenede kundebehov der matcher dine kompetencer — direkte i din indbakke." },
  { icon: "🎯", title: "Ingen spildtid på forkerte kunder", desc: "Vi matcher forespørgsler til de rette partnere. Du bruger tid på muligheder der passer til dit speciale." },
  { icon: "💼", title: "Indgå aftaler direkte", desc: "Ingen mellemled i kontrakten. Du forhandler og indgår aftalen direkte med kunden." },
  { icon: "📈", title: "Voks dit netværk", desc: "Bliv en del af 70+ konsulenthuse og freelancere og styrk din position i markedet." },
];

const inp = "w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 transition-all";
const lbl = "block text-[10px] font-extrabold text-white/45 uppercase tracking-widest mb-1.5";
const FIELD_STYLE = { background: "#ffffff", borderColor: "#d1d0cf", color: "#2d2c2c" };

export default function Partners() {
  const [form, setForm] = useState({
    company_name: "", first_name: "", last_name: "", email: "", phone: "",
    company_type: "", competencies: [] as string[], extra_competencies: "", language: "",
  });
  const [dropOpen, setDropOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const toggle = (c: string) => {
    const updated = form.competencies.includes(c)
      ? form.competencies.filter(x => x !== c)
      : [...form.competencies, c];
    setForm(f => ({ ...f, competencies: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name || !form.email || !form.first_name || !form.last_name) {
      setError("Udfyld venligst alle påkrævede felter"); return;
    }
    setSubmitting(true);
    const res = await fetch("/api/supplier-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); setSubmitting(false); return; }
    setDone(true);
    setSubmitting(false);
  };

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
                  <p className="text-white/50 text-sm">Du hører fra os når der er opgaver der matcher jeres profil.</p>
                  <p className="text-white/30 text-xs mt-2">Husk at tjekke din spammappe!</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>

                  <div>
                    <label className={lbl}>Virksomhed *</label>
                    <input type="text" placeholder="Konsulenthus A/S" className={inp} style={FIELD_STYLE}
                      value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = "#e28100"}
                      onBlur={e => e.target.style.borderColor = "#d1d0cf"} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Fornavn *</label>
                      <input type="text" placeholder="Fornavn" className={inp} style={FIELD_STYLE}
                        value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = "#e28100"}
                        onBlur={e => e.target.style.borderColor = "#d1d0cf"} />
                    </div>
                    <div>
                      <label className={lbl}>Efternavn *</label>
                      <input type="text" placeholder="Efternavn" className={inp} style={FIELD_STYLE}
                        value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                        onFocus={e => e.target.style.borderColor = "#e28100"}
                        onBlur={e => e.target.style.borderColor = "#d1d0cf"} />
                    </div>
                  </div>

                  <div>
                    <label className={lbl}>E-mail *</label>
                    <input type="email" placeholder="kontakt@jeresfirma.dk" className={inp} style={FIELD_STYLE}
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = "#e28100"}
                      onBlur={e => e.target.style.borderColor = "#d1d0cf"} />
                  </div>

                  <div>
                    <label className={lbl}>Telefon</label>
                    <input type="tel" placeholder="+45 XXXX XXXX" className={inp} style={FIELD_STYLE}
                      value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = "#e28100"}
                      onBlur={e => e.target.style.borderColor = "#d1d0cf"} />
                  </div>

                  {/* Leverandørtype */}
                  <div>
                    <label className={lbl}>Leverandørtype</label>
                    <div className="relative">
                      <button type="button" onClick={() => setTypeOpen(!typeOpen)}
                        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${typeOpen ? "rounded-b-none border-orange" : ""}`}
                        style={{ ...FIELD_STYLE, borderColor: typeOpen ? "#e28100" : "#d1d0cf" }}>
                        <span className={form.company_type ? "text-charcoal font-semibold" : "text-charcoal/35"}>
                          {form.company_type || "Vælg type…"}
                        </span>
                        <svg className={`w-3 h-3 text-charcoal/40 transition-transform ${typeOpen ? "rotate-180" : ""}`} viewBox="0 0 12 8" fill="none">
                          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                      {typeOpen && (
                        <div className="absolute top-full left-0 right-0 z-30 bg-white border border-orange border-t-0 rounded-b-xl shadow-xl overflow-hidden">
                          {["Konsulenthus (egne konsulenter)", "Konsulentformidler (freelancers)", "Selvstændig (freelancer)"].map(t => (
                            <div key={t} onClick={() => { setForm(f => ({ ...f, company_type: t })); setTypeOpen(false); }}
                              className={`px-4 py-2.5 cursor-pointer text-sm font-semibold transition-colors ${form.company_type === t ? "bg-orange-light text-charcoal" : "text-charcoal hover:bg-[#f8f6f3]"}`}>
                              {t}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kompetencer */}
                  <div>
                    <label className={lbl}>Kompetenceområder</label>
                    <div className="relative">
                      <button type="button" onClick={() => setDropOpen(!dropOpen)}
                        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${dropOpen ? "border-orange rounded-b-none" : ""}`}
                        style={{ ...FIELD_STYLE, borderColor: dropOpen ? "#e28100" : "#d1d0cf" }}>
                        <span className={form.competencies.length ? "text-charcoal font-semibold" : "text-charcoal/35"}>
                          {form.competencies.length ? `${form.competencies.length} kompetence${form.competencies.length > 1 ? "r" : ""} valgt` : "Vælg kompetenceområder…"}
                        </span>
                        <svg className={`w-3 h-3 text-charcoal/40 transition-transform ${dropOpen ? "rotate-180" : ""}`} viewBox="0 0 12 8" fill="none">
                          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                      {dropOpen && (
                        <div className="absolute top-full left-0 right-0 z-30 bg-white border border-orange border-t-0 rounded-b-xl shadow-xl max-h-52 overflow-y-auto">
                          {COMPETENCIES.map(c => (
                            <div key={c} onClick={() => toggle(c)}
                              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm font-semibold transition-colors ${form.competencies.includes(c) ? "bg-orange-light text-charcoal" : "text-charcoal hover:bg-[#f8f6f3]"}`}>
                              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${form.competencies.includes(c) ? "bg-orange border-orange" : "border-[#d4cfc8]"}`}>
                                {form.competencies.includes(c) && (
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
                    {form.competencies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.competencies.map(c => (
                          <span key={c} className="inline-flex items-center gap-1 bg-orange/20 border border-orange/30 rounded-full px-2.5 py-0.5 text-xs font-bold text-orange">
                            {c}
                            <button type="button" onClick={() => toggle(c)} className="opacity-60 hover:opacity-100 ml-0.5 leading-none">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Yderligere kompetencer */}
                  <div>
                    <label className={lbl}>Yderligere kompetencer</label>
                    <input type="text" placeholder="F.eks. specifikke teknologier eller brancher…" className={inp} style={FIELD_STYLE}
                      value={form.extra_competencies} onChange={e => setForm(f => ({ ...f, extra_competencies: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = "#e28100"}
                      onBlur={e => e.target.style.borderColor = "#d1d0cf"} />
                  </div>

                  {/* Sprog */}
                  <div>
                    <label className={lbl}>Sprog</label>
                    <div className="relative">
                      <button type="button" onClick={() => setLangOpen(!langOpen)}
                        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${langOpen ? "rounded-b-none border-orange" : ""}`}
                        style={{ ...FIELD_STYLE, borderColor: langOpen ? "#e28100" : "#d1d0cf" }}>
                        <span className={form.language ? "text-charcoal font-semibold" : "text-charcoal/35"}>
                          {form.language || "Vælg sprog…"}
                        </span>
                        <svg className={`w-3 h-3 text-charcoal/40 transition-transform ${langOpen ? "rotate-180" : ""}`} viewBox="0 0 12 8" fill="none">
                          <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                      {langOpen && (
                        <div className="absolute top-full left-0 right-0 z-30 bg-white border border-orange border-t-0 rounded-b-xl shadow-xl overflow-hidden">
                          {["Dansk", "Engelsk", "Dansk og engelsk"].map(l => (
                            <div key={l} onClick={() => { setForm(f => ({ ...f, language: l })); setLangOpen(false); }}
                              className={`px-4 py-2.5 cursor-pointer text-sm font-semibold transition-colors ${form.language === l ? "bg-orange-light text-charcoal" : "text-charcoal hover:bg-[#f8f6f3]"}`}>
                              {l}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-xs font-bold">{error}</p>}

                  <button type="submit" disabled={submitting}
                    className="w-full bg-orange hover:bg-orange-dark text-white font-bold rounded-full py-3.5 text-sm transition-colors mt-2 disabled:opacity-50">
                    {submitting ? "Sender…" : "Tilmeld dig og få opgaver →"}
                  </button>

                  <p className="text-white/25 text-xs text-center">
                    FindITconsultants.com deler aldrig kunders eller samarbejdspartners navn offentligt uden tilladelse.
                  </p>
                </form>
              )}
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  );
}