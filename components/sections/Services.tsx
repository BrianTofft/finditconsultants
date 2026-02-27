import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";
import { SERVICES } from "@/app/data";

const SERVICE_LINKS: Record<string, string> = {
  "AI & Automation":              "/konsulenter/ai",
  "Microsoft-teknologi":          "/konsulenter/azure",
  "Cloud-løsninger":              "/konsulenter/azure",
  "Data & BI":                    "/konsulenter/power-bi",
  "Projekt- & forandringsledelse":"/konsulenter/it-projektleder",
  "Nearshore - Offshore":         "/konsulenter/nearshore",
  "Integration":                  "/konsulenter/sharepoint",
};
export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#f8f6f3]">
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll><SectionHeader eyebrow="Kompetenceområder" title={<>Alle IT-discipliner — <span className="text-orange italic">ét kontaktpunkt</span></>} sub="Fra AI-specialister til projektledere og cloud-arkitekter — vi finder det rigtige match på tværs af hele markedet." center /></RevealOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SERVICES.map((s, i) => {
            const href = SERVICE_LINKS[s.title];
            const inner = (
              <div className="group bg-white rounded-2xl p-5 border border-[#ede9e3] hover:border-orange/35 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-full overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="w-10 h-10 rounded-xl bg-orange-light flex items-center justify-center text-lg mb-3 group-hover:bg-orange transition-colors duration-300">{s.icon}</div>
                <h3 className="font-bold text-charcoal text-sm mb-1.5 group-hover:text-orange transition-colors">{s.title}</h3>
                <p className="text-charcoal/50 text-xs leading-relaxed">{s.desc}</p>
                {href && <div className="text-orange text-xs font-bold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">Læs mere →</div>}
              </div>
            );
            return (
              <RevealOnScroll key={s.title} delay={i * 35}>
                {href ? (
                  <Link href={href} className="block h-full">{inner}</Link>
                ) : (
                  inner
                )}
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
