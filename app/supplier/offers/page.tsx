"use client";
import PortalLayout from "@/components/portal/PortalLayout";
import StatusBadge from "@/components/portal/StatusBadge";
import { MOCK_SUPPLIER, MOCK_OFFERS } from "@/app/portal-mock-data";

const NAV = [
  { href: "/supplier/dashboard", label: "Overblik",      icon: "🏠" },
  { href: "/supplier/requests",  label: "Forespørgsler", icon: "📋", badge: 2 },
  { href: "/supplier/offers",    label: "Mine tilbud",   icon: "📤" },
  { href: "/supplier/messages",  label: "Beskeder",      icon: "💬", badge: 1 },
  { href: "/supplier/billing",   label: "Fakturering",   icon: "💰" },
];

export default function SupplierOffers() {
  const stats = [
    { label: "Afventer svar", value: MOCK_OFFERS.filter(o => o.status === "pending").length, color: "text-orange" },
    { label: "Accepteret",    value: MOCK_OFFERS.filter(o => o.status === "accepted").length, color: "text-green-600" },
    { label: "Afvist",        value: MOCK_OFFERS.filter(o => o.status === "rejected").length, color: "text-red-500" },
    { label: "I alt",         value: MOCK_OFFERS.length, color: "text-charcoal" },
  ];

  return (
    <PortalLayout user={MOCK_SUPPLIER} navItems={NAV} portalType="supplier">
      <div className="mb-8">
        <h1 className="font-bold text-2xl text-charcoal">Mine tilbud</h1>
        <p className="text-charcoal/50 text-sm mt-1">Overblik over alle indsendte kandidattilbud</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#ede9e3] shadow-sm text-center">
            <div className={`font-black text-3xl ${s.color} mb-1`}>{s.value}</div>
            <div className="text-charcoal/50 text-xs font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Offers list */}
      <div className="bg-white rounded-2xl border border-[#ede9e3] overflow-hidden">
        <div className="divide-y divide-[#f0ede8]">
          {MOCK_OFFERS.map(offer => (
            <div key={offer.id} className="flex items-center gap-4 px-6 py-5">
              <div className="w-10 h-10 rounded-xl bg-orange-light flex items-center justify-center text-orange font-black text-sm flex-shrink-0">
                {offer.candidateName.split(" ").map(n => n[0]).join("").slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-bold text-charcoal">{offer.candidateName}</span>
                  <StatusBadge status={offer.status} />
                </div>
                <div className="text-sm text-charcoal/55">{offer.title}</div>
                <div className="text-xs text-charcoal/35 mt-0.5">Indsendt {offer.submittedAt}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bold text-charcoal">{offer.rate}</div>
                <div className="text-xs text-charcoal/40 mt-0.5">ekskl. moms</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
