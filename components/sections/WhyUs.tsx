import RevealOnScroll from "@/components/ui/RevealOnScroll";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTranslations } from "next-intl";

export default function WhyUs() {
  const t = useTranslations("whyUs");

  const WHY_ITEMS = [
    { icon: t("item0Icon"), title: t("item0Title"), desc: t("item0Desc") },
    { icon: t("item1Icon"), title: t("item1Title"), desc: t("item1Desc") },
    { icon: t("item2Icon"), title: t("item2Title"), desc: t("item2Desc") },
    { icon: t("item3Icon"), title: t("item3Title"), desc: t("item3Desc") },
  ];

  const clients = t("clients").split(" · ");

  return (
    <section id="why" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <RevealOnScroll>
            <SectionHeader
              eyebrow={t("eyebrow")}
              title={<>{t("title")} <span className="text-orange italic">{t("titleHighlight")}</span></>}
              sub={t("sub")}
            />
            <ul className="space-y-6">
              {WHY_ITEMS.map((item, i) => (
                <li key={i} className="flex gap-4 group">
                  <div className="w-11 h-11 rounded-2xl bg-orange-light flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-orange transition-colors duration-300">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-charcoal mb-1">{item.title}</h4>
                    <p className="text-charcoal/55 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
          <RevealOnScroll delay={150}>
            <div className="relative rounded-3xl overflow-hidden shadow-xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=900&q=82&fit=crop" alt="Team i møde" loading="lazy" className="w-full h-[480px] object-cover brightness-75 group-hover:scale-[1.02] transition-all duration-700" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange to-orange-mid" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d2c2c]/95 via-[#2d2c2c]/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="font-serif text-5xl text-orange/60 leading-none mb-3">&quot;</div>
                <p className="text-white/85 text-sm leading-relaxed italic mb-5">{t("quote")}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-xs font-black text-white border-2 border-white/20 flex-shrink-0">LT</div>
                  <div>
                    <div className="text-white font-bold text-sm">{t("quoteAuthor")}</div>
                    <div className="text-white/50 text-xs">{t("quoteRole")}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                  {clients.map(c => (
                    <span key={c} className="bg-white/10 border border-white/12 rounded-lg px-2.5 py-1 text-xs font-bold text-white/55">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
