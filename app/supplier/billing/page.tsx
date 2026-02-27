"use client";
import PortalLayout from "@/components/portal/PortalLayout";
import StatusBadge from "@/components/portal/StatusBadge";
import { MOCK_SUPPLIER, MOCK_INVOICES } from "@/app/portal-mock-data";

const NAV = [
  { href: "/supplier/dashboard", label: "Overblik",      icon: "🏠" },
  { href: "/supplier/requests",  label: "Forespørgsler", icon: "📋", badge: 2 },
  { href: "/supplier/offers",    label: "Mine tilbud",   icon: "📤" },
  { href: "/supplier/messages",  label: "Beskeder",      icon: "💬", badge: 1 },
  { href: "/supplier/billing",   label: "Fakturering",   icon: "💰" },
];

export default function SupplierBilling() {
  const total = "128.500 kr";
  const pending = "38.000 kr";

  return (
    <PortalLayout user={MOCK_SUPPLIER} navItems={NAV} portalType="supplier">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-2xl text-charcoal">Fakturering</h1>
          <p className="text-charcoal/50 text-sm mt-1">Overblik over fakturaer og betalinger</p>
        </div>
        <button className="bg-orange text-white font-bold rounded-full px-5 py-2.5 text-sm hover:bg-orange-dark transition-colors">
          + Ny faktura
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-[#ede9e3] shadow-sm">
          <div className="text-xs font-extrabold tracking-widest uppercase text-charcoal/40 mb-2">Afventende betaling</div>
          <div className="font-black text-3xl text-orange">{pending}</div>
          <div className="text-xs text-charcoal/40 mt-1">1 faktura</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#ede9e3] shadow-sm">
          <div className="text-xs font-extrabold tracking-widest uppercase text-charcoal/40 mb-2">Betalt i alt (2026)</div>
          <div className="font-black text-3xl text-green-600">{total}</div>
          <div className="text-xs text-charcoal/40 mt-1">2 fakturaer</div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-[#ede9e3] shadow-sm">
          <div className="text-xs font-extrabold tracking-widest uppercase text-charcoal/40 mb-2">Aktive kontrakter</div>
          <div className="font-black text-3xl text-charcoal">1</div>
          <div className="text-xs text-charcoal/40 mt-1">Nordic Bioscience A/S</div>
        </div>
      </div>

      {/* Invoices table */}
      <div className="bg-white rounded-2xl border border-[#ede9e3] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#ede9e3]">
          <h2 className="font-bold text-charcoal">Fakturaer</h2>
        </div>
        <div className="divide-y divide-[#f0ede8]">
          {/* Header */}
          <div className="grid grid-cols-5 px-6 py-3 text-[10px] font-extrabold tracking-widest uppercase text-charcoal/35">
            <span>Faktura nr.</span>
            <span>Kunde</span>
            <span>Periode</span>
            <span>Beløb</span>
            <span>Status</span>
          </div>
          {MOCK_INVOICES.map(inv => (
            <div key={inv.id} className="grid grid-cols-5 px-6 py-4 items-center hover:bg-[#fafaf8] transition-colors">
              <span className="font-bold text-sm text-charcoal font-mono">{inv.number}</span>
              <span className="text-sm text-charcoal/70">{inv.client}</span>
              <span className="text-sm text-charcoal/55">{inv.period}</span>
              <span className="font-bold text-sm text-charcoal">{inv.amount}</span>
              <div className="flex items-center gap-3">
                <StatusBadge status={inv.status as any} />
                <button className="text-orange text-xs font-bold hover:underline">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
