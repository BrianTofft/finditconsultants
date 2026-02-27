import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Data Warehouse konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description: "Find den rette data warehouse konsulent gratis. Specialister i DW, ETL og BI via 70+ leverandører.",
};
export default function DataWarehousePage() {
  return (
    <ConsultantPage
      title="data warehouse konsulent"
      eyebrow="Data & BI"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">data warehouse konsulenter</span></>}
      intro="Find erfarne specialister i data warehouse, ETL og dataarkitektur via 70+ leverandører og freelancenetværk."
      price="900 – 1.600 kr/t"
      graphic="database"
      sections={[
        {
          title: "Hvad er en data warehouse konsulent?",
          content: "En data warehouse konsulent er en specialist inden for design, implementering og vedligeholdelse af data warehouse løsninger. De hjælper virksomheder med at konsolidere data fra forskellige kilder og gøre dem tilgængelige for analyse.",
          bullets: [
            "Design og udvikling af data warehouse arkitektur",
            "Data modellering og ETL (Extract, Transform, Load) processer",
            "Implementering af datakvalitetsløsninger",
            "Performance tuning og optimering",
            "Integration med BI-værktøjer som Power BI, Tableau og Qlik",
          ],
        },
        {
          title: "Hvornår har du brug for en data warehouse konsulent?",
          content: "Der er mange situationer, hvor det kan være fordelagtigt at hyre en data warehouse konsulent.",
          bullets: [
            "Implementering af et nyt data warehouse fra bunden",
            "Migrering fra eksisterende løsning til cloud-baseret DW (Azure Synapse, Snowflake, BigQuery)",
            "Optimering af et langsomt eller fejlbehæftet data warehouse",
            "Design af datamodeller og ETL-pipelines",
            "Konsolidering af data fra mange forskellige kildesystemer",
          ],
        },
      ]}
      faq={[
        { q: "Hvad koster en data warehouse konsulent?", a: "Timepriser varierer typisk mellem 900 og 1.600 kr. afhængigt af teknologi og erfaring. Snowflake og Azure Synapse-specialister er typisk i den høje ende." },
        { q: "Kan I finde konsulenter med Snowflake eller Azure Synapse?", a: "Ja — vi specificerer præcist hvilken DW-teknologi du arbejder med og finder specialister derefter." },
      ]}
    />
  );
}
