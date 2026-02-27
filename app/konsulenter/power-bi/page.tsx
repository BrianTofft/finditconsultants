import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Power BI konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description: "Find den rette Power BI konsulent gratis. Datavisualisering og BI-løsninger via 70+ leverandører.",
};
export default function PowerBIPage() {
  return (
    <ConsultantPage
      title="Power BI konsulent"
      eyebrow="Data & BI"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">Power BI konsulenter</span></>}
      intro="Få styr på din data med de rette Power BI specialister. Vi finder kvalificerede kandidater via 70+ partnere."
      price="750 – 1.400 kr/t"
      graphic="chart"
      sections={[
        {
          title: "Hvad er Microsoft Power BI?",
          content: "Microsoft Power BI er en markedsførende forretningsintelligens-platform, der gør det muligt for virksomheder at samle, analysere og visualisere data fra en bred vifte af kilder. Platformen giver brugerne mulighed for at oprette interaktive dashboards og rapporter.",
          bullets: [
            "<strong>Power BI Desktop:</strong> Applikation til at skabe rapporter og datamodeller.",
            "<strong>Power BI Service:</strong> Cloud-baseret tjeneste til deling af rapporter og dashboards.",
            "<strong>Power BI Mobile:</strong> Adgang til data og rapporter via mobile enheder.",
            "<strong>Integrationer:</strong> Forbind med SQL Server, Excel, Azure og hundredvis af andre datakilder.",
          ],
        },
        {
          title: "Hvad laver en Power BI konsulent?",
          content: "En Power BI konsulent hjælper virksomheder med at maksimere værdien af deres data ved effektivt at anvende Microsoft Power BI.",
          bullets: [
            "<strong>Analyse og rådgivning:</strong> Identificere databehov og rådgive om optimal anvendelse af Power BI.",
            "<strong>Design og udvikling:</strong> Udvikle skræddersyede dashboards og rapporter.",
            "<strong>Datamodellering:</strong> Opbygge effektive datamodeller der sikrer hurtig og præcis analyse.",
            "<strong>Implementering:</strong> Integration med eksisterende IT-systemer.",
            "<strong>Uddannelse:</strong> Oplære medarbejdere i brugen af Power BI.",
          ],
        },
      ]}
      faq={[
        { q: "Hvad koster en Power BI konsulent?", a: "Timepriser varierer typisk mellem 750 og 1.400 kr. afhængigt af erfaring og opgavens kompleksitet." },
        { q: "Kan I finde konsulenter med DAX og datamodellering?", a: "Ja — vi specificerer præcist hvilke Power BI kompetencer du har brug for og matcher derefter." },
      ]}
    />
  );
}
