"use client";
import { useState } from "react";
import { COMPETENCIES } from "@/app/data";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function LeadForm() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dropOpen, setDropOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    description: "",
    startDate: "",
    duration: "",
    workMode: "Onsite",
    scope: "Fuldtid",
    language: "Dansk",
    nearshore: "Ja",
    maxRate: "",
    email: "",
  });

  const toggle = (c: string) => setSelected(prev => {
    const n = new Set(prev);
    n.has(c) ? n.delete(c) : n.add(c);
    return n;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      // Upload fil til Supabase Storage hvis valgt
      let fileUrl: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("request-files")
          .upload(path, file, { upsert: false });
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("request-files")
            .getPublicUrl(path);
          fileUrl = urlData.publicUrl;
        }
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          competencies: Array.from(selected),
          fileUrl,
          maxRate: form.maxRate ? parseInt(form.maxRate) : null,
        }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  if (done) return (
    <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-[#ede9e3]">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="font-bold text-xl text-charcoal mb-2">Tak for din forespørgsel!</h3>
      <p className="text-charcoal/55 text-sm">Vi vender tilbage inden for 3 arbejdsdage med relevante profiler og priser.</p>
    </div>
  );

  const lbl = "block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5";
  const inp = "w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all";
  const sec = "text-[9px] font-extrabold tracking-widest uppercase text-charcoal/35 border-b border-[#ede9e3] pb-1.5 mb-3 mt-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-[#ede9e3] overflow-hidden" id="hero-form">
      <div className="bg-gradient-to-br from-[#2d2c2c] to-[#1a1919] px-6 pt-5 pb-4 border-b-4 border-orange">
        <h2 className="font-bold text-xl text-white mb-0.5">Find din næste <span className="text-orange">IT-konsulent</span></h2>
        <p className="text-white/50 text-xs">Vi vender tilbage med profiler inden for 3 arbejdsdage.</p>
      </div>
      <div className="px-6 py-4 space-y-3">

        <div className={sec}>Opgave information</div>
        <div>
          <label className={lbl}>Beskriv kort opgaven / projektet</label>
          <textarea className={`${inp} resize-none`} rows={3} placeholder="F.eks. Vi søger en senior Azure-arkitekt til cloudmigration…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>Upload evt. opgavebeskrivelse <span className="normal-case font-normal">(valgfrit)</span></label>
          <label className="flex items-center gap-3 w-full rounded-xl border border-dashed border-[#d4cfc8] bg-[#f8f6f3] px-4 py-2.5 cursor-pointer hover:border-orange hover:bg-orange-light transition-all group">
            <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setFileName(f.name); } }} />
            <span className="text-base">📎</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-charcoal">Klik for at uploade</div>
              {fileName
                ? <div className="text-xs text-orange font-bold mt-0.5 truncate">✓ {fileName}</div>
                : <div className="text-xs text-charcoal/40 mt-0.5">PDF, Word, tekst – maks. 10 MB</div>
              }
            </div>
          </label>
        </div>

        <div className={sec}>Konsulent kompetencer</div>
        <div>
          <label className={lbl}>Vælg kompetenceområde(r)</label>
          <div className="relative">
            <button type="button" onClick={() => setDropOpen(!dropOpen)}
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all ${dropOpen ? "border-orange bg-white rounded-b-none shadow-[0_0_0_3px_rgba(226,129,0,0.12)]" : "border-[#e8e5e0] bg-[#f8f6f3] hover:border-orange/50"}`}>
              <span className={selected.size ? "text-charcoal font-semibold" : "text-charcoal/30"}>
                {selected.size ? `${selected.size} kompetence${selected.size > 1 ? "r" : ""} valgt` : "Vælg et eller flere områder…"}
              </span>
              <svg className={`w-3 h-3 text-charcoal/40 transition-transform ${dropOpen ? "rotate-180" : ""}`} viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {dropOpen && (
              <div className="absolute top-full left-0 right-0 z-30 bg-white border border-orange border-t-0 rounded-b-xl shadow-lg max-h-52 overflow-y-auto">
                {COMPETENCIES.map(c => (
                  <div key={c} onClick={() => toggle(c)}
                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer text-sm font-semibold transition-colors ${selected.has(c) ? "bg-orange-light" : "hover:bg-[#f8f6f3]"}`}>
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${selected.has(c) ? "bg-orange border-orange" : "border-[#d4cfc8]"}`}>
                      {selected.has(c) && <svg width="8" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
          {selected.size > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {Array.from(selected).map(c => (
                <span key={c} className="inline-flex items-center gap-1 bg-orange-light border border-orange/20 rounded-full px-2.5 py-0.5 text-xs font-bold text-orange">
                  {c}
                  <button type="button" onClick={() => toggle(c)} className="opacity-60 hover:opacity-100 ml-0.5 leading-none">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={sec}>Opgave detaljer</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={lbl}>Forventet opstart</label>
            <input type="date" className={inp} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>Varighed</label>
            <select className={inp} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
              <option value="">Vælg…</option>
              <option>1–3 mdr.</option>
              <option>4–6 mdr.</option>
              <option>7–12 mdr.</option>
              <option>+12 mdr.</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Arbejdsform</label>
            <select className={inp} value={form.workMode} onChange={e => setForm(f => ({ ...f, workMode: e.target.value }))}>
              <option>Onsite</option><option>Hybrid</option><option>Remote</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Omfang</label>
            <select className={inp} value={form.scope} onChange={e => setForm(f => ({ ...f, scope: e.target.value }))}>
              <option>Fuldtid</option><option>Deltid</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Sprog</label>
            <select className={inp} value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
              <option>Dansk</option><option>Engelsk</option><option>Begge</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Nearshore/Offshore <span className="normal-case font-normal">(lavere timepris)</span></label>
            <select className={inp} value={form.nearshore} onChange={e => setForm(f => ({ ...f, nearshore: e.target.value }))}>
              <option>Ja</option><option>Nej</option>
            </select>
          </div>
          <div>
            <label className={lbl}>Maksimal timepris</label>
            <input
              type="number"
              className={inp}
              placeholder="950 DKK/t"
              min="0"
              value={form.maxRate}
              onChange={e => setForm(f => ({ ...f, maxRate: e.target.value }))}
            />
          </div>
        </div>

        <div className={sec}>Din kontaktinfo</div>
        <div>
          <label className={lbl}>E-mail</label>
          <input type="email" required placeholder="din@virksomhed.dk" className={inp} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>

        {error && <p className="text-red-500 text-xs text-center">Noget gik galt. Prøv igen eller skriv til hej@finditconsultants.com</p>}

        <Button type="submit" full size="lg" className="mt-1" disabled={loading}>
          {loading ? "Sender…" : "Få matchende IT-konsulenter →"}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-[10px] text-charcoal/35 font-semibold pt-1">
          <svg width="10" height="12" viewBox="0 0 12 14" fill="none"><path d="M6 1L1 3.5V7c0 2.76 2.13 5.35 5 6 2.87-.65 5-3.24 5-6V3.5L6 1Z" stroke="currentColor" strokeWidth="1.3"/></svg>
          Dine oplysninger deles aldrig offentligt
        </p>
      </div>
    </form>
  );
}
