"use client";
import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTranslations } from "next-intl";

export default function FAQ() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  const BADGES = [
    { icon: "🔒", label: t("badge0") },
    { icon: "🆓", label: t("badge1") },
    { icon: "🤝", label: t("badge2") },
    { icon: "⚡", label: t("badge3") },
  ];

  return (
    <section id="faq" className="py-24 bg-[#f8f6f3]">
      <div className="max-w-3xl mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={<>{t("title")} <span className="text-orange italic">{t("titleHighlight")}</span></>}
            sub={t("sub")}
            center
          />
        </RevealOnScroll>

        <div className="space-y-3">
          {items.map((faq, i) => (
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
            {BADGES.map(b => (
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
