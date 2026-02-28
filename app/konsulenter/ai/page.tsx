import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description:
    "Find den rette AI konsulent gratis via multi-sourcing. Vi aktiverer 70+ leverandører og præsenterer 4–9 relevante kandidater inden for 3 arbejdsdage. Machine learning, RPA og AI-strategi.",
  keywords: [
    "AI konsulent",
    "AI konsulent Danmark",
    "machine learning konsulent",
    "RPA konsulent",
    "automation konsulent",
    "AI rådgivning",
    "kunstig intelligens konsulent",
    "copilot implementering",
    "AI specialist",
    "gratis AI konsulent",
  ],
  alternates: { canonical: "https://finditconsultants.com/konsulenter/ai" },
  openGraph: {
    title: "AI konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    description:
      "Find kvalificerede AI konsulenter via 70+ leverandører. Machine learning, RPA, copilot-implementering og AI-strategi — gratis og uforpligtende.",
    url: "https://finditconsultants.com/konsulenter/ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI konsulent — Gratis multi-sourcing",
    description: "Find AI konsulenter via 70+ leverandører — gratis, uforpligtende, inden for 3 dage.",
  },
};

export default function AIPage() {
  return (
    <ConsultantPage
      title="AI konsulent"
      eyebrow="AI & Automation"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">AI konsulenter</span></>}
      intro="Lad markedet konkurrere — og slip for selv at håndtere utallige leverandører. Vi finder de rette AI-specialister til dit projekt."
      price="800 – 2.500+ kr/t"
      graphic="network"
      sections={[
        {
          title: "Hvad er kunstig intelligens (AI)?",
          content: "Kunstig intelligens (AI) refererer til computerbaserede systemers evne til at udføre opgaver, der normalt kræver menneskelig intelligens, såsom læring, beslutningstagning, talegenkendelse og problemløsning. AI-teknologier hjælper virksomheder med at automatisere processer, forbedre beslutninger, øge effektiviteten og skabe innovative løsninger.",
          bullets: [
            "<strong>Smal AI (Narrow AI):</strong> Designet til at udføre specifikke opgaver som fx anbefalingssystemer, chatbots eller billedgenkendelse.",
            "<strong>Machine Learning (ML):</strong> Automatiserede metoder til at opdage mønstre og lave præcise forudsigelser fra store datasæt.",
            "<strong>Natural Language Processing (NLP):</strong> Teknologi til at forstå og generere menneskeligt sprog.",
            "<strong>Computer Vision:</strong> Evnen til at fortolke og forstå visuel information fra billeder og videoer.",
            "<strong>Robot Process Automation (RPA):</strong> Automatisering af rutineopgaver ved hjælp af software-robotter.",
          ],
        },
        {
          title: "Hvad laver en AI konsulent?",
          content: "En AI konsulent hjælper virksomheder med at forstå, implementere og optimere kunstig intelligens for at opnå deres forretningsmål.",
          bullets: [
            "<strong>Analyse og rådgivning:</strong> Grundige analyser af virksomhedens behov og vurdering af AI-potentiale.",
            "<strong>Design og udvikling:</strong> Opbygning og træning af AI-modeller skræddersyet til specifikke behov.",
            "<strong>Implementering:</strong> Integration af AI-løsninger med virksomhedens eksisterende systemer.",
            "<strong>Evaluering og optimering:</strong> Kontinuerlig overvågning og justering af AI-løsninger.",
            "<strong>Uddannelse og træning:</strong> Uddannelse af medarbejdere i brugen af AI-teknologier.",
          ],
        },
        {
          title: "Hvorfor ansætte en AI konsulent?",
          content: "En AI konsulent sikrer, at virksomheder opnår maksimal værdi fra AI-investeringer. Gennem ekspertviden og praktisk erfaring kan konsulenten hjælpe med at navigere i komplekse AI-projekter, minimere risici og accelerere implementeringen.",
          bullets: [
            "Håndterer udfordringer med datakvalitet og sikrer relevante træningsdata",
            "Vurderer og håndterer etiske spørgsmål forbundet med brugen af AI",
            "Sikrer at AI-løsninger overholder gældende lovgivning og GDPR",
            "Accelererer time-to-value på AI-investeringer",
          ],
        },
      ]}
      resources={[
        {
          title: "Digitaliseringsstyrelsen: AI i Danmark",
          href: "https://www.digst.dk/teknologi/kunstig-intelligens/",
          desc: "Regeringens strategi og vejledning om ansvarlig AI-anvendelse i den offentlige og private sektor.",
        },
        {
          title: "Microsoft Copilot & AI-løsninger",
          href: "https://www.microsoft.com/da-dk/ai",
          desc: "Microsofts AI-platform, Copilot og Azure AI-tjenester til virksomheder.",
        },
        {
          title: "OECD AI Policy Observatory",
          href: "https://oecd.ai/",
          desc: "International vidensbase om AI-regulering, standarder og best practices på tværs af lande.",
        },
      ]}
      faq={[
        { q: "Hvad koster en AI konsulent?", a: "Timepriser for AI konsulenter varierer typisk mellem 800 kr. til over 2.500 kr. per time afhængigt af erfaring og specialisering. Større projekter aftales ofte som fastpris." },
        { q: "Kan vi bruge nearshore AI konsulenter?", a: "Ja — vi har adgang til nearshore-partnere i bl.a. Østeuropa, som kan levere høj kvalitet til lavere priser." },
        { q: "Hvor hurtigt kan I finde en AI konsulent?", a: "Vi aktiverer markedet med det samme og præsenterer dig for relevante profiler inden for 3 arbejdsdage." },
      ]}
    />
  );
}
