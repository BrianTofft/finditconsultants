import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "IT projektleder — Gratis multi-sourcing | FindITkonsulenter.dk",
  description: "Find den rette IT projektleder gratis. Vi aktiverer 70+ leverandører og finder det rigtige match til dit projekt.",
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
      faq={[
        { q: "Hvad koster en IT projektleder?", a: "Timepriser for IT projektledere varierer typisk mellem 900 og 1.800 kr. afhængigt af erfaring og certificeringer som PMP, PRINCE2 eller Scrum Master." },
        { q: "Kan I finde Scrum Masters og agile coaches?", a: "Ja — vi finder specialister inden for alle projektledelsesmetoder inkl. Scrum, SAFe, PRINCE2 og klassisk vandfaldsmodel." },
      ]}
    />
  );
}
