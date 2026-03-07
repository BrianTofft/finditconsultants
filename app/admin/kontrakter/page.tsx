"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Contract } from "../types";

function ContractCard({ contract: c, onUpdateScore }: { contract: Contract; onUpdateScore: (id: string, score: number, comment: string) => void }) {
  const [score, setScore] = useState(c.score ?? 0);
  const [comment, setComment] = useState(c.score_comment ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#ede9e3] p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <p className="font-bold text-charcoal">{c.consultant_name}</p>
          <p className="text-xs text-charcoal/50 mt-0.5">{c.suppliers?.company_name || c.suppliers?.email}</p>
          {c.requests && (
            <p className="text-xs text-charcoal/40 mt-1">📋 {c.requests.description?.slice(0, 60)}…</p>
          )}
        </div>
        <div className="text-right">
          {c.rate && <p className="font-bold text-orange">{c.rate} DKK/t</p>}
          {c.duration && <p className="text-xs text-charcoal/50">{c.duration}</p>}
          {c.start_date && (
            <p className="text-xs text-charcoal/40 mt-0.5">📅 {new Date(c.start_date).toLocaleDateString("da-DK")}{c.end_date ? ` → ${new Date(c.end_date).toLocaleDateString("da-DK")}` : ""}</p>
          )}
          {(c.consultant_email || c.consultant_phone) && (
            <div className="mt-1 text-xs text-charcoal/40">
              {c.consultant_email && <p>{c.consultant_email}</p>}
              {c.consultant_phone && <p>{c.consultant_phone}</p>}
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-[#f0ede8] pt-4">
        <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-2">Score ved endt opgave</p>
        <div className="flex gap-1.5 mb-3">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setScore(n)}
              className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                score >= n ? "bg-orange text-white shadow-sm" : "bg-[#f8f6f3] text-charcoal/40 hover:bg-orange/20"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <input
          className="w-full rounded-xl border border-[#e8e5e0] bg-[#f8f6f3] px-4 py-2 text-sm text-charcoal focus:outline-none focus:border-orange transition-all mb-3"
          placeholder="Kommentar til score…"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button
          onClick={async () => {
            setSaving(true);
            await onUpdateScore(c.id, score, comment);
            setSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          disabled={saving || score === 0}
          className="bg-orange text-white font-bold rounded-full px-5 py-2 text-xs hover:bg-orange-dark transition-all disabled:opacity-40"
        >
          {saved ? "Gemt ✓" : saving ? "Gemmer…" : "Gem score"}
        </button>
      </div>
    </div>
  );
}

export default function KontrakterPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("contracts")
        .select("*, requests(description, email), suppliers(company_name, email)")
        .order("created_at", { ascending: false });
      setContracts(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const updateScore = async (contractId: string, score: number, comment: string) => {
    await supabase.from("contracts").update({ score, score_comment: comment }).eq("id", contractId);
    setContracts(prev => prev.map(c => c.id === contractId ? { ...c, score, score_comment: comment } : c));
  };

  if (loading) return (
    <div className="p-8 animate-pulse space-y-3">
      <div className="h-6 bg-charcoal/10 rounded w-40 mb-6" />
      {[1,2].map(i => <div key={i} className="h-40 bg-charcoal/10 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-charcoal mb-1">Kontrakter</h1>
        <p className="text-charcoal/45 text-sm">{contracts.length} kontrakt{contracts.length !== 1 ? "er" : ""} i alt</p>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ede9e3] p-12 text-center">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-charcoal/40 text-sm">Ingen kontrakter endnu</p>
          <p className="text-charcoal/30 text-xs mt-1">Kontrakter oprettes fra Forespørgsler-siden</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map(c => (
            <ContractCard key={c.id} contract={c} onUpdateScore={updateScore} />
          ))}
        </div>
      )}
    </div>
  );
}
