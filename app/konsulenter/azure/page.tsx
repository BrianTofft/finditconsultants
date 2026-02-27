import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Azure konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description: "Find den rette Azure konsulent gratis. Vi aktiverer 70+ leverandører og præsenterer relevante profiler inden for 3 arbejdsdage.",
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
      faq={[
        { q: "Hvad koster en Azure konsulent i Danmark?", a: "Timeprisen ligger generelt mellem 800 og 1.600 DKK i timen. For nearshore-konsulenter kan prisen være betydeligt lavere." },
        { q: "Kan en Azure konsulent arbejde remote?", a: "Ja, de fleste Azure-opgaver kan løses remote. Vi finder konsulenter der matcher din foretrukne arbejdsform." },
      ]}
    />
  );
}
