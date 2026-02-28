"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SupplierApplication } from "../types";

export default function AnsøgningerPage() {
  const [applications, setApplications] = useState<SupplierApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "Afventer" | "Godkendt" | "Afvist">("Afventer");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("supplier_applications")
        .select("*")
        .order("created_at", { ascending: false });
      setApplications(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const handleDecision = async (app: SupplierApplication, decision: "accepted" | "rejected") => {
    setProcessing(app.id);

    if (decision === "accepted") {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: app.email,
          password: Math.random().toString(36).slice(-10),
          role: "supplier",
          company_name: app.company_name,
          contact_name: `${app.first_name} ${app.last_name}`,
          phone: app.phone,
        }),
      });
      const data = await res.json();
      if (data.userId) {
        await supabase.from("suppliers").update({
          first_name: app.first_name,
          last_name: app.last_name,
          company_type: app.company_type,
          competencies: app.competencies,
          extra_competencies: app.extra_competencies,
          language: app.language,
        }).eq("id", data.userId);
      }
      await fetch("/api/notify-supplier-approved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: app.email, first_name: app.first_name, company_name: app.company_name }),
      });
    }

    const newStatus = decision === "accepted" ? "Godkendt" : "Afvist";
    await supabase.from("supplier_applications").update({ status: newStatus }).eq("id", app.id);
    setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: newStatus } : a));
    setProcessing(null);
  };

  const filtered = filter === "all" ? applications : applications.filter(a => a.status === filter);
  const pendingCount = applications.filter(a => a.status === "Afventer").length;

  if (loading) return (
    <div className="p-8 animate-pulse space-y-3">
      <div className="h-6 bg-charcoal/10 rounded w-48 mb-6" />
      {[1,2].map(i => <div key={i} className="h-36 bg-charcoal/10 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="font-bold text-2xl text-charcoal mb-1">Ansøgninger</h1>
          <p className="text-charcoal/45 text-sm">
            {applications.length} ansøgning{applications.length !== 1 ? "er" : ""} i alt
            {pendingCount > 0 && <span className="ml-2 text-amber-600 font-bold">· {pendingCount} afventer</span>}
          </p>
        </div>
        {/* Filter */}
        <div className="flex gap-1 bg-white border border-[#ede9e3] rounded-xl p-1">
          {(["Afventer", "all", "Godkendt", "Afvist"] as const).map(f => (
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
          <p className="text-charcoal/40 text-sm">
            Ingen ansøgninger{filter !== "all" ? ` med status "${filter}"` : ""} endnu
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-[#ede9e3] p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-bold text-charcoal">{a.company_name}</span>
                    {a.company_type && (
                      <span className="text-xs text-charcoal/40 font-semibold bg-[#f8f6f3] px-2 py-0.5 rounded-full">{a.company_type}</span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal/60">👤 {a.first_name} {a.last_name}</p>
                  <p className="text-xs text-charcoal/50 mt-0.5">✉️ {a.email}</p>
                  {a.phone && <p className="text-xs text-charcoal/50 mt-0.5">📞 {a.phone}</p>}
                  {a.language && <p className="text-xs text-charcoal/50 mt-0.5">🌐 {a.language}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {a.competencies?.map(c => (
                      <span key={c} className="bg-orange/10 text-orange text-xs font-bold px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                  {a.extra_competencies && (
                    <p className="text-xs text-charcoal/50 mt-1">+ {a.extra_competencies}</p>
                  )}
                  <p className="text-[10px] text-charcoal/30 mt-2">{new Date(a.created_at).toLocaleDateString("da-DK")}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {a.status === "Afventer" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDecision(a, "accepted")}
                        disabled={processing === a.id}
                        className="text-sm bg-green-500 text-white font-bold px-4 py-2 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {processing === a.id ? "…" : "Godkend"}
                      </button>
                      <button
                        onClick={() => handleDecision(a, "rejected")}
                        disabled={processing === a.id}
                        className="text-sm bg-red-100 text-red-600 font-bold px-4 py-2 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        Afslå
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      a.status === "Godkendt" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {a.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
