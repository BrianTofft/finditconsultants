import Link from "next/link";
import { CONTACT } from "@/app/data";

export default function Footer() {
  return (
    <footer className="bg-[#1a1919] text-white/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <img src="/logo-white.png" alt="FindITconsultants.com" className="w-56 h-auto mb-4" />
            <p className="text-sm leading-relaxed mb-6 max-w-xs">Gratis og uforpligtende multi-sourcing service. Vi aktiverer 70+ leverandører og finder dit næste IT-match.</p>
            <div className="space-y-2 text-sm">
              <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 hover:text-white transition-colors"><span>📞</span>{CONTACT.phone}</a>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-white transition-colors"><span>✉️</span>{CONTACT.email}</a>
              <p className="flex items-center gap-2"><span>📍</span>{CONTACT.address}</p>
              <p className="flex items-center gap-2"><span>🕐</span>{CONTACT.hours}</p>
            </div>
          </div>
          <div>
            <div className="text-white font-extrabold text-xs tracking-widest uppercase mb-4">Kompetencer</div>
            <ul className="space-y-2 text-sm">
              {["AI & Automation","Cloud-løsninger","Cybersecurity","Microsoft-teknologi","Data & BI","Softwareudvikling"].map(s => (
                <li key={s}><a href="#services" className="hover:text-white transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-white font-extrabold text-xs tracking-widest uppercase mb-4">Virksomhed</div>
            <ul className="space-y-2 text-sm">
              {[{label:"Om os",href:"#why"},{label:"Bliv leverandør",href:"#partners"},{label:"Kontakt",href:"#contact"},{label:"Privatlivspolitik",href:"/privacy"},{label:"Cookiepolitik",href:"/cookies"}].map(l => (
                <li key={l.label}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} FindITconsultants.com — Alle rettigheder forbeholdes</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privatlivspolitik</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
