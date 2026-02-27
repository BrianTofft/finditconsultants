import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "SharePoint konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description: "Find den rette SharePoint konsulent gratis. Implementering og optimering via 70+ leverandører.",
};
export default function SharePointPage() {
  return (
    <ConsultantPage
      title="SharePoint konsulent"
      eyebrow="Microsoft-teknologi"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">SharePoint konsulenter</span></>}
      intro="Find erfarne SharePoint-specialister til implementering, optimering og integration — via 70+ leverandører."
      price="800 – 1.500 kr/t"
      graphic="shield"
      sections={[
        {
          title: "Hvorfor investere i SharePoint konsulenter?",
          content: "SharePoint er en kraftfuld platform der kan forbedre samarbejdet, strømline arbejdsgange og øge produktiviteten. Men for at realisere det fulde potentiale kræver det specialiseret viden.",
          bullets: [
            "<strong>Ekspertise og erfaring:</strong> Dybdegående viden om SharePoint og best practices.",
            "<strong>Tilpasning til jeres behov:</strong> Skræddersy SharePoint til jeres forretningsprocesser.",
            "<strong>Effektiv implementering:</strong> Hurtig opsætning der minimerer forstyrrelser.",
            "<strong>Træning og support:</strong> Oplæring af medarbejdere og løbende support.",
            "<strong>Fejlfinding og optimering:</strong> Identificer og løs problemer og optimer ydeevne.",
          ],
        },
        {
          title: "Hvad laver en SharePoint konsulent?",
          content: "SharePoint konsulenter dækker et bredt spektrum af opgaver fra grundlæggende konfiguration til komplekse integrationer.",
          bullets: [
            "Design og konfiguration af SharePoint-miljøer",
            "Migrering fra ældre versioner og andre platforme",
            "Integration med Microsoft 365, Teams og Power Platform",
            "Udvikling af tilpassede workflows og løsninger",
            "Governance og sikkerhedsopsætning",
          ],
        },
      ]}
      faq={[
        { q: "Kan I finde konsulenter til SharePoint Online?", a: "Ja — vi finder specialister i både SharePoint Online (Microsoft 365) og on-premise SharePoint." },
        { q: "Hvad koster en SharePoint konsulent?", a: "Timepriser ligger typisk mellem 800 og 1.500 kr. afhængigt af erfaring og om det er SharePoint Online eller on-premise." },
      ]}
    />
  );
}
