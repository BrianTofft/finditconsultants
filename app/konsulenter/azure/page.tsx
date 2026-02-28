import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Azure konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description:
    "Find den rette Azure konsulent gratis. Cloud-migration, Azure-arkitektur og DevOps via 70+ leverandører. Vi præsenterer screenede profiler inden for 3 arbejdsdage.",
  keywords: [
    "Azure konsulent",
    "Azure konsulent Danmark",
    "Microsoft Azure rådgivning",
    "cloud konsulent",
    "Azure specialist",
    "cloud migration",
    "Azure DevOps",
    "Azure arkitektur",
    "gratis Azure konsulent",
    "cloud-løsninger Danmark",
  ],
  alternates: { canonical: "https://finditconsultants.com/konsulenter/azure" },
  openGraph: {
    title: "Azure konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    description:
      "Find kvalificerede Azure konsulenter via 70+ leverandører. Cloud-migration, arkitektur, DevOps og kostoptimering — gratis og uforpligtende.",
    url: "https://finditconsultants.com/konsulenter/azure",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Azure konsulent — Gratis multi-sourcing",
    description: "Find Azure konsulenter via 70+ leverandører — gratis, uforpligtende, inden for 3 dage.",
  },
};

export default function AzurePage() {
  return (
    <ConsultantPage
      title="Azure konsulent"
      eyebrow="Microsoft Azure"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">Azure konsulenter</span></>}
      intro="Microsoft Azure-specialister til cloud-migration, arkitektur og DevOps. Vi finder det rette match via 70+ partnere."
      price="800 – 1.600 kr/t"
      graphic="cloud"
      sections={[
        {
          title: "Hvad er Microsoft Azure?",
          content: "Microsoft Azure er en omfattende cloud computing-platform med over 200 produkter og tjenester, herunder virtuelle maskiner, databaser, AI, DevOps, sikkerhed og netværk. Azure understøtter både offentlige og private cloud-miljøer samt hybridløsninger.",
          bullets: [
            "<strong>Compute:</strong> Virtuelle maskiner, Azure Kubernetes Service (AKS), App Services.",
            "<strong>Storage:</strong> Blob Storage, Disk Storage, Archive Storage.",
            "<strong>Databaser:</strong> Azure SQL Database, Cosmos DB, Azure Database for MySQL.",
            "<strong>AI og Machine Learning:</strong> Azure Machine Learning, Cognitive Services.",
            "<strong>Sikkerhed:</strong> Azure Security Center, Azure Active Directory, Key Vault.",
          ],
        },
        {
          title: "Hvad laver en freelance Azure konsulent?",
          content: "En Azure konsulent hjælper virksomheder med at designe, implementere og optimere løsninger på Microsoft Azure platformen.",
          bullets: [
            "<strong>Cloud-arkitektur:</strong> Design af skalerbare og sikre cloud-løsninger.",
            "<strong>Migrering:</strong> Flytning af applikationer og data fra lokale servere til Azure.",
            "<strong>DevOps:</strong> Implementering af CI/CD ved hjælp af Azure DevOps.",
            "<strong>Sikkerhed og compliance:</strong> Opsætning af sikkerhedspolitikker.",
            "<strong>Kostoptimering:</strong> Analyse og optimering af ressourceforbrug.",
          ],
        },
        {
          title: "Hvorfor ansætte en Azure konsulent?",
          content: "En erfaren Azure konsulent bringer ikke kun teknisk ekspertise, men også strategisk indsigt der kan drive forretningsværdi.",
          bullets: [
            "Accelererer implementeringen og overgangen til cloud",
            "Optimerer omkostninger og identificerer unødvendige udgifter",
            "Implementerer best practices for databeskyttelse og sikkerhed",
            "Sikrer compliance med lovgivningsmæssige krav og standarder",
          ],
        },
      ]}
      resources={[
        {
          title: "Microsoft Azure — Officiel dokumentation",
          href: "https://learn.microsoft.com/da-dk/azure/",
          desc: "Komplet dokumentation og guides til alle Azure-tjenester og platformens over 200 produkter.",
        },
        {
          title: "Azure Arkitekturcenter",
          href: "https://learn.microsoft.com/da-dk/azure/architecture/",
          desc: "Best practices, referencearkitekturer og design patterns til Azure-løsninger.",
        },
        {
          title: "Microsoft Azure Pricing Calculator",
          href: "https://azure.microsoft.com/da-dk/pricing/calculator/",
          desc: "Officielt kalkulationsværktøj til estimering af Azure-omkostninger for dit projekt.",
        },
      ]}
      faq={[
        { q: "Hvad koster en Azure konsulent i Danmark?", a: "Timeprisen ligger generelt mellem 800 og 1.600 DKK i timen. For nearshore-konsulenter kan prisen være betydeligt lavere." },
        { q: "Kan en Azure konsulent arbejde remote?", a: "Ja, de fleste Azure-opgaver kan løses remote. Vi finder konsulenter der matcher din foretrukne arbejdsform." },
      ]}
    />
  );
}
