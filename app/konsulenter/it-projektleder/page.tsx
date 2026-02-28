import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IT projektleder — Gratis multi-sourcing | FindITkonsulenter.dk",
  description:
    "Find den rette IT projektleder gratis. PMP, PRINCE2, Scrum Master og agile coaches via 70+ leverandører. Profiler inden for 3 arbejdsdage.",
  keywords: [
    "IT projektleder",
    "IT projektleder Danmark",
    "projekt manager IT",
    "Scrum Master",
    "agile coach",
    "PRINCE2 konsulent",
    "PMP projektleder",
    "forandringsleder",
    "PMO konsulent",
    "gratis IT projektleder",
  ],
  alternates: { canonical: "https://finditconsultants.com/konsulenter/it-projektleder" },
  openGraph: {
    title: "IT projektleder — Gratis multi-sourcing | FindITkonsulenter.dk",
    description:
      "Find erfarne IT projektledere via 70+ leverandører. PMP, PRINCE2, Scrum Master og agile coaches — gratis og uforpligtende.",
    url: "https://finditconsultants.com/konsulenter/it-projektleder",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IT projektleder — Gratis multi-sourcing",
    description: "Find IT projektledere via 70+ leverandører — gratis, uforpligtende, inden for 3 dage.",
  },
};

export default function ITProjektlederPage() {
  return (
    <ConsultantPage
      title="IT projektleder"
      eyebrow="Projekt- & forandringsledelse"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">IT projektledere</span></>}
      intro="Find en erfaren IT projektleder til at styre dit næste projekt sikkert i mål — via 70+ leverandører og freelancenetværk."
      price="900 – 1.800 kr/t"
      graphic="gears"
      sections={[
        {
          title: "Hvad er en IT projektleder?",
          content: "En IT projektleder er ansvarlig for at planlægge, organisere, udføre og afslutte et IT-projekt. Deres primære mål er at sikre, at projektet leveres til tiden, inden for budgettet og med den ønskede kvalitet.",
          bullets: [
            "Definering af projektets omfang og mål",
            "Udvikling af en detaljeret projektplan",
            "Allokering af ressourcer og budgettering",
            "Ledelse og motivering af projektteamet",
            "Identifikation og håndtering af risici",
            "Kommunikation med interessenter og styregruppe",
          ],
        },
        {
          title: "Fordele ved at bruge FindITkonsulenter.dk",
          content: "Vi gør det nemt og gratis at finde den rette IT projektleder til dit projekt.",
          bullets: [
            "<strong>Gratis og uforpligtende:</strong> Vores service er helt gratis for virksomheder.",
            "<strong>Tidsbesparende:</strong> Vi håndterer hele processen med at kontakte leverandører.",
            "<strong>Bredt udvalg:</strong> Adgang til et netværk af 70+ konsulenthuse og freelanceplatforme.",
            "<strong>Ekspertrådgivning:</strong> Vi hjælper dig med at definere den rette kompetenceprofil.",
            "<strong>Prissammenligning:</strong> Vi benchmarker priser på tværs af markedet.",
          ],
        },
      ]}
      resources={[
        {
          title: "Project Management Institute (PMI)",
          href: "https://www.pmi.org/",
          desc: "Verdens største organisation for projektledelse — certificeringer, standarder og vidensbase.",
        },
        {
          title: "PRINCE2 — Axelos",
          href: "https://www.axelos.com/certifications/propath/prince2-project-management",
          desc: "Internationalt anerkendt projektledelsesmetode og certificeringsprogram.",
        },
        {
          title: "Scrum.org",
          href: "https://www.scrum.org/",
          desc: "Officiel ressource for Scrum-metoden, Professional Scrum certificeringer og agile guides.",
        },
      ]}
      faq={[
        { q: "Hvad koster en IT projektleder?", a: "Timepriser for IT projektledere varierer typisk mellem 900 og 1.800 kr. afhængigt af erfaring og certificeringer som PMP, PRINCE2 eller Scrum Master." },
        { q: "Kan I finde Scrum Masters og agile coaches?", a: "Ja — vi finder specialister inden for alle projektledelsesmetoder inkl. Scrum, SAFe, PRINCE2 og klassisk vandfaldsmodel." },
      ]}
    />
  );
}
