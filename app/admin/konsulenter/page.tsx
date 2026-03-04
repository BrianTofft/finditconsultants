"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Submission } from "../types";

type RequestGroup = {
  request_id: string;
  description: string;
  customer_email: string;
  reference_number?: string | null;
  competencies?: string[];
  request_status?: string;
  submissions: Submission[];
};

const statusColor: Record<string, string> = {
  "Indsendt": "bg-blue-100 text-blue-700",
  "Godkendt": "bg-green-100 text-green-700",
  "Valgt":    "bg-orange/15 text-orange",
  "Afvist":   "bg-red-100 text-red-600",
};

const reqStatusColor: Record<string, string> = {
  "Ny":        "bg-blue-100 text-blue-700",
  "I gang":    "bg-orange/15 text-orange",
  "Afsluttet": "bg-green-100 text-green-700",
};

/* ─── Admin konsulent-kort ───────────────────────────────────── */
function AdminConsultantCard({
  s,
  selecting,
  analyzing,
  aiError,
  editingSummary,
  onUpdateStatus,
  onSelect,
  onAiMatch,
  onDelete,
  onEditSummary,
  onSaveSummary,
  onCancelSummary,
  onSummaryChange,
}: {
  s: Submission;
  selecting: boolean;
  analyzing: boolean;
  aiError?: string;
  editingSummary?: string;
  onUpdateStatus: (status: string) => void;
  onSelect: () => void;
  onAiMatch: () => void;
  onDelete: () => void;
  onEditSummary: () => void;
  onSaveSummary: () => void;
  onCancelSummary: () => void;
  onSummaryChange: (val: string) => void;
}) {
  const [showFullBio, setShowFullBio] = useState(false);

  const cardBorder =
    s.customer_decision === "interview" ? "border-green-200 hover:border-green-300" :
    s.customer_decision === "afvist"    ? "border-red-200 hover:border-red-300" :
    s.status === "Valgt"                ? "border-orange/30 hover:border-orange/50" :
    s.status === "Godkendt"             ? "border-green-100 hover:border-green-200" :
                                          "border-[#ede9e3] hover:border-orange/20";

  return (
    <div className={`bg-white rounded-2xl border flex flex-col overflow-hidden transition-all hover:shadow-md ${cardBorder}`}>

      {/* ── Header ── */}
      <div className="p-4 border-b border-[#f5f2ee]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-charcoal truncate">{s.name}</p>
            <p className="text-xs text-charcoal/50 truncate mt-0.5">{s.title}</p>
          </div>
          <div className="flex items-start gap-1.5 flex-shrink-0 flex-col items-end">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusColor[s.status] ?? "bg-gray-100 text-gray-600"}`}>
              {s.status}
            </span>
            {s.cv_url && (
              <a href={s.cv_url} target="_blank" rel="noopener noreferrer"
                className="text-[11px] bg-blue-50 text-blue-600 font-bold px-2.5 py-0.5 rounded-full hover:bg-blue-100 transition-colors">
                📄 CV
              </a>
            )}
          </div>
        </div>

        {/* Skills */}
        {s.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {s.skills.map(skill => (
              <span key={skill} className="bg-orange/10 text-orange text-[11px] font-bold px-2 py-0.5 rounded-full">{skill}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex-1 flex flex-col gap-2.5">

        {/* Nøgletal */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {s.rate && <span className="font-extrabold text-orange">{s.rate.toLocaleString("da-DK")} DKK/t</span>}
          {s.availability && <span className="text-charcoal/40">📅 {new Date(s.availability).toLocaleDateString("da-DK")}</span>}
        </div>

        {/* Bio */}
        {s.bio && (
          <div>
            <p className={`text-xs text-charcoal/60 leading-relaxed ${showFullBio ? "" : "line-clamp-2"}`}>{s.bio}</p>
            {s.bio.length > 120 && (
              <button onClick={() => setShowFullBio(v => !v)} className="text-[10px] font-bold text-orange/70 hover:text-orange mt-0.5 transition-colors">
                {showFullBio ? "Vis mindre ↑" : "Læs mere →"}
              </button>
            )}
          </div>
        )}

        {/* AI-match boks */}
        {s.ai_rating ? (
          <div className="border border-orange/20 bg-orange/5 rounded-xl p-3">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-orange/60">AI-match</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <span key={i} className={`text-xs ${i <= s.ai_rating! ? "text-orange" : "text-charcoal/15"}`}>★</span>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-charcoal/40">{s.ai_rating}/10</span>
              </div>
              {editingSummary === undefined && (
                <button onClick={onEditSummary} className="text-[10px] text-orange/60 hover:text-orange font-bold transition-colors shrink-0">
                  ✎ Rediger
                </button>
              )}
            </div>
            {editingSummary !== undefined ? (
              <div className="space-y-2">
                <textarea
                  value={editingSummary}
                  onChange={e => onSummaryChange(e.target.value)}
                  rows={4}
                  className="w-full text-xs text-charcoal rounded-lg border border-orange/30 bg-white px-3 py-2 focus:outline-none focus:border-orange resize-none leading-relaxed"
                />
                <div className="flex gap-2">
                  <button onClick={onSaveSummary} className="text-xs bg-orange text-white font-bold px-3 py-1 rounded-full hover:bg-orange/80 transition-colors">Gem</button>
                  <button onClick={onCancelSummary} className="text-xs text-charcoal/40 hover:text-charcoal font-semibold transition-colors">Annullér</button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-charcoal/70 leading-relaxed line-clamp-3">{s.ai_summary}</p>
            )}
          </div>
        ) : null}

        {/* AI fejlbesked */}
        {aiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-2.5">
            <p className="text-xs text-red-600 font-semibold">⚠ {aiError}</p>
          </div>
        )}

        {/* Interview-info */}
        {s.customer_decision === "interview" && (() => {
          const fmtDate = (iso: string | null) => iso
            ? new Date(iso).toLocaleString("da-DK", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
            : null;
          const fmtLoc = (loc: string | null, addr: string | null) =>
            loc === "online" ? "💻 Online" : `📍 ${addr || "Fysisk møde"}`;

          if (s.interview_confirmed) {
            return (
              <div className="bg-green-50 border border-green-200 rounded-xl p-2.5">
                <p className="text-xs font-extrabold tracking-widest uppercase text-green-600 mb-1">✅ Interview bekræftet</p>
                {s.interview_datetime && <p className="text-xs text-green-700 font-semibold">{fmtDate(s.interview_datetime)}</p>}
                {s.interview_location && <p className="text-xs text-green-600/70 font-semibold">{fmtLoc(s.interview_location, s.interview_address ?? null)}</p>}
              </div>
            );
          }
          if (s.interview_proposed_by === "customer") {
            return (
              <div className="bg-orange/5 border border-orange/20 rounded-xl p-2.5">
                <p className="text-xs font-extrabold tracking-widest uppercase text-orange mb-1">📅 Kunde foreslår interview</p>
                {s.interview_datetime && <p className="text-xs text-charcoal font-semibold">{fmtDate(s.interview_datetime)}</p>}
                {s.interview_location && <p className="text-xs text-charcoal/60 font-semibold">{fmtLoc(s.interview_location, s.interview_address ?? null)}</p>}
                <p className="text-xs text-charcoal/45 font-bold mt-1">⏳ Afventer svar fra leverandør</p>
              </div>
            );
          }
          if (s.interview_proposed_by === "supplier") {
            return (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5">
                <p className="text-xs font-extrabold tracking-widest uppercase text-blue-600 mb-1">📅 Leverandør foreslår nyt tidspunkt</p>
                {s.interview_datetime && <p className="text-xs text-blue-700 font-semibold">{fmtDate(s.interview_datetime)}</p>}
                {s.interview_location && <p className="text-xs text-blue-600/70 font-semibold">{fmtLoc(s.interview_location, s.interview_address ?? null)}</p>}
                <p className="text-xs text-charcoal/45 font-bold mt-1">⏳ Afventer svar fra kunde</p>
              </div>
            );
          }
          return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-2.5">
              <p className="text-xs font-extrabold tracking-widest uppercase text-green-600 mb-1">✓ Kunde ønsker interview</p>
              <p className="text-xs text-orange font-bold mt-1">⏳ Afventer svar fra leverandør</p>
            </div>
          );
        })()}

        {s.customer_decision === "afvist" && (
          <p className="text-xs text-red-500 font-bold">✗ Afvist af kunde</p>
        )}
      </div>

      {/* ── Footer: handlinger ── */}
      <div className="p-4 border-t border-[#f5f2ee] space-y-2">

        {/* Status-specifikke primærknapper */}
        {s.status === "Indsendt" && (
          <div className="flex gap-2">
            <button onClick={() => onUpdateStatus("Godkendt")}
              className="flex-1 text-xs bg-green-100 text-green-700 font-bold py-1.5 rounded-lg hover:bg-green-200 transition-colors">
              Godkend
            </button>
            <button onClick={() => onUpdateStatus("Afvist")}
              className="flex-1 text-xs bg-red-100 text-red-600 font-bold py-1.5 rounded-lg hover:bg-red-200 transition-colors">
              Afvis
            </button>
          </div>
        )}

        {s.status === "Godkendt" && (
          <div className="flex gap-2">
            <button onClick={onSelect} disabled={selecting}
              className="flex-1 text-xs bg-orange text-white font-bold py-1.5 rounded-lg hover:bg-orange-dark transition-colors disabled:opacity-50">
              {selecting ? "Sender…" : "★ Vælg til visning"}
            </button>
            <button onClick={() => onUpdateStatus("Afvist")}
              className="flex-1 text-xs bg-red-100 text-red-600 font-bold py-1.5 rounded-lg hover:bg-red-200 transition-colors">
              Afvis
            </button>
          </div>
        )}

        {s.status === "Valgt" && (
          <div className="flex gap-2 items-center">
            <span className="flex-1 text-xs bg-orange/10 text-orange font-bold py-1.5 rounded-lg text-center">★ Præsenteret</span>
            <button onClick={() => onUpdateStatus("Godkendt")}
              className="text-xs text-charcoal/35 hover:text-charcoal font-semibold transition-colors px-2">
              Fortryd
            </button>
          </div>
        )}

        {s.status === "Afvist" && (
          <span className="block text-xs bg-red-50 text-red-500 font-bold py-1.5 rounded-lg text-center">✗ Afvist</span>
        )}

        {/* Sekundære knapper */}
        <div className="flex gap-2">
          <button onClick={onAiMatch} disabled={analyzing}
            className="flex-1 text-xs bg-purple-50 text-purple-700 font-bold py-1.5 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50">
            {analyzing ? "Analyserer…" : s.ai_rating ? "🤖 Genanalysér" : "🤖 AI-match"}
          </button>
          <button onClick={onDelete}
            className="text-xs bg-red-50 text-red-400 font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
            Slet
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Hoved-komponent ────────────────────────────────────────── */
export default function KonsulenterPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Indsendt" | "Godkendt" | "Valgt" | "Afvist">("all");
  const [selecting, setSelecting] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});
  const [editingSummary, setEditingSummary] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("consultant_submissions")
        .select("*, requests(description, email, reference_number, competencies, status)")
        .order("created_at", { ascending: false });
      setSubmissions(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("consultant_submissions").update({ status }).eq("id", id);
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleSelect = async (id: string) => {
    setSelecting(id);
    await supabase.from("consultant_submissions").update({ status: "Valgt" }).eq("id", id);
    await fetch("/api/notify-customer-candidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission_id: id }),
    });
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: "Valgt" } : s));
    setSelecting(null);
  };

  const handleAiMatch = async (id: string) => {
    setAnalyzing(id);
    setAiErrors(prev => { const n = { ...prev }; delete n[id]; return n; });
    try {
      const res = await fetch("/api/ai-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submission_id: id }),
      });
      const data = await res.json() as { rating?: number; summary?: string; error?: string };
      if (data.error) {
        setAiErrors(prev => ({ ...prev, [id]: `AI fejl: ${data.error}` }));
      } else if (data.rating) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ai_rating: data.rating ?? null, ai_summary: data.summary ?? null } : s));
      } else {
        setAiErrors(prev => ({ ...prev, [id]: "AI returnerede intet resultat. Tjek serverlogs." }));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setAiErrors(prev => ({ ...prev, [id]: `Netværksfejl: ${msg}` }));
    } finally {
      setAnalyzing(null);
    }
  };

  const handleSaveSummary = async (id: string) => {
    const newSummary = editingSummary[id];
    if (newSummary === undefined) return;
    await supabase.from("consultant_submissions").update({ ai_summary: newSummary }).eq("id", id);
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ai_summary: newSummary } : s));
    setEditingSummary(prev => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== id)));
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Er du sikker på at du vil slette konsulentprofilen for ${name}?\n\nDenne handling kan ikke fortrydes.`)) return;
    await supabase.from("consultant_submissions").delete().eq("id", id);
    setSubmissions(prev => prev.filter(s => s.id !== id));
  };

  const filtered = filter === "all" ? submissions : submissions.filter(s => s.status === filter);

  /* ── Gruppér efter forespørgsel ── */
  const groups: RequestGroup[] = [];
  const groupMap: Record<string, RequestGroup> = {};
  for (const s of filtered) {
    const rid = s.request_id ?? "none";
    if (!groupMap[rid]) {
      groupMap[rid] = {
        request_id: rid,
        description: s.requests?.description ?? "Ukendt opgave",
        customer_email: s.requests?.email ?? "",
        reference_number: s.requests?.reference_number ?? null,
        competencies: s.requests?.competencies ?? [],
        request_status: s.requests?.status,
        submissions: [],
      };
      groups.push(groupMap[rid]);
    }
    groupMap[rid].submissions.push(s);
  }

  if (loading) return (
    <div className="p-8 animate-pulse space-y-3">
      <div className="h-6 bg-charcoal/10 rounded w-48 mb-6" />
      {[1,2,3].map(i => <div key={i} className="h-32 bg-charcoal/10 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-bold text-2xl text-charcoal mb-1">Konsulenter</h1>
          <p className="text-charcoal/45 text-sm">{submissions.length} profil{submissions.length !== 1 ? "er" : ""} i alt</p>
        </div>
        {/* Filter */}
        <div className="flex gap-1 bg-white border border-[#ede9e3] rounded-xl p-1 flex-wrap">
          {(["all", "Indsendt", "Godkendt", "Valgt", "Afvist"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f ? "bg-charcoal text-white" : "text-charcoal/50 hover:text-charcoal"
              }`}
            >
              {f === "all" ? "Alle" : f}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ede9e3] p-12 text-center">
          <div className="text-4xl mb-3">👤</div>
          <p className="text-charcoal/40 text-sm">
            {filter !== "all" ? `Ingen profiler med status "${filter}"` : "Ingen konsulentprofiler endnu"}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(group => (
            <div key={group.request_id}>

              {/* ── Forespørgselshoved ── */}
              <div className="bg-white rounded-2xl border border-[#ede9e3] p-4 mb-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {group.reference_number && (
                        <span className="text-xs font-black text-orange bg-orange/10 px-2.5 py-0.5 rounded-full tracking-wide">{group.reference_number}</span>
                      )}
                      {group.request_status && (
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${reqStatusColor[group.request_status] ?? "bg-gray-100 text-gray-600"}`}>
                          {group.request_status}
                        </span>
                      )}
                      <span className="text-xs font-bold bg-charcoal/8 text-charcoal/50 px-2.5 py-0.5 rounded-full">
                        {group.submissions.length} konsulent{group.submissions.length !== 1 ? "er" : ""}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal font-semibold line-clamp-2 mb-2">{group.description}</p>
                    {group.competencies && group.competencies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {group.competencies.map(c => (
                          <span key={c} className="bg-orange/10 text-orange text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right space-y-1.5">
                    <p className="text-xs text-charcoal/45 font-semibold">{group.customer_email}</p>
                    {/* Mini-statistik */}
                    <div className="flex flex-col items-end gap-1 text-xs font-bold">
                      {group.submissions.filter(s => s.status === "Indsendt").length > 0 && (
                        <span className="text-blue-600">{group.submissions.filter(s => s.status === "Indsendt").length} afventer</span>
                      )}
                      {group.submissions.filter(s => s.status === "Godkendt").length > 0 && (
                        <span className="text-green-600">{group.submissions.filter(s => s.status === "Godkendt").length} godkendt</span>
                      )}
                      {group.submissions.filter(s => s.status === "Valgt").length > 0 && (
                        <span className="text-orange">{group.submissions.filter(s => s.status === "Valgt").length} præsenteret</span>
                      )}
                      {group.submissions.filter(s => s.customer_decision === "interview").length > 0 && (
                        <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          ✓ {group.submissions.filter(s => s.customer_decision === "interview").length} interview
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Kortgrid ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {group.submissions.map(s => (
                  <AdminConsultantCard
                    key={s.id}
                    s={s}
                    selecting={selecting === s.id}
                    analyzing={analyzing === s.id}
                    aiError={aiErrors[s.id]}
                    editingSummary={editingSummary[s.id]}
                    onUpdateStatus={status => updateStatus(s.id, status)}
                    onSelect={() => handleSelect(s.id)}
                    onAiMatch={() => handleAiMatch(s.id)}
                    onDelete={() => handleDelete(s.id, s.name)}
                    onEditSummary={() => setEditingSummary(prev => ({ ...prev, [s.id]: s.ai_summary ?? "" }))}
                    onSaveSummary={() => handleSaveSummary(s.id)}
                    onCancelSummary={() => setEditingSummary(prev => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== s.id)))}
                    onSummaryChange={val => setEditingSummary(prev => ({ ...prev, [s.id]: val }))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
