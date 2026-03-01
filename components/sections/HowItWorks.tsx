import SectionHeader from "@/components/ui/SectionHeader";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

/* ── Datamodel ─────────────────────────────────────────────── */
type LaneStep = { icon: string; text: string } | null;

type Phase = {
  n: string;
  title: string;
  kunde:      LaneStep;
  findit:     LaneStep;
  leverandor: LaneStep;
  /** "→" = venstre→højre, "←" = højre→venstre, "↔" = direkte */
  flow?: string;
};

const PHASES: Phase[] = [
  {
    n: "01", title: "Beskriv behovet", flow: "→",
    kunde:      { icon: "📋", text: "Udfylder formularen med kompetencer, tidslinje, arbejdsform og budget. Under 3 minutter." },
    findit:     null,
    leverandor: null,
  },
  {
    n: "02", title: "Vi aktiverer markedet", flow: "→",
    kunde:      null,
    findit:     { icon: "📡", text: "Godkender forespørgslen og notificerer øjeblikkeligt 70+ leverandører og freelancenetværk." },
    leverandor: { icon: "📩", text: "Modtager notifikation med opgavebeskrivelse og kompetencekrav." },
  },
  {
    n: "03", title: "Profiler screenes", flow: "←",
    kunde:      null,
    findit:     { icon: "🔍", text: "Screener og godkender indsendte profiler. Irrelevante forslag sorteres fra." },
    leverandor: { icon: "👤", text: "Indsender relevante konsulentprofiler med pris, CV og tilgængelighed." },
  },
  {
    n: "04", title: "Du vælger frit", flow: "←",
    kunde:      { icon: "✅", text: "Modtager 4–9 screenede profiler i kundeportalen og anmoder om interview." },
    findit:     { icon: "📤", text: "Præsenterer godkendte profiler og koordinerer interviewtidspunkter." },
    leverandor: { icon: "📅", text: "Bekræfter interviewtidspunkt via leverandørportalen." },
  },
  {
    n: "05", title: "Direkte kontrakt", flow: "↔",
    kunde:      { icon: "🤝", text: "Indgår kontrakten direkte med den valgte leverandør. Ingen mellemled, intet gebyr." },
    findit:     null,
    leverandor: { icon: "📄", text: "Underskriver kontrakt direkte med kunden. FindIT er ikke part i aftalen." },
  },
];

/* Lane-konfiguration */
const LANES = [
  {
    key: "kunde"      as const,
    label: "Kunde",
    emoji: "🏢",
    headerBg:  "bg-orange/10 border-orange/30",
    headerText:"text-orange",
    cellBg:    "bg-orange/5 border-orange/20",
    dot:       "bg-orange",
    activeDot: "bg-orange",
  },
  {
    key: "findit"     as const,
    label: "FindIT",
    emoji: "⚡",
    headerBg:  "bg-charcoal/8 border-charcoal/20",
    headerText:"text-charcoal",
    cellBg:    "bg-charcoal/4 border-charcoal/10",
    dot:       "bg-charcoal",
    activeDot: "bg-charcoal",
  },
  {
    key: "leverandor" as const,
    label: "Leverandør",
    emoji: "👥",
    headerBg:  "bg-[#4a7c59]/10 border-[#4a7c59]/30",
    headerText:"text-[#4a7c59]",
    cellBg:    "bg-[#4a7c59]/5 border-[#4a7c59]/20",
    dot:       "bg-[#4a7c59]",
    activeDot: "bg-[#4a7c59]",
  },
] as const;

/* ── Sub-komponenter ────────────────────────────────────────── */
function LaneCell({ step, lane }: { step: LaneStep; lane: typeof LANES[number] }) {
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

function FlowArrow({ flow, phase }: { flow?: string; phase: Phase }) {
  if (!flow) return null;

  /* Afgør hvilke baner der er aktive for at tegne den rigtige pil */
  const active = LANES.filter(l => !!phase[l.key]);
  if (active.length < 2) return null;

  const label =
    flow === "↔"
      ? `${active[0].label} ↔ ${active[active.length - 1].label}`
      : flow === "→"
      ? `${active[0].label} → ${active[active.length - 1].label}`
      : `${active[active.length - 1].label} → ${active[0].label}`;

  return (
    <div className="flex items-center justify-center col-span-3 -mt-1 mb-1 pointer-events-none select-none">
      <span className="text-[10px] font-bold text-charcoal/30 tracking-wide uppercase">{label}</span>
    </div>
  );
}

/* ── Hoved-komponent ────────────────────────────────────────── */
export default function HowItWorks() {
  return (
    <section id="how" className="py-24 bg-[#f8f6f3]">
      <div className="max-w-6xl mx-auto px-6">

        <RevealOnScroll>
          <SectionHeader
            eyebrow="Sådan fungerer det"
            title={<>Fra behov til kontrakt — <span className="text-orange italic">3 parter, 5 faser</span></>}
            sub="FindIT koordinerer processen mellem dig, vores leverandørnetværk og konsulenterne — du vælger frit og indgår aftalen direkte."
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
                        <FlowArrow flow={phase.flow} phase={phase} />
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
                <span className={`text-xs font-bold opacity-70 ${lane.headerText}`}>{lane.label}</span>
              </div>
            ))}
            <span className="text-charcoal/25 text-xs">· · ·</span>
            <span className="text-xs text-charcoal/40">Ingen binding · Ingen gebyr fra kunden</span>
          </div>
        </RevealOnScroll>

        {/* CTA */}
        <RevealOnScroll delay={150}>
          <div className="mt-10 text-center">
            <a
              href="#hero-form"
              className="inline-flex items-center gap-2 bg-orange text-white font-bold rounded-full px-8 py-4 text-base hover:bg-orange-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Kom i gang — det er gratis →
            </a>
            <p className="text-charcoal/40 text-xs mt-3">Svar inden for 3 arbejdsdage</p>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
