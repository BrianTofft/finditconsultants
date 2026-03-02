"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Request, Supplier } from "../types";
import { COMPETENCIES } from "@/app/data";

const STATUSES = ["Ny", "I gang", "Afsluttet"];

export default function ForspørgslerPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [notifiedSuppliers, setNotifiedSuppliers] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Record<string, Set<string>>>({});
  const [notifying, setNotifying] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState<string | null>(null);
  const [notified, setNotified] = useState<Record<string, boolean>>({});
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [editedCompetencies, setEditedCompetencies] = useState<Record<string, string[]>>({});
  const [aiRankings, setAiRankings] = useState<Record<string, Array<{ supplier_id: string; stars: number; reason: string }>>>({});
  const [ranking, setRanking] = useState<string | null>(null);
  const [showContractForm, setShowContractForm] = useState<string | null>(null);
  const [contractForm, setContractForm] = useState({ consultant_name: "", rate: "", duration: "", start_date: "", supplier_id: "" });
  const [savingContract, setSavingContract] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [reqRes, supRes, rsRes] = await Promise.all([
        supabase.from("requests").select("*").eq("admin_status", "accepted").order("created_at", { ascending: false }),
        supabase.from("suppliers").select("id, email, company_name"),
        supabase.from("request_suppliers").select("request_id, supplier_id"),
      ]);
      setRequests(reqRes.data ?? []);
      setSuppliers(supRes.data ?? []);
      const nsMap: Record<string, string[]> = {};
      for (const rs of (rsRes.data ?? [])) {
        if (!nsMap[rs.request_id]) nsMap[rs.request_id] = [];
        nsMap[rs.request_id].push(rs.supplier_id);
      }
      setNotifiedSuppliers(nsMap);
      setLoading(false);
    };
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("requests").update({ status }).eq("id", id);
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDeleteRequest = async (id: string, email: string) => {
    if (!confirm(`Er du sikker på at du vil slette opgaven fra ${email}?\n\nDette sletter også alle tilknyttede konsulentprofiler, kontrakter og leverandørlinks.`)) return;
    // Slet relaterede rækker før selve opgaven (FK-rækkefølge)
    await supabase.from("request_suppliers").delete().eq("request_id", id);
    await supabase.from("consultant_submissions").delete().eq("request_id", id);
    await supabase.from("contracts").delete().eq("request_id", id);
    await supabase.from("requests").delete().eq("id", id);
    setRequests(prev => prev.filter(r => r.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const toggleSupplier = (requestId: string, supplierId: string) => {
    setSelectedSuppliers(prev => {
      const current = new Set(prev[requestId] ?? []);
      current.has(supplierId) ? current.delete(supplierId) : current.add(supplierId);
      return { ...prev, [requestId]: current };
    });
  };

  const notifySuppliers = async (requestId: string) => {
    const selected = Array.from(selectedSuppliers[requestId] ?? []);
    if (selected.length === 0) return;
    setNotifying(requestId);
    await fetch("/api/notify-suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId, supplier_ids: selected }),
    });
    setNotified(prev => ({ ...prev, [requestId]: true }));
    setNotifiedSuppliers(prev => ({ ...prev, [requestId]: [...(prev[requestId] ?? []), ...selected] }));
    setNotifying(null);
    setTimeout(() => setNotified(prev => ({ ...prev, [requestId]: false })), 3000);
  };

  const toggleCompetency = async (requestId: string, competency: string, current: string[]) => {
    const updated = current.includes(competency)
      ? current.filter(c => c !== competency)
      : [...current, competency];
    setEditedCompetencies(prev => ({ ...prev, [requestId]: updated }));
    await supabase.from("requests").update({ competencies: updated }).eq("id", requestId);
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, competencies: updated } : r));
  };

  const rankSuppliers = async (requestId: string) => {
    setRanking(requestId);
    try {
      const res = await fetch("/api/ai-rank-suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_id: requestId }),
      });
      const data = await res.json();
      if (data.rankings) setAiRankings(prev => ({ ...prev, [requestId]: data.rankings }));
    } catch (err) {
      console.error("AI ranking fejl:", err);
    }
    setRanking(null);
  };

  const withdrawSupplier = async (requestId: string, supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (!confirm(`Træk forespørgslen tilbage fra ${supplier?.company_name || supplier?.email}?\n\nLeverandøren vil ikke længere kunne se opgaven i sin portal.`)) return;
    setWithdrawing(supplierId);
    await supabase.from("request_suppliers").delete().eq("request_id", requestId).eq("supplier_id", supplierId);
    setNotifiedSuppliers(prev => ({
      ...prev,
      [requestId]: (prev[requestId] ?? []).filter(id => id !== supplierId),
    }));
    setWithdrawing(null);
  };

  const createContract = async (requestId: string) => {
    setSavingContract(true);
    const { data } = await supabase.from("contracts").insert({
      request_id: requestId,
      supplier_id: contractForm.supplier_id,
      consultant_name: contractForm.consultant_name,
      rate: parseInt(contractForm.rate),
      duration: contractForm.duration,
      start_date: contractForm.start_date || null,
    }).select().single();
    if (data) {
      await supabase.from("requests").update({ status: "Afsluttet" }).eq("id", requestId);
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "Afsluttet" } : r));
    }
    setShowContractForm(null);
    setContractForm({ consultant_name: "", rate: "", duration: "", start_date: "", supplier_id: "" });
    setSavingContract(false);
  };

  const statusColor: Record<string, string> = {
    "Ny": "bg-blue-100 text-blue-700",
    "I gang": "bg-orange/15 text-orange",
    "Afsluttet": "bg-green-100 text-green-700",
  };

  const inp = "w-full rounded-xl border border-[#e8e5e0] bg-white px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-orange transition-all";
  const lbl = "block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5";

  if (loading) return (
    <div className="p-8 animate-pulse space-y-3">
      <div className="h-6 bg-charcoal/10 rounded w-48 mb-6" />
      {[1,2,3].map(i => <div key={i} className="h-24 bg-charcoal/10 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-charcoal mb-1">Forespørgsler</h1>
        <p className="text-charcoal/45 text-sm">{requests.length} godkendt{requests.length !== 1 ? "e" : ""} forespørgsel{requests.length !== 1 ? "er" : ""}</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ede9e3] p-12 text-center">
          <p className="text-charcoal/40 text-sm">Ingen godkendte forespørgsler endnu</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-[#ede9e3] overflow-hidden">
              {/* Card header */}
              <div
                className="p-5 cursor-pointer hover:bg-[#faf9f7] transition-colors"
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-charcoal">{r.email}</span>
                      <span className="text-charcoal/35 text-xs">{new Date(r.created_at).toLocaleDateString("da-DK")}</span>
                    </div>
                    <p className="text-sm text-charcoal/70 line-clamp-2 mb-2">{r.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.competencies?.map(c => (
                        <span key={c} className="bg-orange/10 text-orange text-xs font-bold px-2.5 py-0.5 rounded-full">{c}</span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-charcoal/40 font-semibold">
                      {r.duration && <span>⏱ {r.duration}</span>}
                      {r.work_mode && <span>📍 {r.work_mode}</span>}
                      {r.start_date && <span>📅 {r.start_date}</span>}
                      {r.max_rate && <span>💰 Maks. {r.max_rate} DKK/time</span>}
                    </div>
                    {r.file_url && (
                      <a
                        href={r.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-bold text-orange hover:underline"
                      >
                        📎 Se vedhæftet fil
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[r.status] ?? "bg-gray-100 text-gray-600"}`}>{r.status}</span>
                    <select
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value)}
                      className="text-xs border border-[#e8e5e0] rounded-lg px-2 py-1 text-charcoal bg-[#f8f6f3] focus:outline-none focus:border-orange"
                    >
                      {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button
                      onClick={() => { setShowContractForm(showContractForm === r.id ? null : r.id); setContractForm({ consultant_name: "", rate: "", duration: "", start_date: "", supplier_id: "" }); }}
                      className="text-xs bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                    >
                      + Kontrakt
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDeleteRequest(r.id, r.email); }}
                      className="text-xs bg-red-50 text-red-500 font-bold px-3 py-1 rounded-full hover:bg-red-100 transition-colors"
                    >
                      Slet opgave
                    </button>
                    {(notifiedSuppliers[r.id]?.length ?? 0) > 0
                      ? <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ Sendt til {notifiedSuppliers[r.id].length} lev.</span>
                      : <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">Ikke videresendt</span>
                    }
                    <svg className={`w-4 h-4 text-charcoal/30 transition-transform ${expanded === r.id ? "rotate-180" : ""}`} viewBox="0 0 12 8" fill="none">
                      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded: supplier selection */}
              {expanded === r.id && (
                <div className="border-t border-[#ede9e3] bg-[#faf9f7] p-5">
                  <h3 className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-2">Kompetencer</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {COMPETENCIES.map(c => {
                      const active = (editedCompetencies[r.id] ?? r.competencies ?? []).includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCompetency(r.id, c, editedCompetencies[r.id] ?? r.competencies ?? [])}
                          className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                            active
                              ? "bg-orange text-white border-orange"
                              : "bg-white text-charcoal/50 border-[#e8e5e0] hover:border-orange/50"
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                  <h3 className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-2">Note til leverandører</h3>
                  <textarea
                    className="w-full rounded-xl border border-[#e8e5e0] bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all resize-none mb-4"
                    rows={3}
                    placeholder="Ekstra context eller specifikke krav til leverandørerne…"
                    value={adminNotes[r.id] ?? r.admin_note ?? ""}
                    onChange={e => setAdminNotes(prev => ({ ...prev, [r.id]: e.target.value }))}
                    onBlur={async () => { await supabase.from("requests").update({ admin_note: adminNotes[r.id] }).eq("id", r.id); }}
                  />
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40">Vælg leverandører</h3>
                    <button
                      onClick={() => rankSuppliers(r.id)}
                      disabled={ranking === r.id}
                      className="flex items-center gap-1.5 text-xs font-bold bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                    >
                      {ranking === r.id ? (
                        <><span className="animate-spin inline-block">⟳</span> Analyserer…</>
                      ) : (
                        <>🤖 AI-rangér leverandører</>
                      )}
                    </button>
                  </div>
                  {aiRankings[r.id] && (
                    <p className="text-[10px] text-charcoal/40 font-semibold mb-2">Sorteret efter AI-match — klik for at vælge</p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {(aiRankings[r.id]
                      ? [...suppliers].sort((a, b) => {
                          const ra = aiRankings[r.id].find(x => x.supplier_id === a.id)?.stars ?? 0;
                          const rb = aiRankings[r.id].find(x => x.supplier_id === b.id)?.stars ?? 0;
                          return rb - ra;
                        })
                      : suppliers
                    ).map(s => {
                      const alreadyNotified = notifiedSuppliers[r.id]?.includes(s.id);
                      const isSelected = selectedSuppliers[r.id]?.has(s.id);
                      const ranking_data = aiRankings[r.id]?.find(x => x.supplier_id === s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => !alreadyNotified && toggleSupplier(r.id, s.id)}
                          title={ranking_data?.reason}
                          className={`flex flex-col gap-1.5 p-3 rounded-xl border transition-all text-sm font-semibold ${
                            alreadyNotified ? "border-green-200 bg-green-50 text-green-700 cursor-default"
                            : isSelected ? "border-orange bg-orange/5 text-charcoal cursor-pointer"
                            : "border-[#e8e5e0] bg-white hover:border-orange/50 text-charcoal cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                              alreadyNotified ? "bg-green-500 border-green-500"
                              : isSelected ? "bg-orange border-orange"
                              : "border-[#d4cfc8]"
                            }`}>
                              {(alreadyNotified || isSelected) && (
                                <svg width="8" height="7" viewBox="0 0 10 8" fill="none">
                                  <path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="truncate flex-1">{s.company_name || s.email}</span>
                            {alreadyNotified && (
                              <button
                                onClick={e => { e.stopPropagation(); withdrawSupplier(r.id, s.id); }}
                                disabled={withdrawing === s.id}
                                title="Træk forespørgsel tilbage"
                                className="ml-auto text-[10px] font-bold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
                              >
                                {withdrawing === s.id ? "…" : "Træk tilbage"}
                              </button>
                            )}
                          </div>
                          {ranking_data && (
                            <div className="flex items-center gap-1.5">
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => (
                                  <span key={i} className={`text-xs ${i <= ranking_data.stars ? "text-orange" : "text-charcoal/15"}`}>★</span>
                                ))}
                              </div>
                              <span className="text-[10px] text-charcoal/45 font-medium truncate">{ranking_data.reason}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => notifySuppliers(r.id)}
                    disabled={!selectedSuppliers[r.id]?.size || notifying === r.id}
                    className="bg-orange text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-orange-dark transition-all disabled:opacity-40"
                  >
                    {notifying === r.id ? "Sender…" : notified[r.id] ? "Sendt ✓" : `Send til ${selectedSuppliers[r.id]?.size ?? 0} leverandør(er)`}
                  </button>
                </div>
              )}

              {/* Contract form */}
              {showContractForm === r.id && (
                <div className="border-t border-[#ede9e3] bg-purple-50 p-5">
                  <h3 className="text-[10px] font-extrabold tracking-widest uppercase text-purple-600 mb-3">Opret kontrakt</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div><label className={lbl}>Konsulentnavn</label><input className={inp} placeholder="Navn" value={contractForm.consultant_name} onChange={e => setContractForm(f => ({ ...f, consultant_name: e.target.value }))} /></div>
                    <div>
                      <label className={lbl}>Leverandør</label>
                      <select className={inp} value={contractForm.supplier_id} onChange={e => setContractForm(f => ({ ...f, supplier_id: e.target.value }))}>
                        <option value="">Vælg leverandør…</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name || s.email}</option>)}
                      </select>
                    </div>
                    <div><label className={lbl}>Timepris (DKK)</label><input type="number" className={inp} placeholder="1200" value={contractForm.rate} onChange={e => setContractForm(f => ({ ...f, rate: e.target.value }))} /></div>
                    <div><label className={lbl}>Varighed</label><input className={inp} placeholder="6 mdr." value={contractForm.duration} onChange={e => setContractForm(f => ({ ...f, duration: e.target.value }))} /></div>
                    <div><label className={lbl}>Startdato</label><input type="date" className={inp} value={contractForm.start_date} onChange={e => setContractForm(f => ({ ...f, start_date: e.target.value }))} /></div>
                  </div>
                  <button
                    onClick={() => createContract(r.id)}
                    disabled={savingContract || !contractForm.consultant_name || !contractForm.supplier_id}
                    className="bg-purple-600 text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-purple-700 transition-all disabled:opacity-40"
                  >
                    {savingContract ? "Gemmer…" : "Opret kontrakt"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
