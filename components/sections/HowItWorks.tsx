import SectionHeader from "@/components/ui/SectionHeader";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { useTranslations } from "next-intl";

/* ── Datamodel ─────────────────────────────────────────────── */
type LaneStep = { icon: string; text: string } | null;

type Phase = {
  n: string;
  title: string;
  kunde:      LaneStep;
  findit:     LaneStep;
  leverandor: LaneStep;
  flow?: string;
};

/* Lane-konfiguration */
const LANE_CONFIG = [
  {
    key: "kunde"      as const,
    emoji: "🏢",
    headerBg:   "bg-orange border-orange",
    headerText: "text-white",
    cellBg:     "bg-orange/20 border-orange/40",
    dot:        "bg-orange",
    legendText: "text-orange",
  },
  {
    key: "findit"     as const,
    label: "FindITconsultants",
    emoji: "⚡",
    headerBg:   "bg-charcoal border-charcoal",
    headerText: "text-white",
    cellBg:     "bg-charcoal/10 border-charcoal/30",
    dot:        "bg-charcoal",
    legendText: "text-charcoal",
  },
  {
    key: "leverandor" as const,
    emoji: "👥",
    headerBg:   "bg-[#4a7c59] border-[#4a7c59]",
    headerText: "text-white",
    cellBg:     "bg-[#4a7c59]/20 border-[#4a7c59]/40",
    dot:        "bg-[#4a7c59]",
    legendText: "text-[#4a7c59]",
  },
] as const;

/* ── Sub-komponenter ────────────────────────────────────────── */
function LaneCell({ step, lane }: { step: LaneStep; lane: typeof LANE_CONFIG[number] }) {
  if (!step) {
    return (
      <div className="flex justify-center items-stretch py-2">
        <div className="border-l-2 border-dashed border-charcoal/10 w-px mx-auto" />
      </div>
    );
  }
  return (
    <div className={`rounded-xl p-3.5 border ${lane.cellBg} flex items-start gap-2.5 h-full`}>
      <span className="text-xl leading-none flex-shrink-0 mt-0.5">{step.icon}</span>
      <p className="text-xs text-charcoal/70 leading-relaxed">{step.text}</p>
    </div>
  );
}

function FlowArrow({ flow, phase, lanes }: { flow?: string; phase: Phase; lanes: typeof LANE_CONFIG }) {
  if (!flow) return null;
  const active = lanes.filter(l => !!phase[l.key]);
  if (active.length < 2) return null;
  const label =
    flow === "↔"
      ? `${active[0].label ?? active[0].key} ↔ ${active[active.length - 1].label ?? active[active.length - 1].key}`
      : flow === "→"
      ? `${active[0].label ?? active[0].key} → ${active[active.length - 1].label ?? active[active.length - 1].key}`
      : `${active[active.length - 1].label ?? active[active.length - 1].key} → ${active[0].label ?? active[0].key}`;
  return (
    <div className="flex items-center justify-center col-span-3 -mt-1 mb-1 pointer-events-none select-none">
      <span className="text-[10px] font-bold text-charcoal/30 tracking-wide uppercase">{label}</span>
    </div>
  );
}

