"use client";
import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionHeader from "@/components/ui/SectionHeader";

const FAQS = [
  {
    q: "Er det virkelig gratis for kunder?",
    a: "Ja — 100% gratis, altid. Vi finansieres af leverandørerne, der betaler et abonnement for adgang til platformen. Du indgår kontrakten direkte med den valgte leverandør, og vi tager aldrig provision eller skjulte gebyrer fra kunden.",
  },
  {
    q: "Hvad sker der, når jeg indsender en forespørgsel?",
    a: "Inden for få minutter kontakter vi relevante leverandører fra vores netværk på 70+. Vi screener alle svar og præsenterer dig for 4–9 kvalificerede kandidater med profiler og timepriser — typisk inden for 3 arbejdsdage.",
  },
  {
    q: "Hvem er leverandørerne i jeres netværk?",
    a: "Vores netværk består af godkendte danske konsulenthuse, konsulentformidlere og freelancenetværk — herunder både nearshore og offshore partnere. Alle leverandører er verificerede og har accepteret vores kvalitetskrav.",
  },
  {
    q: "Er mine oplysninger fortrolige?",
    a: "Ja. Vi deler kun relevante dele af din forespørgsel med udvalgte leverandører, og ingen tredjeparter uden for processen har adgang til dine data. Vi overholder GDPR fuldt ud.",
  },
  {
    q: "Forpligter jeg mig til noget ved at indsende en forespørgsel?",
    a: "Overhovedet ikke. Du vælger selv, om du vil gå videre med én af de præsenterede kandidater. Ingen binding, ingen kontrakt med os — aftalen indgås direkte med leverandøren.",
  },
  {
    q: "Hvad hvis ingen kandidater passer?",
    a: "Vi gentager søgningen eller justerer kriterierne. Vores mål er at finde det rigtige match — ikke bare at sende profiler. Kontakt os, og vi finder en løsning.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-[#f8f6f3]">
      <div className="max-w-3xl mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader
            eyebrow="Ofte stillede spørgsmål"
            title={<>Alt hvad du har brug for at <span className="text-orange italic">vide</span></>}
            sub="Har du et spørgsmål der ikke besvares herunder? Ring til os på +45 2834 0907."
            center
          />
        </RevealOnScroll>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <RevealOnScroll key={i} delay={i * 50}>
              <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${open === i ? "border-orange/30 shadow-md" : "border-[#ede9e3] hover:border-orange/20"}`}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className={`font-bold text-sm transition-colors ${open === i ? "text-orange" : "text-charcoal"}`}>
                    {faq.q}
                  </span>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${open === i ? "bg-orange text-white rotate-45" : "bg-[#f8f6f3] text-charcoal/50"}`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                  </span>
                </button>
                {open === i && (
                  <div className="px-6 pb-5">
                    <div className="h-px bg-[#f0ede8] mb-4" />
                    <p className="text-charcoal/65 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Trust badge */}
        <RevealOnScroll>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-[#ede9e3]">
            {[
              { icon: "🔒", label: "GDPR-compliant" },
              { icon: "🆓", label: "Altid gratis for kunder" },
              { icon: "🤝", label: "Ingen binding" },
              { icon: "⚡", label: "Svar inden 3 dage" },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 text-xs font-bold text-charcoal/50">
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
