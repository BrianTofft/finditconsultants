"use client";
import { useState } from "react";
import { COMPETENCIES } from "@/app/data";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useTranslations } from "next-intl";

export default function LeadForm() {
  const t = useTranslations("leadForm");

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dropOpen, setDropOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [countryCode, setCountryCode] = useState<"dk" | "no" | "sv" | "other" | "">("");
  const [customLand, setCustomLand] = useState("");

  const langOptions = countryCode === "dk" ? [t("langDanish"), t("langEnglish"), t("langBoth")]
    : countryCode === "no" ? [t("langNorwegian"), t("langEnglish"), t("langBoth")]
    : countryCode === "sv" ? [t("langSwedish"), t("langEnglish"), t("langBoth")]
    : countryCode === "other" ? (customLand ? [customLand, t("langEnglish"), t("langBoth")] : [t("langEnglish"), t("langBoth")])
    : [t("language0"), t("language1"), t("language2")];

  const [form, setForm] = useState({
    description: "",
    startDate: "",
    duration: "",
    workMode: t("workMode0"),
    scope: t("scope0"),
    language: t("language0"),
    nearshore: t("nearshore0"),
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
          land: countryCode === "other" ? (customLand || "other") : (countryCode || null),
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
      <h3 className="font-bold text-xl text-charcoal mb-2">{t("successTitle")}</h3>
      <p className="text-charcoal/55 text-sm">{t("successDesc")}</p>
    </div>
  );

  const lbl = "block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5";
  const inp = "w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-orange/25 focus:border-orange transition-all";
  const sec = "text-[9px] font-extrabold tracking-widest uppercase text-charcoal/35 border-b border-[#ede9e3] pb-1.5 mb-3 mt-1";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-[#ede9e3] overflow-hidden" id="hero-form">
      <div className="bg-gradient-to-br from-[#2d2c2c] to-[#1a1919] px-6 pt-5 pb-4 border-b-4 border-orange">
        <h2 className="font-bold text-xl text-white mb-0.5">{t("title")} <span className="text-orange">{t("titleHighlight")}</span></h2>
        <p className="text-white/50 text-xs">{t("subtitle")}</p>
      </div>
      <div className="px-6 py-4 space-y-3">

        <div className={sec}>{t("sectionTask")}</div>
        <div>
          <label className={lbl}>{t("labelDesc")}</label>
          <textarea className={`${inp} resize-none`} rows={3} placeholder={t("placeholderDesc")} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <div>
          <label className={lbl}>{t("labelFile")} <span className="normal-case font-normal">{t("fileOptional")}</span></label>
          <label className="flex items-center gap-3 w-full rounded-xl border border-dashed border-[#d4cfc8] bg-[#f8f6f3] px-4 py-2.5 cursor-pointer hover:border-orange hover:bg-orange-light transition-all group">
            <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f); setFileName(f.name); } }} />
            <span className="text-base">📎</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-charcoal">{t("fileUpload")}</div>
              {fileName
                ? <div className="text-xs text-orange font-bold mt-0.5 truncate">✓ {fileName}</div>
                : <div className="text-xs text-charcoal/40 mt-0.5">{t("fileTypes")}</div>
              }
            </div>
          </label>
        </div>

        <div className={sec}>{t("sectionCompetencies")}</div>
        <div>
          <label className={lbl}>{t("labelCompetencies")}</label>
          <div className="relative">
            <button type="button" onClick={() => setDropOpen(!dropOpen)}
              className={`w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-all ${dropOpen ? "border-orange bg-white rounded-b-none shadow-[0_0_0_3px_rgba(226,129,0,0.12)]" : "border-[#e8e5e0] bg-[#f8f6f3] hover:border-orange/50"}`}>
              <span className={selected.size ? "text-charcoal font-semibold" : "text-charcoal/30"}>
                {selected.size
                  ? (selected.size === 1
                    ? t("competencySelected", { count: selected.size })
                    : t("competenciesSelected", { count: selected.size }))
                  : t("placeholderCompetencies")}
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

        <div className={sec}>{t("sectionDetails")}</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={lbl}>{t("labelStartDate")}</label>
            <input type="date" className={inp} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
          </div>
          <div>
            <label className={lbl}>{t("labelDuration")}</label>
            <select className={inp} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
              <option value="">{t("placeholderDuration")}</option>
              <option>{t("duration1")}</option>
              <option>{t("duration2")}</option>
              <option>{t("duration3")}</option>
              <option>{t("duration4")}</option>
            </select>
          </div>
          <div>
            <label className={lbl}>{t("labelWorkMode")}</label>
            <select className={inp} value={form.workMode} onChange={e => setForm(f => ({ ...f, workMode: e.target.value }))}>
              <option>{t("workMode0")}</option>
              <option>{t("workMode1")}</option>
              <option>{t("workMode2")}</option>
            </select>
          </div>
          <div>
            <label className={lbl}>{t("labelScope")}</label>
            <select className={inp} value={form.scope} onChange={e => setForm(f => ({ ...f, scope: e.target.value }))}>
              <option>{t("scope0")}</option>
              <option>{t("scope1")}</option>
            </select>
          </div>
          <div>
            <label className={lbl}>{t("labelLand")}</label>
            <select
              className={inp}
              value={countryCode}
              onChange={e => {
                const code = e.target.value as "dk" | "no" | "sv" | "other" | "";
                setCountryCode(code);
                const firstLang = code === "dk" ? t("langDanish")
                  : code === "no" ? t("langNorwegian")
                  : code === "sv" ? t("langSwedish")
                  : code === "other" ? t("langEnglish")
                  : t("language0");
                setForm(f => ({ ...f, language: firstLang }));
              }}
            >
              <option value="">{t("placeholderLand")}</option>
              <option value="dk">{t("landDK")}</option>
              <option value="no">{t("landNO")}</option>
              <option value="sv">{t("landSV")}</option>
              <option value="other">{t("landOther")}</option>
            </select>
            {countryCode === "other" && (
              <input
                type="text"
                className={`${inp} mt-1.5`}
                placeholder={t("landOtherPlaceholder")}
                value={customLand}
                onChange={e => {
                  setCustomLand(e.target.value);
                  setForm(f => ({ ...f, language: e.target.value || t("langEnglish") }));
                }}
              />
            )}
          </div>
          <div>
            <label className={lbl}>{t("labelLanguage")}</label>
            <select className={inp} value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))}>
              {langOptions.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl}>{t("labelNearshore")} <span className="normal-case font-normal">{t("nearshoreNote")}</span></label>
            <select className={inp} value={form.nearshore} onChange={e => setForm(f => ({ ...f, nearshore: e.target.value }))}>
              <option>{t("nearshore0")}</option>
              <option>{t("nearshore1")}</option>
            </select>
          </div>
          <div>
            <label className={lbl}>{t("labelRate")}</label>
            <input
              type="number"
              className={inp}
              placeholder={t("placeholderRate")}
              min="0"
              value={form.maxRate}
              onChange={e => setForm(f => ({ ...f, maxRate: e.target.value }))}
            />
          </div>
        </div>

        <div className={sec}>{t("sectionContact")}</div>
        <div>
          <label className={lbl}>{t("labelEmail")}</label>
          <input type="email" required placeholder={t("placeholderEmail")} className={inp} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>

        {error && <p className="text-red-500 text-xs text-center">{t("errorGeneral")}</p>}

        <Button type="submit" full size="lg" className="mt-1" disabled={loading}>
          {loading ? t("submitting") : t("submit")}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-[10px] text-charcoal/35 font-semibold pt-1">
          <svg width="10" height="12" viewBox="0 0 12 14" fill="none"><path d="M6 1L1 3.5V7c0 2.76 2.13 5.35 5 6 2.87-.65 5-3.24 5-6V3.5L6 1Z" stroke="currentColor" strokeWidth="1.3"/></svg>
          {t("privacy")}
        </p>
      </div>
    </form>
  );
}
