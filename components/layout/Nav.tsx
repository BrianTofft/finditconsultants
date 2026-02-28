"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const LINKS = [
  { href: "#how",      label: "Sådan virker det" },
  { href: "#services", label: "Kompetencer" },
  { href: "#why",      label: "Derfor os" },
  { href: "#partners", label: "Bliv leverandør" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <>
      <div className="bg-orange text-white text-xs font-bold py-2 text-center">
        <a href="tel:+4528340907" className="hover:underline">📞 +45 2834 0907</a>
        {" · "}
        <a href="mailto:hej@finditconsultants.com" className="hover:underline">hej@finditconsultants.com</a>
        {" · "} Man–Fre 08:00–16:00
      </div>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#2d2c2c]/95 backdrop-blur-md shadow-xl" : "bg-[#2d2c2c]"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <img src="/logo-white.png" alt="FindITconsultants.com" className="w-64 h-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map(l => (
              <a key={l.href} href={l.href} className="text-white/70 hover:text-white text-sm font-semibold transition-colors">{l.label}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <button className="text-white/60 hover:text-white text-sm font-semibold transition-colors flex items-center gap-1">
                Log ind
                <svg className="w-3 h-3 mt-0.5" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#ede9e3] overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/portal/login" className="flex items-center gap-3 px-4 py-3 hover:bg-orange-light transition-colors border-b border-[#f0ede8]">
                  <span className="text-lg">🏢</span>
                  <div>
                    <div className="font-bold text-charcoal text-sm">Kundeportal</div>
                    <div className="text-xs text-charcoal/45">Se dine kandidater</div>
                  </div>
                </Link>
                <Link href="/supplier/login" className="flex items-center gap-3 px-4 py-3 hover:bg-orange-light transition-colors">
                  <span className="text-lg">🤝</span>
                  <div>
                    <div className="font-bold text-charcoal text-sm">Leverandørportal</div>
                    <div className="text-xs text-charcoal/45">Afgiv tilbud</div>
                  </div>
                </Link>
              </div>
            </div>
            <Button href="#hero-form" size="sm">Find konsulenter →</Button>
          </div>
          <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
            <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${open ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-white transition-all ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
        {open && (
          <div className="md:hidden bg-[#232222] border-t border-white/10 px-6 py-4 space-y-3">
            {LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-white/80 hover:text-white text-sm font-semibold py-2">{l.label}</a>
            ))}
            <div className="border-t border-white/10 pt-3 space-y-2">
              <Link href="/portal/login" onClick={() => setOpen(false)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold py-2">🏢 Kundeportal</Link>
              <Link href="/supplier/login" onClick={() => setOpen(false)} className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold py-2">🤝 Leverandørportal</Link>
            </div>
            <Button href="#hero-form" full onClick={() => setOpen(false)}>Find IT-konsulenter →</Button>
          </div>
        )}
      </nav>
    </>
  );
}
