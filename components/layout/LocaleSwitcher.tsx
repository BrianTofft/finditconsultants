"use client";
import { useLocale } from "next-intl";

const LOCALES = [
  { code: "da", label: "DA" },
  { code: "en", label: "EN" },
  { code: "no", label: "NO" },
  { code: "sv", label: "SV" },
] as const;

export default function LocaleSwitcher() {
  const locale = useLocale();

  return (
    <div className="flex items-center gap-0.5">
      {LOCALES.map(({ code, label }) => (
        <a
          key={code}
          href={`/${code}/`}
          className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
            locale === code
              ? "text-orange"
              : "text-white/40 hover:text-white/80"
          }`}
        >
          {label}
        </a>
      ))}
    </div>
  );
}
