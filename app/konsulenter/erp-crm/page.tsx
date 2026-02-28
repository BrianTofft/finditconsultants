import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ERP & CRM konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description:
    "Find den rette ERP eller CRM konsulent gratis. SAP S/4HANA, Dynamics 365, Salesforce og systemintegration via 70+ leverandører inden for 3 arbejdsdage.",
  keywords: [
    "ERP konsulent",
    "CRM konsulent Danmark",
    "SAP konsulent",
    "Dynamics 365 konsulent",
    "Salesforce konsulent",
    "ERP implementering",
    "Navision konsulent",
    "Business Central konsulent",
    "ERP migration",
    "gratis ERP konsulent",
  ],
  alternates: { canonical: "https://finditconsultants.com/konsulenter/erp-crm" },
  openGraph: {
    title: "ERP & CRM konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    description:
      "Find kvalificerede ERP og CRM konsulenter via 70+ leverandører. SAP, Dynamics 365, Salesforce — gratis og uforpligtende.",
    url: "https://finditconsultants.com/konsulenter/erp-crm",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "ERP & CRM konsulent — Gratis multi-sourcing", description: "Find ERP og CRM konsulenter via 70+ leverandører — gratis, inden for 3 dage." },
};

export default function ErpCrmPage() {
  return (
    <ConsultantPage
      title="ERP & CRM konsulent"
      eyebrow="ERP & CRM"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">ERP & CRM konsulenter</span></>}
      intro="Implementer, optimer eller migrér dine forretningssystemer med de rette specialister. Fra SAP til Dynamics 365 og Salesforce — vi finder eksperterne via 70+ partnere."
      price="850 – 1.500 kr/t"
      graphic="gears"
      sections={[
        {
          title: "Hvad er ERP og CRM rådgivning?",
          content: "ERP (Enterprise Resource Planning) og CRM (Customer Relationship Management) systemer er kernen i de fleste moderne virksomheders forretningsprocesser. En ERP/CRM konsulent hjælper med at vælge, implementere og optimere disse systemer, så de understøtter virksomhedens unikke processer og vækstmål.",
          bullets: [
            "<strong>ERP systemer:</strong> SAP S/4HANA, Microsoft Dynamics 365 Business Central, IFS, Oracle og Navision.",
            "<strong>CRM systemer:</strong> Salesforce, Microsoft Dynamics 365 Sales, HubSpot og SugarCRM.",
            "<strong>Implementering:</strong> Konfiguration, tilpasning og go-live support.",
            "<strong>Integration:</strong> Kobling af ERP/CRM med øvrige forretningssystemer.",
            "<strong>Migration:</strong> Flytning fra legacy systemer til moderne cloud-platforme.",
          ],
        },
        {
          title: "Hvad laver en ERP & CRM konsulent?",
          content: "En ERP/CRM konsulent kombinerer dyb teknisk platformskendskab med forretningsforståelse. De hjælper med alt fra kravspecifikation og systemvalg til implementering, brugeruddannelse og løbende optimering.",
          bullets: [
            "<strong>Behovsanalyse:</strong> Kortlægning af processer og krav inden systemvalg.",
            "<strong>Systemimplementering:</strong> Konfiguration af moduler tilpasset virksomhedens behov.",
            "<strong>Datatransformation:</strong> Migrering og rensning af data fra eksisterende systemer.",
            "<strong>Brugeruddannelse:</strong> Oplæring af slutbrugere og superbrugere.",
            "<strong>Support & optimering:</strong> Post go-live support og løbende forbedringer.",
          ],
        },
        {
          title: "Platforme vi finder specialister til",
          content: "Vores netværk dækker alle de store ERP- og CRM-platforme samt en lang række branchespecifikke løsninger.",
          bullets: [
            "<strong>SAP:</strong> S/4HANA, SAP ECC, SuccessFactors og Ariba specialister.",
            "<strong>Microsoft Dynamics:</strong> Business Central, Finance & Operations og Dynamics 365 Sales.",
            "<strong>Salesforce:</strong> Sales Cloud, Service Cloud, Marketing Cloud og Pardot.",
            "<strong>IFS & Infor:</strong> Specialister til manufacturing og service management.",
            "<strong>E-conomic & Uniconta:</strong> Mindre danske ERP-løsninger til SMV-segmentet.",
          ],
        },
      ]}
      resources={[
        {
          title: "SAP Danmark",
          href: "https://www.sap.com/denmark/index.html",
          desc: "Verdens største ERP-leverandør med S/4HANA, SuccessFactors og branchespecifikke løsninger.",
        },
        {
          title: "Microsoft Dynamics 365",
          href: "https://dynamics.microsoft.com/da-dk/",
          desc: "Microsofts ERP- og CRM-platform integreret med Azure, Microsoft 365 og Power Platform.",
        },
        {
          title: "Salesforce Danmark",
          href: "https://www.salesforce.com/dk/",
          desc: "Verdens mest udbredte CRM-platform til salg, service, marketing og commerce.",
        },
      ]}
      faq={[
        {
          q: "Hvad koster en ERP konsulent?",
          a: "Timepriser varierer typisk mellem 850 og 1.500 kr. SAP-specialister og Salesforce-arkitekter ligger i den høje ende, mens implementeringskonsulenter til mindre platforme er billigere.",
        },
        {
          q: "Kan I finde konsulenter til en SAP-migration?",
          a: "Ja — vi har adgang til SAP-specialister via vores netværk af godkendte konsulenthuse. Specificér hvilke SAP-moduler og versioner du har brug for, og vi matcher præcist.",
        },
        {
          q: "Hvad med integrationer til tredjepartssystemer?",
          a: "Mange ERP/CRM-projekter kræver integrationer. Vi kan matche konsulenter med erfaring i API-integration, middleware-platforme og specifik konnektorer til de systemer du bruger.",
        },
      ]}
    />
  );
}
