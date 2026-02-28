import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cybersecurity konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description:
    "Find den rette cybersecurity konsulent gratis. GDPR, ISO 27001, NIS2, penetrationstest og sikkerhedsarkitektur via 70+ leverandører inden for 3 arbejdsdage.",
  keywords: [
    "cybersecurity konsulent",
    "IT sikkerhed konsulent Danmark",
    "GDPR rådgiver",
    "ISO 27001 konsulent",
    "NIS2 konsulent",
    "penetrationstest",
    "informationssikkerhed konsulent",
    "CISO rådgiver",
    "sikkerhedsarkitektur",
    "gratis cybersecurity konsulent",
  ],
  alternates: { canonical: "https://finditconsultants.com/konsulenter/cybersecurity" },
  openGraph: {
    title: "Cybersecurity konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    description:
      "Find kvalificerede cybersecurity konsulenter via 70+ leverandører. GDPR, ISO 27001, NIS2 og penetrationstest — gratis og uforpligtende.",
    url: "https://finditconsultants.com/konsulenter/cybersecurity",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Cybersecurity konsulent — Gratis multi-sourcing", description: "Find cybersecurity konsulenter via 70+ leverandører — gratis, inden for 3 dage." },
};

export default function CybersecurityPage() {
  return (
    <ConsultantPage
      title="cybersecurity konsulent"
      eyebrow="Cybersecurity & Compliance"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">cybersecurity konsulenter</span></>}
      intro="Beskyt din virksomhed med de rette sikkerhedsspecialister. Vi finder kvalificerede cybersecurity konsulenter via 70+ partnere — hurtigt og uforpligtende."
      price="950 – 1.600 kr/t"
      graphic="shield"
      sections={[
        {
          title: "Hvad er cybersecurity rådgivning?",
          content: "Cybersecurity rådgivning handler om at identificere, vurdere og minimere de risici, der truer din virksomheds digitale aktiver og infrastruktur. Med det stigende antal cyberangreb og skærpede lovkrav — herunder GDPR, NIS2-direktivet og branchespecifikke standarder — er behovet for dedikerede sikkerhedskonsulenter større end nogensinde.",
          bullets: [
            "<strong>Risikovurdering:</strong> Kortlægning af sårbarheder i systemer, netværk og processer.",
            "<strong>Compliance:</strong> Sikring af overholdelse af GDPR, ISO 27001, NIS2 og andre regulativer.",
            "<strong>Penetrationstest:</strong> Kontrollerede angreb der afslører sikkerhedshuller inden de udnyttes.",
            "<strong>Sikkerhedsarkitektur:</strong> Design af robuste sikkerhedsstrukturer fra bunden.",
            "<strong>Incident response:</strong> Hurtig reaktion og genopretning ved sikkerhedshændelser.",
          ],
        },
        {
          title: "Hvad laver en cybersecurity konsulent?",
          content: "En cybersecurity konsulent analyserer din virksomheds nuværende sikkerhedsniveau og implementerer målrettede løsninger. Opgaverne spænder fra tekniske sikkerhedsvurderinger til strategisk rådgivning på ledelsesniveau.",
          bullets: [
            "<strong>Sikkerhedsrevision:</strong> Gennemgang af eksisterende systemer, politikker og procedurer.",
            "<strong>GDPR-rådgivning:</strong> Implementering af databeskyttelsespraksisser og dokumentation.",
            "<strong>Awareness-træning:</strong> Oplæring af medarbejdere i sikker adfærd og phishing-genkendelse.",
            "<strong>SOC-opsætning:</strong> Design og implementering af Security Operations Center.",
            "<strong>Zero Trust-arkitektur:</strong> Implementering af moderne adgangskontrol og netværkssegmentering.",
          ],
        },
        {
          title: "Typiske kompetencer vi matcher",
          content: "Vores netværk dækker et bredt spektrum af cybersecurity specialister — fra operationelle teknikere til strategiske CISO-profiler.",
          bullets: [
            "<strong>CISO / vCISO:</strong> Strategisk sikkerhedsledelse på deltid eller projektbasis.",
            "<strong>Penetrationstestere:</strong> Etisk hacking og sårbarhedstest af systemer og applikationer.",
            "<strong>Cloud security:</strong> Sikring af Azure, AWS og Google Cloud-miljøer.",
            "<strong>Compliance specialister:</strong> ISO 27001-implementering og GDPR Data Protection Officers.",
            "<strong>SOC analytikere:</strong> Overvågning, trusselsdetektion og incident response.",
          ],
        },
      ]}
      resources={[
        {
          title: "Center for Cybersikkerhed (CFCS)",
          href: "https://www.cfcs.dk/",
          desc: "Den danske regerings cybersikkerhedsmyndighed med trusselsvurderinger, vejledninger og NIS2-information.",
        },
        {
          title: "Datatilsynet — GDPR vejledning",
          href: "https://www.datatilsynet.dk/",
          desc: "Dansk tilsynsmyndighed for databeskyttelse og GDPR med vejledninger til virksomheder.",
        },
        {
          title: "ISO/IEC 27001 — Informationssikkerhed",
          href: "https://www.iso.org/isoiec-27001-information-security.html",
          desc: "Internationalt anerkendt standard for styring af informationssikkerhed i organisationer.",
        },
      ]}
      faq={[
        {
          q: "Hvad koster en cybersecurity konsulent?",
          a: "Timepriser varierer typisk mellem 950 og 1.600 kr. afhængigt af specialisering og erfaring. CISO-profiler og specialister inden for penetrationstest ligger i den høje ende, mens compliance-rådgivere typisk er billigere.",
        },
        {
          q: "Kan I finde konsulenter med ISO 27001 erfaring?",
          a: "Ja — vi matcher præcist de compliance-krav du har, herunder ISO 27001, GDPR, NIS2 og branchespecifikke standarder som PCI DSS.",
        },
        {
          q: "Har I konsulenter der kan hjælpe med NIS2-direktivet?",
          a: "Ja. NIS2 træder i kraft for mange danske virksomheder, og vi har specialister der kender direktivets krav indgående og kan hjælpe med gap-analyse, implementeringsplan og dokumentation.",
        },
      ]}
    />
  );
}
