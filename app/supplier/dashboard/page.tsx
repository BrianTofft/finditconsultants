"use client";
import Link from "next/link";
import PortalLayout from "@/components/portal/PortalLayout";
import StatusBadge from "@/components/portal/StatusBadge";
import { MOCK_SUPPLIER, MOCK_SUPPLIER_REQUESTS, MOCK_OFFERS } from "@/app/portal-mock-data";

const NAV = [
  { href: "/supplier/dashboard", label: "Overblik",        icon: "🏠" },
  { href: "/supplier/requests",  label: "Forespørgsler",   icon: "📋", badge: 2 },
  { href: "/supplier/offers",    label: "Mine tilbud",     icon: "📤" },
  { href: "/supplier/messages",  label: "Beskeder",        icon: "💬", badge: 1 },
  { href: "/supplier/billing",   label: "Fakturering",     icon: "💰" },
];

export default function SupplierDashboard() {
  const openRequests = MOCK_SUPPLIER_REQUESTS.filter(r => r.status === "open");
  const pendingOffers = MOCK_OFFERS.filter(o => o.status === "pending");
  const acceptedOffers = MOCK_OFFERS.filter(o => o.status === "accepted");

  return (
    <PortalLayout user={MOCK_SUPPLIER} navItems={NAV} portalType="supplier">
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-charcoal">Godmorgen, {MOCK_SUPPLIER.name.split(" ")[0]} 👋</h1>
        <p className="text-charcoal/50 text-sm mt-1">Her er et overblik over dine aktive muligheder</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Åbne forespørgsler", value: openRequests.length, icon: "📋", color: "text-blue-600" },
          { label: "Afventende tilbud",  value: pendingOffers.length, icon: "📤", color: "text-orange" },
          { label: "Accepterede tilbud", value: acceptedOffers.length, icon: "✅", color: "text-green-600" },
          { label: "Aktive kontrakter",  value: 1, icon: "📄", color: "text-purple-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#ede9e3] shadow-sm">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`font-black text-3xl ${s.color} leading-none mb-1`}>{s.value}</div>
            <div className="text-charcoal/50 text-xs font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open requests */}
        <div className="bg-white rounded-2xl border border-[#ede9e3] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#ede9e3] flex items-center justify-between">
            <h2 className="font-bold text-charcoal">Nye forespørgsler</h2>
            <Link href="/supplier/requests" className="text-orange text-sm font-bold hover:underline">Se alle →</Link>
          </div>
          <div className="divide-y divide-[#f0ede8]">
            {openRequests.map(req => (
              <Link key={req.id} href={`/supplier/requests/${req.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#fafaf8] transition-colors group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-charcoal group-hover:text-orange transition-colors">{req.title}</span>
                    <StatusBadge status={req.status as any} />
                  </div>
                  <div className="text-xs text-charcoal/45">{req.location} · {req.workForm} · {req.duration}</div>
                  <div className="text-xs text-orange font-semibold mt-1">Deadline: {req.deadline}</div>
                </div>
                <span className="text-charcoal/25 group-hover:text-orange transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* My offers */}
        <div className="bg-white rounded-2xl border border-[#ede9e3] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#ede9e3] flex items-center justify-between">
            <h2 className="font-bold text-charcoal">Mine tilbud</h2>
            <Link href="/supplier/offers" className="text-orange text-sm font-bold hover:underline">Se alle →</Link>
          </div>
          <div className="divide-y divide-[#f0ede8]">
            {MOCK_OFFERS.map(offer => (
              <div key={offer.id} className="flex items-center gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-charcoal">{offer.title}</span>
                    <StatusBadge status={offer.status} />
                  </div>
                  <div className="text-xs text-charcoal/45">{offer.candidateName} · {offer.rate}</div>
                  <div className="text-xs text-charcoal/30 mt-0.5">Indsendt {offer.submittedAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
