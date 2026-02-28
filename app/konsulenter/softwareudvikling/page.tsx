import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Softwareudvikler konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description: "Find den rette softwareudvikler gratis. Frontend, backend, fullstack og DevOps engineering via 70+ leverandører.",
};

export default function SoftwareudviklingPage() {
  return (
    <ConsultantPage
      title="softwareudvikler"
      eyebrow="Softwareudvikling"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">softwareudviklere</span></>}
      intro="Find de rette udviklere til dit næste projekt. Fra frontend og backend til fullstack og DevOps — vi aktiverer markedet og finder de bedste profiler via 70+ partnere."
      price="700 – 1.400 kr/t"
      graphic="gears"
      sections={[
        {
          title: "Hvad er softwareudviklings rådgivning?",
          content: "Softwareudvikling dækker over hele spektret fra design og kodning til test og deployment af digitale løsninger. En softwareudvikler konsulent kan styrke dit eksisterende team midlertidigt, lede et helt projekt eller bidrage med specialiserede tekniske kompetencer som dit team mangler.",
          bullets: [
            "<strong>Frontend:</strong> React, Vue, Angular og moderne webapplikationer med fokus på brugeroplevelse.",
            "<strong>Backend:</strong> Node.js, .NET, Java, Python og robuste server-side løsninger.",
            "<strong>Fullstack:</strong> Udviklere der behersker hele stacken fra database til brugerflade.",
            "<strong>Mobile:</strong> iOS, Android og cross-platform udvikling med Flutter og React Native.",
            "<strong>DevOps:</strong> CI/CD, containerisering, Kubernetes og automatisering af software delivery.",
          ],
        },
        {
          title: "Hvad laver en softwareudvikler konsulent?",
          content: "En softwareudvikler konsulent kan indgå som en del af dit eksisterende team eller tage selvstændig ansvar for afgrænsede leverancer. Typiske opgaver spænder fra nyudvikling til modernisering af ældre systemer.",
          bullets: [
            "<strong>Feature udvikling:</strong> Implementering af ny funktionalitet i eksisterende produkter.",
            "<strong>Systemmodernisering:</strong> Migrering af legacy code til moderne arkitekturer og frameworks.",
            "<strong>Code review:</strong> Kvalitetssikring og forbedring af eksisterende kodebase.",
            "<strong>API-design:</strong> Design og implementering af RESTful og GraphQL APIs.",
            "<strong>Performance optimering:</strong> Identifikation og løsning af ydeevneproblemer.",
          ],
        },
        {
          title: "Teknologier vi finder specialister til",
          content: "Vores netværk dækker en bred vifte af programmeringssprog, frameworks og platforme — både populære mainstream-teknologier og specialiserede stakke.",
          bullets: [
            "<strong>JavaScript/TypeScript:</strong> React, Next.js, Vue, Angular, Node.js og Svelte.",
            "<strong>Microsoft-stakken:</strong> C#, .NET, ASP.NET Core og Azure-integrerede løsninger.",
            "<strong>Java & Kotlin:</strong> Spring Boot, Micronaut og enterprise Java-arkitekturer.",
            "<strong>Python:</strong> Django, FastAPI, databehandling og scripting.",
            "<strong>Cloud-native:</strong> Docker, Kubernetes, Terraform og serverless arkitekturer.",
          ],
        },
      ]}
      faq={[
        {
          q: "Hvad koster en softwareudvikler konsulent?",
          a: "Timepriser varierer typisk mellem 700 og 1.400 kr. afhængigt af senioritet, teknologi og specialisering. Seniore fullstack udviklere og DevOps-specialister ligger typisk i den høje ende.",
        },
        {
          q: "Kan I finde udviklere til en specifik teknologi?",
          a: "Ja — specificér præcist hvilke teknologier du har brug for, og vi matcher med konsulenter der har dokumenteret erfaring med netop den stack.",
        },
        {
          q: "Er det muligt at forlænge en konsulentaftale undervejs?",
          a: "Det aftaler du direkte med leverandøren. De fleste konsulentaftaler er fleksible og kan forlænges efter gensidig aftale.",
        },
      ]}
    />
  );
}
