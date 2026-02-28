import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Infrastruktur konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description:
    "Find den rette infrastruktur konsulent gratis. Netværk, serverarkitektur, virtualisering og backup via 70+ leverandører inden for 3 arbejdsdage.",
  keywords: [
    "infrastruktur konsulent",
    "IT infrastruktur Danmark",
    "netværk konsulent",
    "server konsulent",
    "VMware konsulent",
    "Cisco netværk",
    "cloud infrastruktur",
    "datacenter konsulent",
    "hybrid cloud infrastruktur",
    "gratis infrastruktur konsulent",
  ],
  alternates: { canonical: "https://finditconsultants.com/konsulenter/infrastruktur" },
  openGraph: {
    title: "Infrastruktur konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    description:
      "Find kvalificerede infrastruktur konsulenter via 70+ leverandører. Netværk, servere, cloud og datacenter — gratis og uforpligtende.",
    url: "https://finditconsultants.com/konsulenter/infrastruktur",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Infrastruktur konsulent — Gratis multi-sourcing", description: "Find infrastruktur konsulenter via 70+ leverandører — gratis, inden for 3 dage." },
};

export default function InfrastrukturPage() {
  return (
    <ConsultantPage
      title="infrastruktur konsulent"
      eyebrow="Infrastruktur"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">infrastruktur konsulenter</span></>}
      intro="Byg og optimer din IT-infrastruktur med erfarne specialister. Fra netværksdesign til serverarkitektur og driftsoptimering — vi finder det rette match via 70+ partnere."
      price="750 – 1.300 kr/t"
      graphic="network"
      sections={[
        {
          title: "Hvad er IT-infrastruktur rådgivning?",
          content: "IT-infrastruktur er rygraden i enhver moderne virksomhed — det fundament, der sikrer at systemer, applikationer og brugere kan kommunikere stabilt og sikkert. En infrastruktur konsulent designer, implementerer og optimerer denne infrastruktur, uanset om det drejer sig om on-premise, cloud eller hybride løsninger.",
          bullets: [
            "<strong>Netværksarkitektur:</strong> Design og implementering af LAN, WAN, SD-WAN og trådløse løsninger.",
            "<strong>Server & storage:</strong> Dimensionering og opsætning af server- og lagringsinfrastruktur.",
            "<strong>Virtualisering:</strong> VMware, Hyper-V og containerbaserede miljøer.",
            "<strong>Backup & disaster recovery:</strong> Strategier og løsninger der sikrer forretningskontinuitet.",
            "<strong>Drift & overvågning:</strong> Implementering af monitoreringsværktøjer og driftsprocedurer.",
          ],
        },
        {
          title: "Hvad laver en infrastruktur konsulent?",
          content: "En infrastruktur konsulent kan varetage alt fra kortsigtede projektopgaver til længerevarende driftsroller. Typiske opgaver spænder fra design af ny infrastruktur til optimering og migration af eksisterende løsninger.",
          bullets: [
            "<strong>Infrastrukturanalyse:</strong> Gennemgang af eksisterende setup og identifikation af flaskehalse.",
            "<strong>Migration:</strong> Flytning af on-premise systemer til cloud eller nye datacenterplatforme.",
            "<strong>Kapacitetsplanlægning:</strong> Dimensionering af infrastruktur til fremtidigt vækstbehov.",
            "<strong>Hardening & sikkerhed:</strong> Sikring af infrastruktur mod angreb og uautoriseret adgang.",
            "<strong>Dokumentation:</strong> Udarbejdelse af teknisk dokumentation og driftsprocedurer.",
          ],
        },
        {
          title: "Typiske kompetencer vi matcher",
          content: "Vores leverandørnetværk dækker hele spektret af infrastruktur specialister — fra netværksingeniører til datacenterarkitekter og hybrid cloud eksperter.",
          bullets: [
            "<strong>Netværksingeniører:</strong> Cisco, Juniper, Fortinet og SD-WAN specialister.",
            "<strong>System administratorer:</strong> Windows Server, Linux og virtualiseringsplatforme.",
            "<strong>Cloud infrastruktur:</strong> Azure, AWS og GCP infrastrukturspecialister.",
            "<strong>Storage specialister:</strong> SAN, NAS og backup-løsninger fra NetApp, Dell EMC m.fl.",
            "<strong>Datacenter arkitekter:</strong> Design af skalerbare og robuste datacenter-layouts.",
          ],
        },
      ]}
      resources={[
        {
          title: "Cisco — Netværksløsninger til virksomheder",
          href: "https://www.cisco.com/c/en_dk/",
          desc: "Verdens ledende leverandør af netværksudstyr og sikkerhedsløsninger til virksomheder.",
        },
        {
          title: "VMware by Broadcom",
          href: "https://www.vmware.com/",
          desc: "Markedsleder inden for servervirtualisering, cloud-infrastruktur og datacenterplatforme.",
        },
        {
          title: "Azure Hybrid & Infrastructure",
          href: "https://azure.microsoft.com/da-dk/solutions/hybrid-cloud-and-infrastructure/",
          desc: "Microsofts løsninger til hybrid cloud-infrastruktur og on-premise/cloud integration.",
        },
      ]}
      faq={[
        {
          q: "Hvad koster en infrastruktur konsulent?",
          a: "Timepriser varierer typisk mellem 750 og 1.300 kr. Netværks- og infrastrukturspecialister med certifikationer fra Cisco eller VMware ligger typisk i den høje ende.",
        },
        {
          q: "Kan I finde konsulenter til en on-premise til cloud migration?",
          a: "Ja — vi finder specialister med erfaring i lige præcis den platform du bruger, hvad enten det er Azure, AWS, GCP eller en hybrid løsning.",
        },
        {
          q: "Hvad med ITIL og driftsprocesser?",
          a: "Vi matcher også konsulenter med stærk ITIL-baggrund der kan hjælpe med at strukturere driftsprocesser, change management og incident management.",
        },
      ]}
    />
  );
}
