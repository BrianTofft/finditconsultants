import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTranslations } from "next-intl";

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as TestimonialItem[];
  const [featured, ...rest] = items;

  const STATS = [
    { val: "3", unit: t("statDaysUnit"),    label: t("statDays") },
    { val: "6", unit: t("statProfilesUnit"), label: t("statProfiles") },
    { val: "1", unit: t("statMatchUnit"),   label: t("statMatch") },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={<>{t("title")} <span className="text-orange italic">{t("titleHighlight")}</span></>}
            sub={t("sub")}
            center
          />
        </RevealOnScroll>

        {/* Fremhævet stort testimonial */}
        <RevealOnScroll>
          <div className="relative bg-charcoal rounded-3xl p-8 md:p-12 mb-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange/0 via-orange to-orange/0" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="font-serif text-6xl text-orange/50 leading-none mb-4">&quot;</div>
                <p className="text-white/85 text-lg md:text-xl leading-relaxed italic mb-6 max-w-2xl">
                  {featured.quote}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-orange text-lg tracking-wider">★★★★★</span>
                  <span className="text-white/30 text-sm ml-2 self-center">{t("verified")}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-sm font-black text-white border-2 border-white/20">
                    {featured.initials}
                  </div>
                  <div>
                    <div className="text-white font-bold">{featured.name}</div>
                    <div className="text-white/50 text-sm">{featured.role} · {featured.company}</div>
                  </div>
                </div>
              </div>
              {/* Stats på siden */}
              <div className="flex flex-row md:flex-col gap-4 md:gap-6 flex-shrink-0">
                {STATS.map(s => (
                  <div key={s.label} className="bg-white/8 border border-white/10 rounded-2xl p-4 text-center min-w-[100px]">
                    <span className="font-bold text-2xl text-orange">{s.val}</span>
                    <span className="text-white/50 text-xs ml-1">{s.unit}</span>
                    <div className="text-white/35 text-[10px] mt-1 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Øvrige testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {rest.map((item, i) => (
            <RevealOnScroll key={item.name} delay={i * 60}>
              <div className="bg-white rounded-2xl p-5 border border-[#ede9e3] hover:border-orange/25 hover:shadow-md transition-all h-full flex flex-col">
                <div className="text-orange/40 text-2xl font-serif leading-none mb-2">&quot;</div>
                <p className="text-charcoal/60 text-xs leading-relaxed flex-1 mb-4">{item.quote}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <div className="w-8 h-8 rounded-full bg-orange/10 text-orange flex items-center justify-center text-xs font-black flex-shrink-0">{item.initials}</div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-charcoal truncate">{item.name}</div>
                    <div className="text-charcoal/40 text-[10px] truncate">{item.role} · {item.company}</div>
                  </div>
                  <span className="ml-auto text-orange text-[10px] flex-shrink-0">★★★★★</span>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
