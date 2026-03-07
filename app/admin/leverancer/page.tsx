"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Contract, DeliveryHours } from "../types";

/* ─── Helpers ─────────────────────────────────────────────────── */
function generateMonths(startDate: string, endDate: string | null) {
  const months: { year: number; month: number }[] = [];
  const start = new Date(startDate); start.setDate(1);
  const end = endDate ? new Date(endDate) : new Date(); end.setDate(1);
  const cur = new Date(start);
  while (cur <= end) {
    months.push({ year: cur.getFullYear(), month: cur.getMonth() + 1 });
    cur.setMonth(cur.getMonth() + 1);
  }
  return months;
}

const MONTH_NAMES = ["Januar","Februar","Marts","April","Maj","Juni",
                     "Juli","August","September","Oktober","November","December"];

/* ─── Contract card ───────────────────────────────────────────── */
function LeveranceCard({
  contract: c,
  hours,
  onUpdate,
}: {
  contract: Contract;
  hours: DeliveryHours[];
  onUpdate: (contractId: string, fields: Partial<Contract>) => void;
}) {
  const [startDate, setStartDate] = useState(c.start_date ?? "");
  const [endDate, setEndDate] = useState(c.end_date ?? "");
  const [consultantEmail, setConsultantEmail] = useState(c.consultant_email ?? "");
  const [consultantPhone, setConsultantPhone] = useState(c.consultant_phone ?? "");
  const [localHours, setLocalHours] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const h of hours) {
      map[`${h.year}-${h.month}`] = String(h.hours);
    }
    return map;
  });
  const [savingFields, setSavingFields] = useState(false);

  const months = startDate ? generateMonths(startDate, endDate || null) : [];
  const total = months.reduce((sum, { year, month }) => {
    const val = parseFloat(localHours[`${year}-${month}`] ?? "0") || 0;
    return sum + val;
  }, 0);

  const saveField = async (field: string, value: string | null) => {
    setSavingFields(true);
    await supabase.from("contracts").update({ [field]: value || null }).eq("id", c.id);
    onUpdate(c.id, { [field]: value || null });
    setSavingFields(false);
  };

  const saveHours = async (year: number, month: number, value: string) => {
    const hours = parseFloat(value) || 0;
    await supabase.from("delivery_hours").upsert(
      { contract_id: c.id, year, month, hours, updated_at: new Date().toISOString() },
      { onConflict: "contract_id,year,month" }
    );
  };

  const inp = "w-full rounded-lg border border-[#e8e5e0] bg-[#f8f6f3] px-3 py-1.5 text-sm text-charcoal focus:outline-none focus:border-orange transition-all";

  return (
    <div className="bg-white rounded-2xl border border-[#ede9e3] p-5 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-bold text-charcoal">{c.consultant_name}</p>
          <p className="text-xs text-charcoal/50 mt-0.5">{c.suppliers?.company_name || c.suppliers?.email}</p>
          {c.requests?.description && (
            <p className="text-xs text-charcoal/35 mt-1 line-clamp-1">{c.requests.description}</p>
          )}
        </div>
        {c.rate && <p className="font-bold text-orange">{c.rate.toLocaleString("da-DK")} DKK/t</p>}
      </div>

      {/* Editable contract fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-1">Startdato</label>
          <input
            type="date"
            className={inp}
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            onBlur={() => saveField("start_date", startDate)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-1">Slutdato</label>
          <input
            type="date"
            className={inp}
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            onBlur={() => saveField("end_date", endDate)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-1">Konsulent email</label>
          <input
            type="email"
            className={inp}
            placeholder="konsulent@firma.dk"
            value={consultantEmail}
            onChange={e => setConsultantEmail(e.target.value)}
            onBlur={() => saveField("consultant_email", consultantEmail)}
          />
        </div>
        <div>
          <label className="block text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-1">Konsulent telefon</label>
          <input
            className={inp}
            placeholder="+45 12 34 56 78"
            value={consultantPhone}
            onChange={e => setConsultantPhone(e.target.value)}
            onBlur={() => saveField("consultant_phone", consultantPhone)}
          />
        </div>
      </div>

      {/* Supplier contact */}
      {c.suppliers && (
        <div className="bg-[#f8f6f3] rounded-xl p-3 text-xs">
          <p className="font-extrabold tracking-widest uppercase text-charcoal/35 mb-1">Leverandørkontakt</p>
          <div className="flex flex-wrap gap-x-6 gap-y-0.5 text-charcoal/60">
            <span className="font-semibold text-charcoal">{c.suppliers.company_name}</span>
            {c.suppliers.email && <span>{c.suppliers.email}</span>}
          </div>
        </div>
      )}

      {/* Hours table */}
      {months.length > 0 ? (
        <div>
          <p className="text-[10px] font-extrabold tracking-widest uppercase text-charcoal/40 mb-2">Timer per måned</p>
          <div className="border border-[#ede9e3] rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#f8f6f3] border-b border-[#ede9e3]">
                  <th className="text-left px-4 py-2 font-extrabold tracking-widest uppercase text-charcoal/40">Måned</th>
                  <th className="text-right px-4 py-2 font-extrabold tracking-widest uppercase text-charcoal/40 w-28">Timer</th>
                </tr>
              </thead>
              <tbody>
                {months.map(({ year, month }) => {
                  const key = `${year}-${month}`;
                  return (
                    <tr key={key} className="border-b border-[#f5f2ee] last:border-0">
                      <td className="px-4 py-2 text-charcoal/70 font-semibold">{MONTH_NAMES[month-1]} {year}</td>
                      <td className="px-2 py-1.5 text-right">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          className="w-24 rounded-lg border border-[#e8e5e0] bg-white px-2 py-1 text-xs text-right text-charcoal focus:outline-none focus:border-orange transition-all"
                          value={localHours[key] ?? ""}
                          placeholder="0"
                          onChange={e => setLocalHours(prev => ({ ...prev, [key]: e.target.value }))}
                          onBlur={e => saveHours(year, month, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-[#f8f6f3] border-t border-[#ede9e3]">
                  <td className="px-4 py-2.5 font-extrabold text-charcoal/60 uppercase tracking-widest text-[10px]">Total</td>
                  <td className="px-4 py-2.5 text-right font-black text-charcoal">{total.toLocaleString("da-DK")} t</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-xs text-charcoal/35 italic">Angiv start- og slutdato for at se månedsoversigt</p>
      )}

      {savingFields && <p className="text-[10px] text-charcoal/35 text-right">Gemmer…</p>}
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────── */
export default function LeverancerPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [deliveryHours, setDeliveryHours] = useState<DeliveryHours[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: contractData } = await supabase
        .from("contracts")
        .select("*, requests(description, email), suppliers(company_name, email)")
        .order("created_at", { ascending: false });

      const contracts = contractData ?? [];
      setContracts(contracts);

      if (contracts.length > 0) {
        const { data: hoursData } = await supabase
          .from("delivery_hours")
          .select("*")
          .in("contract_id", contracts.map(c => c.id));
        setDeliveryHours(hoursData ?? []);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleUpdate = (contractId: string, fields: Partial<Contract>) => {
    setContracts(prev => prev.map(c => c.id === contractId ? { ...c, ...fields } : c));
  };

  if (loading) return (
    <div className="p-8 animate-pulse space-y-3">
      <div className="h-6 bg-charcoal/10 rounded w-40 mb-6" />
      {[1,2].map(i => <div key={i} className="h-64 bg-charcoal/10 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-charcoal mb-1">Leverancer</h1>
        <p className="text-charcoal/45 text-sm">{contracts.length} kontrakt{contracts.length !== 1 ? "er" : ""} i alt</p>
      </div>

      {contracts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ede9e3] p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-charcoal/40 text-sm">Ingen kontrakter endnu</p>
          <p className="text-charcoal/30 text-xs mt-1">Kontrakter oprettes fra Forespørgsler-siden</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contracts.map(c => (
            <LeveranceCard
              key={c.id}
              contract={c}
              hours={deliveryHours.filter(h => h.contract_id === c.id)}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
