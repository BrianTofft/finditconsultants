import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IT konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description:
    "Find den rette IT konsulent gratis via multi-sourcing. 70+ partnere præsenterer 4–9 screenede kandidater inden for 3 arbejdsdage. Alle IT-discipliner dækket.",
  keywords: [
    "IT konsulent",
    "IT konsulent Danmark",
    "freelance IT konsulent",
    "IT rådgiver",
    "find IT konsulent",
    "IT konsulenthjælp",
    "IT specialist",
    "gratis IT konsulent",
    "IT konsulent rekruttering",
    "IT konsulent til leje",
  ],
  alternates: { canonical: "https://finditconsultants.com/konsulenter/it-konsulent" },
  openGraph: {
    title: "IT konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    description:
      "Find den rette IT konsulent via 70+ leverandører. Alle IT-discipliner — gratis, uforpligtende og inden for 3 arbejdsdage.",
    url: "https://finditconsultants.com/konsulenter/it-konsulent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IT konsulent — Gratis multi-sourcing",
    description: "Find IT konsulenter via 70+ leverandører — gratis, uforpligtende, inden for 3 dage.",
  },
};

export default function ITKonsulentPage() {
  return (
    <ConsultantPage
      title="IT konsulent"
      eyebrow="IT konsulenter"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">IT konsulenter</span></>}
      graphic="people"
      intro="Din partner i jagten på de rette IT-konsulenter. Vi finder de bedste kandidater til dine specifikke behov via 70+ leverandører."
      sections={[
        {
          title: "Hvad er en IT konsulent?",
          content: "En IT-konsulent er en specialist inden for informationsteknologi, der rådgiver og assisterer virksomheder med at optimere deres IT-løsninger. Deres ekspertise spænder bredt fra implementering af nye systemer til optimering af eksisterende infrastruktur.",
          bullets: [
            "<strong>AI konsulenter:</strong> Eksperter i kunstig intelligens og machine learning.",
            "<strong>Azure konsulenter:</strong> Specialister i Microsoft Azure cloud-platformen.",
            "<strong>Power BI konsulenter:</strong> Eksperter i dataanalyse og visualisering.",
            "<strong>Softwareudviklere:</strong> Udvikler skræddersyede softwareløsninger.",
            "<strong>Projektledere:</strong> Styrer IT-projekter sikkert i mål.",
          ],
        },
        {
          title: "Hvorfor bruge IT konsulenter?",
          content: "Der er mange fordele ved at hyre IT-konsulenter til dine projekter frem for at ansætte fast personale.",
          bullets: [
            "<strong>Specialiseret ekspertise:</strong> Få adgang til den nyeste viden inden for specifikke IT-områder.",
            "<strong>Fleksibilitet:</strong> Skalér dit team op eller ned efter behov.",
            "<strong>Objektiv rådgivning:</strong> Konsulenter kan give et uvildigt perspektiv på dine IT-udfordringer.",
            "<strong>Effektivitet:</strong> Få løst dine IT-opgaver hurtigt og professionelt.",
            "<strong>Omkostningsbesparelser:</strong> Undgå dyre fejl og forsinkelser ved at hyre eksperter.",
          ],
        },
        {
          title: "Sådan finder du de bedste IT konsulenter",
          content: "FindITkonsulenter.dk håndterer hele processen for dig — helt gratis.",
          bullets: [
            "Vi aktiverer 70+ konsulenthuse, bureauer og freelancenetværk",
            "Vi screener alle indkomne profiler og sorterer irrelevante kandidater fra",
            "Du modtager 4–9 relevante, screenede profiler med priser inden for 3 arbejdsdage",
            "Du interviewer hvem du vil — ingen forpligtelse",
            "Aftalen indgås direkte med den valgte leverandør",
          ],
        },
      ]}
      resources={[
        {
          title: "PROSA — Forbund for IT-specialister",
          href: "https://www.prosa.dk/",
          desc: "Dansk fagforening for IT-professionelle med indsigt i lønniveauer og markedsvilkår.",
        },
        {
          title: "DI Digital — IT i dansk erhvervsliv",
          href: "https://www.danskindustri.dk/di-digital/",
          desc: "Dansk Industris digitale videnscenter med rapporter og analyser om IT i erhvervslivet.",
        },
      ]}
      faq={[
        { q: "Hvad koster det at bruge FindITkonsulenter.dk?", a: "Vores service er helt gratis for kunder. Vi tjener vores penge via samarbejde med leverandørnetværket." },
        { q: "Hvor lang tid tager det?", a: "Vi præsenterer typisk de første kandidater inden for 3 arbejdsdage efter vi har modtaget din forespørgsel." },
      ]}
    />
  );
}
