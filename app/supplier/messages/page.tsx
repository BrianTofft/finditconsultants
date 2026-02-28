"use client";
import { useState } from "react";
import PortalLayout from "@/components/portal/PortalLayout";
import { MOCK_SUPPLIER } from "@/app/portal-mock-data";

const NAV = [
  { href: "/supplier/dashboard", label: "Overblik",      icon: "🏠" },
  { href: "/supplier/requests",  label: "Forespørgsler", icon: "📋", badge: 2 },
  { href: "/supplier/offers",    label: "Mine tilbud",   icon: "📤" },
  { href: "/supplier/messages",  label: "Beskeder",      icon: "💬", badge: 1 },
  { href: "/supplier/billing",   label: "Fakturering",   icon: "💰" },
];

const INITIAL_MSGS = [
  { id: "1", from: "FindITconsultants.com Teamet", initials: "LOGO", text: "Hej Mette! Vi har modtaget dit tilbud på Senior Azure-arkitekten. Kunden kigger på det nu og vi forventer svar inden for 2 arbejdsdage.", time: "I dag 08:30", isOwn: false },
  { id: "2", from: "FindITconsultants.com Teamet", initials: "LOGO", text: "Har I mulighed for at sende et opdateret CV for Mette Paulsen? Kunden efterspørger detaljer om Azure-certifikationer.", time: "I dag 11:15", isOwn: false },
];

export default function SupplierMessages() {
  const [messages, setMessages] = useState(INITIAL_MSGS);
  const [newMsg, setNewMsg] = useState("");

  const send = () => {
    if (!newMsg.trim()) return;
    setMessages(prev => [...prev, { id: `${Date.now()}`, from: MOCK_SUPPLIER.name, initials: MOCK_SUPPLIER.initials, text: newMsg, time: "Lige nu", isOwn: true }]);
    setNewMsg("");
  };

  return (
    <PortalLayout user={MOCK_SUPPLIER} navItems={NAV} portalType="supplier">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-charcoal">Beskeder</h1>
        <p className="text-charcoal/50 text-sm mt-1">Direkte kommunikation med FindITconsultants.com Teamet</p>
      </div>
      <div className="bg-white rounded-2xl border border-[#ede9e3] flex flex-col overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
        <div className="px-6 py-4 border-b border-[#f0ede8] flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2d2c2c] flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src="/logo-white.png" alt="FindITconsultants.com" className="w-full h-full object-contain p-1.5" />
          </div>
          <div>
            <div className="font-bold text-charcoal text-sm">FindITconsultants.com Teamet</div>
            <div className="text-xs text-charcoal/40">Generel kommunikation</div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 overflow-hidden ${msg.isOwn ? "bg-gradient-to-br from-orange to-orange-dark text-white" : "bg-[#2d2c2c]"}`}>
                {msg.initials === "LOGO"
                  ? <img src="/logo-white.png" alt="FindITconsultants.com" className="w-full h-full object-contain p-1" />
                  : msg.initials}
              </div>
              <div className={`max-w-[70%] flex flex-col gap-1 ${msg.isOwn ? "items-end" : "items-start"}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.isOwn ? "bg-orange text-white rounded-tr-sm" : "bg-[#f8f6f3] text-charcoal rounded-tl-sm"}`}>{msg.text}</div>
                <span className="text-[10px] text-charcoal/35 px-1">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-4 border-t border-[#f0ede8] flex gap-3">
          <input value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Skriv en besked…"
            className="flex-1 border border-[#e8e5e0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange transition-all bg-[#f8f6f3]" />
          <button onClick={send} className="bg-orange hover:bg-orange-dark text-white font-bold rounded-xl px-5 py-2.5 text-sm transition-colors">Send</button>
        </div>
      </div>
    </PortalLayout>
  );
}
