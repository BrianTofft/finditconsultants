"use client";
import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";

const LOCALES = [
  { code: "da", label: "Dansk" },
  { code: "en", label: "English" },
  { code: "no", label: "Norsk" },
  { code: "sv", label: "Svenska" },
] as const;

export default function LocaleSwitcher() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-white/50 hover:text-white/90 transition-colors p-1.5 rounded-lg hover:bg-white/8"
        aria-label="Skift sprog"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span className="text-xs font-bold uppercase">{locale}</span>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="M6 8L1 3h10z"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 min-w-[130px]">
          {LOCALES.map(({ code, label }) => (
            <a
              key={code}
              href={`/${code}/`}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                locale === code
                  ? "text-orange bg-orange/8 font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/6"
              }`}
            >
              {label}
              {locale === code && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6l3 3 5-5"/>
                </svg>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
