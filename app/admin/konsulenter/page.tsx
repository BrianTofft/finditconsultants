"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Submission } from "../types";

type RequestGroup = {
  request_id: string;
  description: string;
  customer_email: string;
  submissions: Submission[];
};

const statusColor: Record<string, string> = {
  "Indsendt": "bg-blue-100 text-blue-700",
  "Godkendt": "bg-green-100 text-green-700",
  "Valgt": "bg-orange/15 text-orange",
  "Afvist": "bg-red-100 text-red-700",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1,2,3,4,5,6,7,8,9,10].map(i => (
          <span key={i} className={`text-sm ${i <= rating ? "text-orange" : "text-charcoal/15"}`}>★</span>
        ))}
      </div>
      <span className="text-xs font-bold text-charcoal/50 ml-1">{rating}/10</span>
    </div>
  );
}

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
        .select("*, requests(description, email)")
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

  // Vælg til visning: sætter "Valgt" + notificerer kunde via email
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
        console.error("AI match API fejl:", data.error);
      } else if (data.rating) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ai_rating: data.rating ?? null, ai_summary: data.summary ?? null } : s));
      } else {
        setAiErrors(prev => ({ ...prev, [id]: "AI returnerede intet resultat. Tjek serverlogs." }));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setAiErrors(prev => ({ ...prev, [id]: `Netværksfejl: ${msg}` }));
      console.error("AI match fejl:", err);
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

  // Gruppér efter opgave (request_id)
  const groups: RequestGroup[] = [];
  const groupMap: Record<string, RequestGroup> = {};
  for (const s of filtered) {
    const rid = s.request_id ?? "none";
    if (!groupMap[rid]) {
      groupMap[rid] = {
        request_id: rid,
        description: s.requests?.description ?? "Ukendt opgave",
        customer_email: s.requests?.email ?? "",
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
    <div className="p-8 max-w-4xl">
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
          <p className="text-charcoal/40 text-sm">
            {filter !== "all" ? `Ingen profiler med status "${filter}"` : "Ingen konsulentprofiler endnu"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(group => (
            <div key={group.request_id}>
              {/* Opgave-header */}
              <div className="flex items-start justify-between gap-4 mb-3 px-1">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35 mb-0.5">Opgave</p>
                  <p className="font-bold text-sm text-charcoal line-clamp-2">{group.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35 mb-0.5">Kunde</p>
                  <p className="text-sm font-semibold text-charcoal/60">{group.customer_email}</p>
                </div>
              </div>

              {/* Konsulentprofiler under denne opgave */}
              <div className="space-y-2 border-l-2 border-orange/20 pl-3">
                {group.submissions.map(s => (
                  <div key={s.id} className="bg-white rounded-2xl border border-[#ede9e3] p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-charcoal">{s.name}</span>
                          <span className="text-charcoal/50 text-xs">{s.title}</span>
                          {s.cv_url && (
                            <a href={s.cv_url} target="_blank" rel="noopener noreferrer"
                              className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors">
                              📄 CV
                            </a>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {s.skills?.map(skill => (
                            <span key={skill} className="bg-orange/10 text-orange text-xs font-bold px-2.5 py-0.5 rounded-full">{skill}</span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-charcoal/40 font-semibold">
                          {s.rate && <span>💰 {s.rate} DKK/t</span>}
                          {s.availability && <span>📅 {new Date(s.availability).toLocaleDateString("da-DK")}</span>}
                        </div>
                        {s.bio && <p className="text-xs text-charcoal/60 mt-2 line-clamp-2">{s.bio}</p>}

                        {/* AI-analyse */}
                        {s.ai_rating ? (
                          <div className="mt-3 border border-orange/20 bg-orange/5 rounded-xl p-3">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold tracking-widest uppercase text-orange/70">AI-match</span>
                                <StarRating rating={s.ai_rating} />
                              </div>
                              {editingSummary[s.id] === undefined && (
                                <button
                                  onClick={() => setEditingSummary(prev => ({ ...prev, [s.id]: s.ai_summary ?? "" }))}
                                  className="text-[10px] text-orange/60 hover:text-orange font-bold transition-colors shrink-0"
                                >
                                  ✎ Rediger
                                </button>
                              )}
                            </div>
                            {editingSummary[s.id] !== undefined ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editingSummary[s.id]}
                                  onChange={e => setEditingSummary(prev => ({ ...prev, [s.id]: e.target.value }))}
                                  rows={5}
                                  className="w-full text-xs text-charcoal rounded-lg border border-orange/30 bg-white px-3 py-2 focus:outline-none focus:border-orange resize-none leading-relaxed"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveSummary(s.id)}
                                    className="text-xs bg-orange text-white font-bold px-3 py-1 rounded-full hover:bg-orange/80 transition-colors"
                                  >
                                    Gem
                                  </button>
                                  <button
                                    onClick={() => setEditingSummary(prev => Object.fromEntries(Object.entries(prev).filter(([k]) => k !== s.id)))}
                                    className="text-xs text-charcoal/40 hover:text-charcoal font-semibold transition-colors"
                                  >
                                    Annullér
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-charcoal/70 whitespace-pre-line leading-relaxed">{s.ai_summary}</p>
                            )}
                          </div>
                        ) : null}
                        {/* Vis fejlbesked direkte på profilen */}
                        {aiErrors[s.id] && (
                          <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-2.5">
                            <p className="text-xs text-red-600 font-semibold">⚠ {aiErrors[s.id]}</p>
                          </div>
                        )}

                        {s.customer_decision === "interview" && (
                          <div className="mt-3 border-t border-[#f0ede8] pt-3">
                            <p className="text-xs font-extrabold tracking-widest uppercase text-green-600 mb-1">✓ Kunde ønsker interview</p>
                            {s.interview_datetime && (
                              <p className="text-xs text-charcoal/50">Tidspunkt: {new Date(s.interview_datetime).toLocaleString("da-DK")}</p>
                            )}
                            {s.interview_confirmed
                              ? <p className="text-xs text-green-600 font-bold mt-1">✓ Bekræftet af leverandør</p>
                              : <p className="text-xs text-orange font-bold mt-1">⏳ Afventer svar fra leverandør</p>
                            }
                          </div>
                        )}
                        {s.customer_decision === "afvist" && (
                          <p className="mt-2 text-xs text-red-500 font-bold">✗ Afvist af kunde</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[s.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {s.status}
                        </span>

                        {/* Indsendt: intern godkendelse eller afvis */}
                        {s.status === "Indsendt" && (
                          <div className="flex flex-col gap-1.5 items-end">
                            <button
                              onClick={() => updateStatus(s.id, "Godkendt")}
                              className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-lg hover:bg-green-200 transition-colors whitespace-nowrap"
                            >
                              Godkend
                            </button>
                            <button
                              onClick={() => updateStatus(s.id, "Afvist")}
                              className="text-xs bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              Afvis
                            </button>
                          </div>
                        )}

                        {/* Godkendt: vælg til visning for kunden */}
                        {s.status === "Godkendt" && (
                          <div className="flex flex-col gap-1.5 items-end">
                            <button
                              onClick={() => handleSelect(s.id)}
                              disabled={selecting === s.id}
                              className="text-xs bg-orange text-white font-bold px-3 py-1.5 rounded-lg hover:bg-orange-dark transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              {selecting === s.id ? "Sender…" : "★ Vælg til visning"}
                            </button>
                            <button
                              onClick={() => updateStatus(s.id, "Afvist")}
                              className="text-xs bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              Afvis
                            </button>
                          </div>
                        )}

                        {/* Valgt: præsenteret for kunden */}
                        {s.status === "Valgt" && (
                          <div className="flex flex-col gap-1.5 items-end">
                            <span className="text-xs bg-orange/10 text-orange font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">★ Præsenteret for kunde</span>
                            <button
                              onClick={() => updateStatus(s.id, "Godkendt")}
                              className="text-xs text-charcoal/35 hover:text-charcoal font-semibold transition-colors"
                            >
                              Fortryd valg
                            </button>
                          </div>
                        )}

                        {/* Afvist */}
                        {s.status === "Afvist" && (
                          <span className="text-xs bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg">✗ Afvist</span>
                        )}

                        <button
                          onClick={() => handleAiMatch(s.id)}
                          disabled={analyzing === s.id}
                          className="text-xs bg-orange/10 text-orange font-bold px-3 py-1 rounded-full hover:bg-orange/20 transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {analyzing === s.id ? "Analyserer…" : s.ai_rating ? "🤖 Genanalysér" : "🤖 AI-match"}
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="text-xs bg-red-50 text-red-400 font-bold px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
                        >
                          Slet profil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