/* ── Hoved-komponent ────────────────────────────────────────── */
export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const LANES = LANE_CONFIG.map(l => ({
    ...l,
    label: l.key === "findit" ? "FindITconsultants" : l.key === "kunde" ? t("laneCustomer") : t("laneSupplier"),
  }));

  const PHASES: Phase[] = [
    {
      n: "01", title: t("phase01Title"), flow: "→",
      kunde:      { icon: "📋", text: t("phase01Customer") },
      findit:     null,
      leverandor: null,
    },
    {
      n: "02", title: t("phase02Title"), flow: "→",
      kunde:      null,
      findit:     { icon: "📡", text: t("phase02Findit") },
      leverandor: { icon: "📩", text: t("phase02Supplier") },
    },
    {
      n: "03", title: t("phase03Title"), flow: "←",
      kunde:      null,
      findit:     { icon: "🔍", text: t("phase03Findit") },
      leverandor: { icon: "👤", text: t("phase03Supplier") },
    },
    {
      n: "04", title: t("phase04Title"), flow: "←",
      kunde:      { icon: "✅", text: t("phase04Customer") },
      findit:     { icon: "📤", text: t("phase04Findit") },
      leverandor: { icon: "📅", text: t("phase04Supplier") },
    },
    {
      n: "05", title: t("phase05Title"), flow: "↔",
      kunde:      { icon: "🤝", text: t("phase05Customer") },
      findit:     null,
      leverandor: { icon: "📄", text: t("phase05Supplier") },
    },
  ];

  return (
    <section id="how" className="py-24 bg-[#f8f6f3]">
      <div className="max-w-6xl mx-auto px-6">

        <RevealOnScroll>
          <SectionHeader
            eyebrow={t("eyebrow")}
            title={<>{t("title")} <span className="text-orange italic">{t("titleHighlight")}</span></>}
            sub={t("sub")}
            center
          />
        </RevealOnScroll>

        {/* ── Swimlane diagram ── */}
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="min-w-[620px]">

            {/* Lane-headers */}
            <RevealOnScroll>
              <div className="grid grid-cols-[56px_1fr_1fr_1fr] gap-2 mb-4">
                <div /> {/* fase-kolonnen */}
                {LANES.map(lane => (
                  <div
                    key={lane.key}
                    className={`rounded-xl px-3 py-2.5 text-center border ${lane.headerBg}`}
                  >
                    <span className="text-lg">{lane.emoji}</span>
                    <p className={`font-extrabold text-xs mt-0.5 ${lane.headerText}`}>{lane.label}</p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>

            {/* Fase-rækker */}
            {PHASES.map((phase, i) => (
              <RevealOnScroll key={phase.n} delay={i * 80}>
                <div className="relative mb-2">

                  {/* Fase-header (nummer + titel) */}
                  <div className="grid grid-cols-[56px_1fr_1fr_1fr] gap-2 mb-1.5 items-center">
                    <div className="flex justify-center">
                      <div className="w-9 h-9 rounded-full bg-orange text-white flex items-center justify-center font-extrabold text-xs shadow-sm z-10 relative">
                        {phase.n}
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                      <h3 className="font-bold text-charcoal text-sm">{phase.title}</h3>
                      {phase.flow && (
                        <FlowArrow flow={phase.flow} phase={phase} lanes={LANES} />
                      )}
                    </div>
                  </div>

                  {/* Celle-indhold */}
                  <div className="grid grid-cols-[56px_1fr_1fr_1fr] gap-2 items-stretch">
                    {/* Vertikal forbindelseslinje */}
                    <div className="flex justify-center">
                      {i < PHASES.length - 1 ? (
                        <div className="border-l-2 border-dashed border-orange/30 h-full mt-1" />
                      ) : (
                        <div className="w-px bg-orange/20 h-4 mt-1 mx-auto rounded-full" />
                      )}
                    </div>
                    {LANES.map(lane => (
                      <LaneCell key={lane.key} step={phase[lane.key]} lane={lane} />
                    ))}
                  </div>

                </div>
              </RevealOnScroll>
            ))}

          </div>
        </div>

        {/* Legende */}
        <RevealOnScroll delay={100}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
            {LANES.map(lane => (
              <div key={lane.key} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${lane.dot}`} />
                <span className={`text-xs font-bold opacity-70 ${lane.legendText}`}>{lane.label}</span>
              </div>
            ))}
            <span className="text-charcoal/25 text-xs">· · ·</span>
            <span className="text-xs text-charcoal/40">{t("noBinding")}</span>
          </div>
        </RevealOnScroll>

        {/* CTA */}
        <RevealOnScroll delay={150}>
          <div className="mt-10 text-center">
            <a
              href="#hero-form"
              className="inline-flex items-center gap-2 bg-orange text-white font-bold rounded-full px-8 py-4 text-base hover:bg-orange-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              {t("cta")}
            </a>
            <p className="text-charcoal/40 text-xs mt-3">{t("ctaSub")}</p>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
