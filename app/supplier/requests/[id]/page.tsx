"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PortalLayout from "@/components/portal/PortalLayout";
import { MOCK_SUPPLIER, MOCK_SUPPLIER_REQUESTS } from "@/app/portal-mock-data";

const NAV = [
  { href: "/supplier/dashboard", label: "Overblik",      icon: "🏠" },
  { href: "/supplier/requests",  label: "Forespørgsler", icon: "📋", badge: 2 },
  { href: "/supplier/offers",    label: "Mine tilbud",   icon: "📤" },
  { href: "/supplier/messages",  label: "Beskeder",      icon: "💬", badge: 1 },
  { href: "/supplier/billing",   label: "Fakturering",   icon: "💰" },
];

export default function SubmitOffer() {
  const { id } = useParams();
  const router = useRouter();
  const req = MOCK_SUPPLIER_REQUESTS.find(r => r.id === id);
  const [submitted, setSubmitted] = useState(false);

  if (!req) return <div className="p-8">Ikke fundet</div>;

  if (submitted) return (
    <PortalLayout user={MOCK_SUPPLIER} navItems={NAV} portalType="supplier">
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="font-bold text-2xl text-charcoal mb-2">Tilbud indsendt!</h2>
        <p className="text-charcoal/55 mb-8">Dit tilbud er modtaget af FindITconsultants.com Teamet. Vi vender tilbage hurtigst muligt.</p>
        <Link href="/supplier/offers" className="bg-orange text-white font-bold rounded-full px-6 py-3 hover:bg-orange-dark transition-colors">Se mine tilbud →</Link>
      </div>
    </PortalLayout>
  );

  return (
    <PortalLayout user={MOCK_SUPPLIER} navItems={NAV} portalType="supplier">
      <div className="flex items-center gap-2 text-sm text-charcoal/45 mb-6">
        <Link href="/supplier/requests" className="hover:text-orange transition-colors">Forespørgsler</Link>
        <span>/</span>
        <span className="text-charcoal font-semibold">{req.title}</span>
      </div>

      <div className="max-w-2xl">
        {/* Request summary */}
        <div className="bg-[#f8f6f3] rounded-2xl border border-[#e8e5e0] p-6 mb-6">
          <h2 className="font-bold text-charcoal text-lg mb-3">{req.title}</h2>
          <div className="flex flex-wrap gap-5 text-sm text-charcoal/55">
            <span>📍 {req.location}</span>
            <span>💼 {req.workForm} · {req.scope}</span>
            <span>📅 Opstart: {req.startDate}</span>
            <span>⏱ {req.duration}</span>
          </div>
        </div>

        {/* Offer form */}
        <div className="bg-white rounded-2xl border border-[#ede9e3] p-6">
          <h3 className="font-bold text-charcoal text-lg mb-6">Afgiv tilbud</h3>
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
            {[
              { lbl: "Kandidatens navn", ph: "Fulde navn", type: "text" },
              { lbl: "Stilling / titel", ph: "F.eks. Senior Azure-arkitekt", type: "text" },
              { lbl: "Timepris (kr/t ekskl. moms)", ph: "F.eks. 1.150", type: "text" },
              { lbl: "Tilgængelighed fra", ph: "", type: "date" },
            ].map(f => (
              <div key={f.lbl}>
                <label className="block text-xs font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">{f.lbl}</label>
                <input type={f.type} placeholder={f.ph} className="w-full border border-[#e8e5e0] rounded-xl px-4 py-3 text-sm bg-[#f8f6f3] focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">CV / Kandidatprofil</label>
              <label className="flex items-center gap-3 border border-dashed border-[#d4cfc8] rounded-xl px-4 py-3 cursor-pointer hover:border-orange hover:bg-orange-light transition-all bg-[#f8f6f3]">
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                <span>📎</span>
                <div>
                  <div className="text-sm font-bold text-charcoal">Upload CV</div>
                  <div className="text-xs text-charcoal/40">PDF eller Word — maks 10 MB</div>
                </div>
              </label>
            </div>
            <div>
              <label className="block text-xs font-extrabold tracking-widest uppercase text-charcoal/45 mb-1.5">Kommentar (valgfrit)</label>
              <textarea rows={3} placeholder="Evt. yderligere information om kandidaten…" className="w-full border border-[#e8e5e0] rounded-xl px-4 py-3 text-sm bg-[#f8f6f3] focus:outline-none focus:border-orange focus:ring-2 focus:ring-orange/20 transition-all resize-none" />
            </div>
            <button type="submit" className="w-full bg-orange hover:bg-orange-dark text-white font-bold rounded-full py-3.5 transition-colors">
              Send tilbud →
            </button>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}
