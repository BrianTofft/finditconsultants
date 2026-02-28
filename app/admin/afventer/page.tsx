"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Request } from "../types";

export default function AfventerPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("requests")
        .select("*")
        .or("admin_status.is.null,admin_status.eq.pending")
        .order("created_at", { ascending: false });
      setRequests(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Er du sikker på at du vil slette forespørgslen fra ${email} permanent?\n\nDenne handling kan ikke fortrydes.`)) return;
    await supabase.from("requests").delete().eq("id", id);
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleDecision = async (requestId: string, email: string, decision: "accepted" | "rejected") => {
    setProcessing(requestId);

    if (decision === "rejected") {
      await supabase.from("requests").update({ admin_status: "rejected" }).eq("id", requestId);
      setRequests(prev => prev.filter(r => r.id !== requestId));
      setProcessing(null);
      return;
    }

    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from("customers").select("id").eq("email", email).single();

    if (!existingCustomer) {
      const tempPassword = Math.random().toString(36).slice(-10);
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: tempPassword, role: "customer", company_name: "", contact_name: "", phone: "" }),
      });
      const data = await res.json();
      if (data.userId) {
        await fetch("/api/notify-customer-approved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: tempPassword }),
        });
      }
    }

    await supabase.from("requests").update({ admin_status: "accepted", status: "Ny" }).eq("id", requestId);
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setProcessing(null);
  };

  if (loading) return (
    <div className="p-8 animate-pulse space-y-3">
      <div className="h-6 bg-charcoal/10 rounded w-48 mb-6" />
      {[1,2,3].map(i => <div key={i} className="h-28 bg-charcoal/10 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-charcoal mb-1">Afventer</h1>
        <p className="text-charcoal/45 text-sm">{requests.length} forespørgsel{requests.length !== 1 ? "er" : ""} afventer godkendelse</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ede9e3] p-12 text-center">
          <div className="text-5xl mb-4">✓</div>
          <p className="font-bold text-charcoal mb-1">Ingen afventende forespørgsler</p>
          <p className="text-charcoal/40 text-sm">Alle forespørgsler er behandlet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-[#ede9e3] p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-bold text-charcoal">{r.email}</span>
                    <span className="text-charcoal/35 text-xs">{new Date(r.created_at).toLocaleDateString("da-DK")}</span>
                  </div>
                  <p className="text-sm text-charcoal/70 mb-3">{r.description || "Ingen beskrivelse"}</p>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {r.competencies?.map(c => (
                      <span key={c} className="bg-orange/10 text-orange text-xs font-bold px-2.5 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-charcoal/40 font-semibold">
                    {r.duration && <span>⏱ {r.duration}</span>}
                    {r.work_mode && <span>📍 {r.work_mode}</span>}
                    {r.start_date && <span>📅 {r.start_date}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleDecision(r.id, r.email, "accepted")}
                    disabled={processing === r.id}
                    className="text-sm bg-green-500 text-white font-bold px-5 py-2 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {processing === r.id ? "…" : "Acceptér"}
                  </button>
                  <button
                    onClick={() => handleDecision(r.id, r.email, "rejected")}
                    disabled={processing === r.id}
                    className="text-sm bg-red-100 text-red-600 font-bold px-5 py-2 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    Afvis
                  </button>
                  <button
                    onClick={() => handleDelete(r.id, r.email)}
                    disabled={processing === r.id}
                    className="text-xs bg-red-50 text-red-400 font-bold px-4 py-1.5 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Slet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
