import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IT Support & Service Desk konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description: "Find den rette IT support eller service desk konsulent gratis. ITIL-processer, 1st/2nd/3rd line support og servicedesk-ledelse via 70+ leverandører.",
};

export default function SupportPage() {
  return (
    <ConsultantPage
      title="IT support konsulent"
      eyebrow="Support & Service Desk"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">IT support konsulenter</span></>}
      intro="Styrk din IT-supportfunktion med erfarne specialister. Fra 1st line support til service desk ledelse og ITIL-implementering — vi finder det rette match via 70+ partnere."
      price="350 – 750 kr/t"
      graphic="people"
      sections={[
        {
          title: "Hvad er IT support og service desk rådgivning?",
          content: "IT support og service desk funktioner er brugernes primære kontaktpunkt til IT-organisationen. En velfungerende support-funktion øger medarbejderproduktiviteten, minimerer nedetid og sikrer hurtig løsning af tekniske problemer. En konsulent på dette område kan både løfte den daglige drift og hjælpe med at professionalisere processer og strukturer.",
          bullets: [
            "<strong>1st line support:</strong> Første kontaktpunkt for brugere — password reset, enkel fejlfinding og eskalering.",
            "<strong>2nd line support:</strong> Teknisk dybere fejlfinding af hardware, software og netværk.",
            "<strong>3rd line support:</strong> Ekspertbistand til komplekse systemproblemer og eskalerede sager.",
            "<strong>ITIL-processer:</strong> Incident, problem, change og service request management.",
            "<strong>Servicedesk-ledelse:</strong> Opbygning og optimering af support-organisationen.",
          ],
        },
        {
          title: "Hvad laver en IT support konsulent?",
          content: "En IT support konsulent kan varetage den daglige supportdrift, men kan også bruges til at professionalisere og effektivisere supportfunktionen gennem procesoptimering, implementering af ITSM-værktøjer og uddannelse af supportpersonale.",
          bullets: [
            "<strong>Daglig support:</strong> Håndtering af brugerhenvendelser og tekniske problemer.",
            "<strong>ITSM-implementering:</strong> Opsætning af ServiceNow, TOPdesk, Jira Service Management m.fl.",
            "<strong>Procesforbedring:</strong> Analyse og optimering af support-workflows og eskaleringsstrukturer.",
            "<strong>Knowledge base:</strong> Opbygning af selvbetjeningsportaler og vidensbaser.",
            "<strong>SLA-design:</strong> Definition af serviceniveauer og KPI-struktur for supportfunktionen.",
          ],
        },
        {
          title: "Typiske profiler vi matcher",
          content: "Vores netværk dækker alt fra junior support-teknikere til erfarne service desk managers og ITSM-arkitekter.",
          bullets: [
            "<strong>Support tekniker (1st/2nd line):</strong> Operationel bruger- og systemsupport.",
            "<strong>Service Desk Manager:</strong> Ledelse af supportteams, SLA-styring og rapportering.",
            "<strong>ITIL specialister:</strong> Procesimplementering og ITSM-platfomskonfiguration.",
            "<strong>Desktop engineers:</strong> Endpoint management, MDM og workplace-løsninger.",
            "<strong>Onsite support:</strong> Fysisk support til kontorer og produktionsmiljøer.",
          ],
        },
      ]}
      faq={[
        {
          q: "Hvad koster en IT support konsulent?",
          a: "Timepriser varierer typisk mellem 350 og 750 kr. 1st line support er billigst, mens erfarne service desk managers og ITSM-arkitekter ligger i den høje ende.",
        },
        {
          q: "Kan I finde konsulenter til en midlertidig supportdækning?",
          a: "Ja — vi matcher både korte vikariater og længere projektopgaver. Specificér varighed og tidspunkter i din forespørgsel.",
        },
        {
          q: "Kan I hjælpe med at implementere ServiceNow eller TOPdesk?",
          a: "Absolut. Vi finder specialister der kender den specifikke platform du bruger, og som kan hjælpe med konfiguration, tilpasning og træning.",
        },
      ]}
    />
  );
}
