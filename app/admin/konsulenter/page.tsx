"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Submission } from "../types";

export default function KonsulenterPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "Indsendt" | "Godkendt" | "Afvist">("all");

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

  const statusColor: Record<string, string> = {
    "Indsendt": "bg-blue-100 text-blue-700",
    "Godkendt": "bg-green-100 text-green-700",
    "Afvist": "bg-red-100 text-red-700",
  };

  const filtered = filter === "all" ? submissions : submissions.filter(s => s.status === filter);

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
        <div className="flex gap-1 bg-white border border-[#ede9e3] rounded-xl p-1">
          {(["all", "Indsendt", "Godkendt", "Afvist"] as const).map(f => (
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

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ede9e3] p-12 text-center">
          <p className="text-charcoal/40 text-sm">Ingen konsulentprofiler{filter !== "all" ? ` med status "${filter}"` : ""}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(s => (
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
                  {s.requests && (
                    <p className="text-xs text-charcoal/50 mb-2">📋 {s.requests.description?.slice(0, 70)}…</p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {s.skills?.map(skill => (
                      <span key={skill} className="bg-orange/10 text-orange text-xs font-bold px-2.5 py-0.5 rounded-full">{skill}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-charcoal/40 font-semibold">
                    {s.rate && <span>💰 {s.rate} DKK/t</span>}
                    {s.availability && <span>📅 {s.availability}</span>}
                  </div>
                  {s.bio && <p className="text-xs text-charcoal/60 mt-2 line-clamp-2">{s.bio}</p>}

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
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(s.id, "Godkendt")}
                      className="text-xs bg-green-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
