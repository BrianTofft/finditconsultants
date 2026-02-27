"use client";
import { useState } from "react";
import { COMPETENCIES } from "@/app/data";
import Link from "next/link";

export default function BlivLeverandoerPage() {
  const [form, setForm] = useState({
    company_name: "", first_name: "", last_name: "", email: "", phone: "",
    company_type: "", competencies: [] as string[], extra_competencies: "", language: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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
    setSubmitted(true);
    setSubmitting(false);
  };

  const toggleCompetency = (c: string) => {
    const updated = form.competencies.includes(c)
      ? form.competencies.filter(x => x !== c)
      : [...form.competencies, c];
    setForm(f => ({ ...f, competencies: updated }));
  };

  const inp = "w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all";
  const lbl = "block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5";

  if (submitted) return (
    <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#ede9e3] p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-bold text-2xl text-charcoal mb-3">Tak for din tilmelding!</h2>
        <p className="text-charcoal/60 text-sm leading-relaxed mb-6">
          Vi har modtaget din ansøgning og vender tilbage snarest. Du hører fra os, hvis nogen opgaver matcher jeres profil.
        </p>
        <p className="text-xs text-charcoal/40 mb-6">Husk at tjekke din spammappe!</p>
        <Link href="/" className="text-orange font-bold text-sm hover:underline">← Tilbage til forsiden</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <div className="bg-gradient-to-br from-[#2d2c2c] to-[#1a1919] border-b-4 border-orange">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Link href="/" className="text-white/50 hover:text-white text-sm font-semibold transition-colors mb-4 inline-block">← Tilbage</Link>
          <h1 className="font-bold text-3xl text-white mb-2">Bliv leverandør</h1>
          <p className="text-white/60 text-sm">Registrér jer og få tilsendt opgaver der matcher jeres profil.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#ede9e3] p-8 space-y-5">

          <div>
            <label className={lbl}>Virksomhed <span className="text-orange">*</span></label>
            <input className={inp} placeholder="Firma A/S" value={form.company_name}
              onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Fornavn <span className="text-orange">*</span></label>
              <input className={inp} placeholder="Fornavn" value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
            </div>
            <div>
              <label className={lbl}>Efternavn <span className="text-orange">*</span></label>
              <input className={inp} placeholder="Efternavn" value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className={lbl}>Email <span className="text-orange">*</span></label>
            <input type="email" className={inp} placeholder="kontakt@firma.dk" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>

          <div>
            <label className={lbl}>Telefon</label>
            <input className={inp} placeholder="+45 12 34 56 78" value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>

          <div>
            <label className={lbl}>Hvilken type virksomhed repræsenterer du?</label>
            <select className={inp} value={form.company_type}
              onChange={e => setForm(f => ({ ...f, company_type: e.target.value }))}>
              <option value="">Vælg…</option>
              <option>Konsulenthus (egne konsulenter)</option>
              <option>Konsulentformidler (freelancers)</option>
              <option>Selvstændig (freelancer)</option>
            </select>
          </div>

          <div>
            <label className={lbl}>Vælg dine/jeres kompetencer</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {COMPETENCIES.map(c => {
                const selected = form.competencies.includes(c);
                return (
                  <button type="button" key={c} onClick={() => toggleCompetency(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selected ? "bg-orange text-white border-orange" : "bg-white text-charcoal border-[#e8e5e0] hover:border-orange/50"}`}>
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={lbl}>Yderligere kompetencer</label>
            <input className={inp} placeholder="F.eks. specifikke teknologier eller brancher…" value={form.extra_competencies}
              onChange={e => setForm(f => ({ ...f, extra_competencies: e.target.value }))} />
          </div>

          <div>
            <label className={lbl}>Sprog</label>
            <select className={inp} value={form.language}
              onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
              <option value="">Vælg…</option>
              <option>Dansk</option>
              <option>Engelsk</option>
              <option>Dansk og engelsk</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <button type="submit" disabled={submitting}
            className="w-full bg-orange text-white font-bold rounded-full px-8 py-3 text-sm hover:bg-orange-dark transition-all disabled:opacity-50">
            {submitting ? "Sender…" : "Tilmeld dig og få opgaver →"}
          </button>

          <p className="text-xs text-charcoal/40 text-center">
            FindITconsultants.com deler aldrig kunders eller samarbejdspartners navn offentligt i forbindelse med søgninger uden tilladelse.
          </p>
        </form>
      </div>
    </div>
  );
}