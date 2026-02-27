"use client";
import Link from "next/link";
import PortalLayout from "@/components/portal/PortalLayout";
import StatusBadge from "@/components/portal/StatusBadge";
import { MOCK_SUPPLIER, MOCK_SUPPLIER_REQUESTS } from "@/app/portal-mock-data";

const NAV = [
  { href: "/supplier/dashboard", label: "Overblik",      icon: "🏠" },
  { href: "/supplier/requests",  label: "Forespørgsler", icon: "📋", badge: 2 },
  { href: "/supplier/offers",    label: "Mine tilbud",   icon: "📤" },
  { href: "/supplier/messages",  label: "Beskeder",      icon: "💬", badge: 1 },
  { href: "/supplier/billing",   label: "Fakturering",   icon: "💰" },
];

export default function SupplierRequests() {
  return (
    <PortalLayout user={MOCK_SUPPLIER} navItems={NAV} portalType="supplier">
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-charcoal">Forespørgsler</h1>
        <p className="text-charcoal/50 text-sm mt-1">Aktuelle IT-konsulent søgninger du kan byde ind på</p>
      </div>

      <div className="space-y-4">
        {MOCK_SUPPLIER_REQUESTS.map(req => (
          <div key={req.id} className={`bg-white rounded-2xl border p-6 transition-all ${req.status === "closed" ? "opacity-60 border-[#ede9e3]" : "border-[#ede9e3] hover:border-orange/30 hover:shadow-md"}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="font-bold text-lg text-charcoal">{req.title}</h3>
                  <StatusBadge status={req.status as any} />
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {req.competencies.map(c => (
                    <span key={c} className="bg-orange-light text-orange text-xs font-bold px-2.5 py-1 rounded-full border border-orange/20">{c}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-5 text-sm text-charcoal/50">
                  <span>📍 {req.location}</span>
                  <span>💼 {req.workForm} · {req.scope}</span>
                  <span>📅 Opstart: {req.startDate}</span>
                  <span>⏱ {req.duration}</span>
                  <span>🏢 {req.company}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xs text-charcoal/40">Deadline for tilbud</div>
                  <div className={`font-bold text-sm ${req.status === "closed" ? "text-charcoal/40" : "text-orange"}`}>{req.deadline}</div>
                </div>
                {req.status === "open" ? (
                  <Link href={`/supplier/requests/${req.id}`}
                    className="bg-orange text-white font-bold rounded-full px-5 py-2.5 text-sm hover:bg-orange-dark transition-colors">
                    Afgiv tilbud →
                  </Link>
                ) : (
                  <span className="text-charcoal/40 text-sm font-semibold">Lukket</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
