import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export default function CTA() {
  const t = useTranslations("cta");

  const BADGES = [t("badge0"), t("badge1"), t("badge2"), t("badge3")];
  const STATS = [
    { val: t("stat0Val"), lbl: t("stat0Lbl") },
    { val: t("stat1Val"), lbl: t("stat1Lbl") },
    { val: t("stat2Val"), lbl: t("stat2Lbl") },
    { val: t("stat3Val"), lbl: t("stat3Lbl") },
  ];

  return (
    <section className="relative py-28 text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&fit=crop" alt="" loading="lazy" className="w-full h-full object-cover brightness-[0.25] saturate-50" />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-charcoal/80 via-charcoal/60 to-charcoal/90" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-orange/12 blur-3xl rounded-full z-[1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange/5 blur-3xl rounded-full z-[1]" />

      <RevealOnScroll className="relative z-10 max-w-2xl mx-auto px-6">
        <div className="inline-flex items-center gap-3 mb-8">
          <span className="w-8 h-px bg-orange/60" />
          <span className="text-xs font-extrabold tracking-widest uppercase text-orange">{t("eyebrow")}</span>
          <span className="w-8 h-px bg-orange/60" />
        </div>
        <h2 className="font-bold text-4xl md:text-5xl text-white leading-tight tracking-tight mb-5">
          {t("title")} <span className="text-orange italic">{t("titleHighlight")}</span>
        </h2>
        <p className="text-white/55 text-lg leading-relaxed mb-4">
          {t("desc")}
        </p>
        <p className="text-white/35 text-sm mb-10 font-medium">
          {t("social")} <span className="text-orange font-bold">{t("socialHighlight")}</span> {t("socialSuffix")}
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <Button href="#hero-form" size="lg">{t("findConsultants")}</Button>
          <Button href="#partners" variant="ghost-dark" size="lg">{t("becomeSupplier")}</Button>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {BADGES.map(b => (
            <span key={b} className="bg-white/8 border border-white/12 rounded-full px-4 py-1.5 text-xs font-bold text-white/60">{b}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-6 justify-center items-center pt-8 border-t border-white/10">
          {STATS.map(({ val, lbl }, i, arr) => (
            <div key={lbl} className="flex items-center gap-6">
              <div className="text-center">
                <div className="font-bold text-3xl text-orange">{val}</div>
                <div className="text-white/40 text-xs font-semibold mt-0.5">{lbl}</div>
              </div>
              {i < arr.length - 1 && <div className="w-px h-8 bg-white/10" />}
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
