import { useTranslations } from "next-intl";

export default function Services() {
  const t = useTranslations("services");
  const items = t.raw("items") as { icon: string; title: string; desc: string; slug: string }[];

  return (
    <section id="services" className="py-24 bg-[#f8f6f3]">
      <div className="max-w-7xl mx-auto px-6">
        <RevealOnScroll>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={<>{t("title")} <span className="text-orange italic">{t("titleHighlight")}</span></>}
            sub={t("sub")}
            center
          />
        </RevealOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((s, i) => {
            const href = s.slug ? `/konsulenter/${s.slug}` : null;
            const inner = (
              <div className="group bg-white rounded-2xl p-5 border border-[#ede9e3] hover:border-orange/35 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 h-full overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                <div className="w-10 h-10 rounded-xl bg-orange-light flex items-center justify-center text-lg mb-3 group-hover:bg-orange transition-colors duration-300">{s.icon}</div>
                <h3 className="font-bold text-charcoal text-sm mb-1.5 group-hover:text-orange transition-colors">{s.title}</h3>
                <p className="text-charcoal/50 text-xs leading-relaxed">{s.desc}</p>
                {href && <div className="text-orange text-xs font-bold mt-3 opacity-0 group-hover:opacity-100 transition-opacity">{t("readMore")}</div>}
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
