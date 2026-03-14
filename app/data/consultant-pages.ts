export interface ConsultantPageData {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  price?: string;
  graphic: "network" | "cloud" | "chart" | "gears" | "people" | "globe" | "database" | "shield";
  sections: {
    title: string;
    content: string;
    bullets?: string[];
  }[];
  faq: { q: string; a: string }[];
  resources: { title: string; href: string; desc: string }[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

export const consultantPages: ConsultantPageData[] = [
  {
    slug: "ai",
    title: "AI konsulent",
    eyebrow: "AI & Automation",
    intro: "Lad markedet konkurrere — og slip for selv at håndtere utallige leverandører. Vi finder de rette AI-specialister til dit projekt.",
    price: "800 – 2.500+ kr/t",
    graphic: "network",
    metaTitle: "AI konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette AI konsulent gratis via multi-sourcing. Vi aktiverer 70+ leverandører og præsenterer 4–9 relevante kandidater inden for 3 arbejdsdage. Machine learning, RPA og AI-strategi.",
    metaKeywords: ["AI konsulent","AI konsulent Danmark","machine learning konsulent","RPA konsulent","automation konsulent","AI rådgivning","kunstig intelligens konsulent","copilot implementering","AI specialist","gratis AI konsulent"],
    sections: [
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
    ],
    resources: [
      { title: "Digitaliseringsstyrelsen: AI i Danmark", href: "https://www.digst.dk/teknologi/kunstig-intelligens/", desc: "Regeringens strategi og vejledning om ansvarlig AI-anvendelse i den offentlige og private sektor." },
      { title: "Microsoft Copilot & AI-løsninger", href: "https://www.microsoft.com/da-dk/ai", desc: "Microsofts AI-platform, Copilot og Azure AI-tjenester til virksomheder." },
      { title: "OECD AI Policy Observatory", href: "https://oecd.ai/", desc: "International vidensbase om AI-regulering, standarder og best practices på tværs af lande." },
    ],
    faq: [
      { q: "Hvad koster en AI konsulent?", a: "Timepriser for AI konsulenter varierer typisk mellem 800 kr. til over 2.500 kr. per time afhængigt af erfaring og specialisering. Større projekter aftales ofte som fastpris." },
      { q: "Kan vi bruge nearshore AI konsulenter?", a: "Ja — vi har adgang til nearshore-partnere i bl.a. Østeuropa, som kan levere høj kvalitet til lavere priser." },
      { q: "Hvor hurtigt kan I finde en AI konsulent?", a: "Vi aktiverer markedet med det samme og præsenterer dig for relevante profiler inden for 3 arbejdsdage." },
    ],
  },
  {
    slug: "azure",
    title: "Azure konsulent",
    eyebrow: "Microsoft Azure",
    intro: "Microsoft Azure-specialister til cloud-migration, arkitektur og DevOps. Vi finder det rette match via 70+ partnere.",
    price: "800 – 1.600 kr/t",
    graphic: "cloud",
    metaTitle: "Azure konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette Azure konsulent gratis. Cloud-migration, Azure-arkitektur og DevOps via 70+ leverandører. Vi præsenterer screenede profiler inden for 3 arbejdsdage.",
    metaKeywords: ["Azure konsulent","Azure konsulent Danmark","Microsoft Azure rådgivning","cloud konsulent","Azure specialist","cloud migration","Azure DevOps","Azure arkitektur","gratis Azure konsulent","cloud-løsninger Danmark"],
    sections: [
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
    ],
    resources: [
      { title: "Microsoft Azure — Officiel dokumentation", href: "https://learn.microsoft.com/da-dk/azure/", desc: "Komplet dokumentation og guides til alle Azure-tjenester og platformens over 200 produkter." },
      { title: "Azure Arkitekturcenter", href: "https://learn.microsoft.com/da-dk/azure/architecture/", desc: "Best practices, referencearkitekturer og design patterns til Azure-løsninger." },
      { title: "Microsoft Azure Pricing Calculator", href: "https://azure.microsoft.com/da-dk/pricing/calculator/", desc: "Officielt kalkulationsværktøj til estimering af Azure-omkostninger for dit projekt." },
    ],
    faq: [
      { q: "Hvad koster en Azure konsulent i Danmark?", a: "Timeprisen ligger generelt mellem 800 og 1.600 DKK i timen. For nearshore-konsulenter kan prisen være betydeligt lavere." },
      { q: "Kan en Azure konsulent arbejde remote?", a: "Ja, de fleste Azure-opgaver kan løses remote. Vi finder konsulenter der matcher din foretrukne arbejdsform." },
    ],
  },
  {
    slug: "cybersecurity",
    title: "cybersecurity konsulent",
    eyebrow: "Cybersecurity & Compliance",
    intro: "Beskyt din virksomhed med de rette sikkerhedsspecialister. Vi finder kvalificerede cybersecurity konsulenter via 70+ partnere — hurtigt og uforpligtende.",
    price: "950 – 1.600 kr/t",
    graphic: "shield",
    metaTitle: "Cybersecurity konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette cybersecurity konsulent gratis. GDPR, ISO 27001, NIS2, penetrationstest og sikkerhedsarkitektur via 70+ leverandører inden for 3 arbejdsdage.",
    metaKeywords: ["cybersecurity konsulent","IT sikkerhed konsulent Danmark","GDPR rådgiver","ISO 27001 konsulent","NIS2 konsulent","penetrationstest","informationssikkerhed konsulent","CISO rådgiver","sikkerhedsarkitektur","gratis cybersecurity konsulent"],
    sections: [
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
    ],
    resources: [
      { title: "Center for Cybersikkerhed (CFCS)", href: "https://www.cfcs.dk/", desc: "Den danske regerings cybersikkerhedsmyndighed med trusselsvurderinger, vejledninger og NIS2-information." },
      { title: "Datatilsynet — GDPR vejledning", href: "https://www.datatilsynet.dk/", desc: "Dansk tilsynsmyndighed for databeskyttelse og GDPR med vejledninger til virksomheder." },
      { title: "ISO/IEC 27001 — Informationssikkerhed", href: "https://www.iso.org/isoiec-27001-information-security.html", desc: "Internationalt anerkendt standard for styring af informationssikkerhed i organisationer." },
    ],
    faq: [
      { q: "Hvad koster en cybersecurity konsulent?", a: "Timepriser varierer typisk mellem 950 og 1.600 kr. afhængigt af specialisering og erfaring. CISO-profiler og specialister inden for penetrationstest ligger i den høje ende, mens compliance-rådgivere typisk er billigere." },
      { q: "Kan I finde konsulenter med ISO 27001 erfaring?", a: "Ja — vi matcher præcist de compliance-krav du har, herunder ISO 27001, GDPR, NIS2 og branchespecifikke standarder som PCI DSS." },
      { q: "Har I konsulenter der kan hjælpe med NIS2-direktivet?", a: "Ja. NIS2 træder i kraft for mange danske virksomheder, og vi har specialister der kender direktivets krav indgående og kan hjælpe med gap-analyse, implementeringsplan og dokumentation." },
    ],
  },
  {
    slug: "data-warehouse",
    title: "data warehouse konsulent",
    eyebrow: "Data & BI",
    intro: "Find erfarne specialister i data warehouse, ETL og dataarkitektur via 70+ leverandører og freelancenetværk.",
    price: "900 – 1.600 kr/t",
    graphic: "database",
    metaTitle: "Data Warehouse konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette data warehouse konsulent gratis. Specialister i DW, ETL, Azure Synapse og Snowflake via 70+ leverandører inden for 3 arbejdsdage.",
    metaKeywords: ["data warehouse konsulent","DW konsulent Danmark","ETL konsulent","Azure Synapse konsulent","Snowflake konsulent","dataarkitektur","database konsulent","BI arkitektur","data platform","gratis data warehouse konsulent"],
    sections: [
      {
        title: "Hvad er en data warehouse konsulent?",
        content: "En data warehouse konsulent er en specialist inden for design, implementering og vedligeholdelse af data warehouse løsninger. De hjælper virksomheder med at konsolidere data fra forskellige kilder og gøre dem tilgængelige for analyse.",
        bullets: [
          "Design og udvikling af data warehouse arkitektur",
          "Data modellering og ETL (Extract, Transform, Load) processer",
          "Implementering af datakvalitetsløsninger",
          "Performance tuning og optimering",
          "Integration med BI-værktøjer som Power BI, Tableau og Qlik",
        ],
      },
      {
        title: "Hvornår har du brug for en data warehouse konsulent?",
        content: "Der er mange situationer, hvor det kan være fordelagtigt at hyre en data warehouse konsulent.",
        bullets: [
          "Implementering af et nyt data warehouse fra bunden",
          "Migrering fra eksisterende løsning til cloud-baseret DW (Azure Synapse, Snowflake, BigQuery)",
          "Optimering af et langsomt eller fejlbehæftet data warehouse",
          "Design af datamodeller og ETL-pipelines",
          "Konsolidering af data fra mange forskellige kildesystemer",
        ],
      },
    ],
    resources: [
      { title: "Azure Synapse Analytics — Dokumentation", href: "https://learn.microsoft.com/da-dk/azure/synapse-analytics/", desc: "Microsofts enterprise analytics platform — officiel dokumentation og arkitekturguides." },
      { title: "Snowflake Data Cloud", href: "https://www.snowflake.com/", desc: "Ledende cloud data platform til moderne data warehousing og analytics." },
      { title: "dbt — Data Build Tool", href: "https://www.getdbt.com/", desc: "Open-source framework der er industristandarden for datatransformation og datakvalitet." },
    ],
    faq: [
      { q: "Hvad koster en data warehouse konsulent?", a: "Timepriser varierer typisk mellem 900 og 1.600 kr. afhængigt af teknologi og erfaring. Snowflake og Azure Synapse-specialister er typisk i den høje ende." },
      { q: "Kan I finde konsulenter med Snowflake eller Azure Synapse?", a: "Ja — vi specificerer præcist hvilken DW-teknologi du arbejder med og finder specialister derefter." },
    ],
  },
  {
    slug: "digital-strategi",
    title: "digital strategi konsulent",
    eyebrow: "Digital strategi & transformation",
    intro: "Sæt retningen for din digitale rejse med erfarne strateger. Vi finder konsulenter der kombinerer teknologisk indsigt med forretningsmæssig forståelse — via 70+ partnere.",
    price: "1.000 – 1.700 kr/t",
    graphic: "globe",
    metaTitle: "Digital strategi konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette digital strategi konsulent gratis. IT-strategi, digital transformation og teknologiledelse via 70+ leverandører inden for 3 arbejdsdage.",
    metaKeywords: ["digital strategi konsulent","digital transformation konsulent","IT strategi rådgivning","CDO rådgiver Danmark","teknologiledelse","digitalisering konsulent","forandringsleder IT","innovationsrådgiver","enterprise arkitekt","gratis digital strategi konsulent"],
    sections: [
      {
        title: "Hvad er digital strategi rådgivning?",
        content: "Digital strategi rådgivning handler om at definere, hvordan teknologi kan drive forretningsvækst og effektivisering. En digital strategi konsulent hjælper ledelsen med at træffe de rette teknologivalg, prioritere investeringer og navigere i et hurtigt skiftende teknologilandskab.",
        bullets: [
          "<strong>IT-strategi:</strong> Langsigtet roadmap der aligner teknologi med forretningens mål.",
          "<strong>Digital transformation:</strong> Systematisk omlægning af processer, kultur og teknologi.",
          "<strong>Teknologiledelse:</strong> CTO/CDO-rådgivning og ledelsessparring om teknologivalg.",
          "<strong>Modenhedsvurdering:</strong> Analyse af virksomhedens digitale modenhed og gaps.",
          "<strong>Forandringsmanagement:</strong> Sikring af organisatorisk adoption af nye løsninger.",
        ],
      },
      {
        title: "Hvad laver en digital strategi konsulent?",
        content: "En digital strategi konsulent arbejder typisk tæt med C-niveau ledelsen og fungerer som bro mellem forretningen og IT. Opgaverne kombinerer strategisk analyse med praktisk implementeringsrådgivning.",
        bullets: [
          "<strong>As-is analyse:</strong> Kortlægning af eksisterende systemer, processer og digitale kapabiliteter.",
          "<strong>Strategiudvikling:</strong> Udarbejdelse af handlingsorienterede digitale strategiplaner.",
          "<strong>Vendor selection:</strong> Uafhængig rådgivning om valg af teknologiplatforme og leverandører.",
          "<strong>Business case:</strong> Udregning af ROI og prioritering af digitale initiativer.",
          "<strong>Implementeringsledelse:</strong> Styring af transformationsprogrammer på tværs af organisationen.",
        ],
      },
      {
        title: "Typiske profiler vi matcher",
        content: "Vores netværk inkluderer konsulenter med erfaring fra både store internationale konsulenthuse og specialiserede boutique-firmaer — alle med dokumenteret transformationserfaring.",
        bullets: [
          "<strong>CDO / vCDO:</strong> Erfarne Chief Digital Officers på deltid eller projektbasis.",
          "<strong>IT-strateger:</strong> Specialister i IT-strategiudvikling og enterprise arkitektur.",
          "<strong>Transformationsledere:</strong> Erfarne programledere der har gennemført store transformationer.",
          "<strong>Innovationsrådgivere:</strong> Eksperter i emerging technologies og disruptive forretningsmodeller.",
          "<strong>Change managers:</strong> Specialister i organisationsforandring og adoptionsledelse.",
        ],
      },
    ],
    resources: [
      { title: "Digitaliseringsstyrelsen", href: "https://www.digst.dk/", desc: "Statens center for digital transformation og IT-strategi i den offentlige og private sektor i Danmark." },
      { title: "McKinsey Digital Insights", href: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights", desc: "Analyser og artikler om digital transformation, teknologitrends og forretningsstrategi." },
      { title: "Gartner IT Research", href: "https://www.gartner.com/en/information-technology", desc: "Internationalt anerkendt analytikerhus med forecast, anbefalinger og strategiske IT-analyser." },
    ],
    faq: [
      { q: "Hvad koster en digital strategi konsulent?", a: "Timepriser varierer typisk mellem 1.000 og 1.700 kr. afhængigt af senioritet og opgavens kompleksitet. Interim CDO/CTO-profiler kan ligge højere." },
      { q: "Kan I finde konsulenter med erfaring fra specifik branche?", a: "Ja — vi matcher på tværs af både kompetencer og brancheerfaring. Fortæl os din branche i forespørgslen, og vi prioriterer leverandører med relevant sektorerfaring." },
      { q: "Er det muligt at få en konsulent til at lave en IT-strategi fra bunden?", a: "Absolut. Vi finder specialister der kan facilitere strategi-workshops, lave as-is analyser og levere et komplet strategidokument med roadmap og prioriterede initiativer." },
    ],
  },
  {
    slug: "erp-crm",
    title: "ERP & CRM konsulent",
    eyebrow: "ERP & CRM",
    intro: "Implementer, optimer eller migrér dine forretningssystemer med de rette specialister. Fra SAP til Dynamics 365 og Salesforce — vi finder eksperterne via 70+ partnere.",
    price: "850 – 1.500 kr/t",
    graphic: "gears",
    metaTitle: "ERP & CRM konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette ERP eller CRM konsulent gratis. SAP S/4HANA, Dynamics 365, Salesforce og systemintegration via 70+ leverandører inden for 3 arbejdsdage.",
    metaKeywords: ["ERP konsulent","CRM konsulent Danmark","SAP konsulent","Dynamics 365 konsulent","Salesforce konsulent","ERP implementering","Navision konsulent","Business Central konsulent","ERP migration","gratis ERP konsulent"],
    sections: [
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
    ],
    resources: [
      { title: "SAP Danmark", href: "https://www.sap.com/denmark/index.html", desc: "Verdens største ERP-leverandør med S/4HANA, SuccessFactors og branchespecifikke løsninger." },
      { title: "Microsoft Dynamics 365", href: "https://dynamics.microsoft.com/da-dk/", desc: "Microsofts ERP- og CRM-platform integreret med Azure, Microsoft 365 og Power Platform." },
      { title: "Salesforce Danmark", href: "https://www.salesforce.com/dk/", desc: "Verdens mest udbredte CRM-platform til salg, service, marketing og commerce." },
    ],
    faq: [
      { q: "Hvad koster en ERP konsulent?", a: "Timepriser varierer typisk mellem 850 og 1.500 kr. SAP-specialister og Salesforce-arkitekter ligger i den høje ende, mens implementeringskonsulenter til mindre platforme er billigere." },
      { q: "Kan I finde konsulenter til en SAP-migration?", a: "Ja — vi har adgang til SAP-specialister via vores netværk af godkendte konsulenthuse. Specificér hvilke SAP-moduler og versioner du har brug for, og vi matcher præcist." },
      { q: "Hvad med integrationer til tredjepartssystemer?", a: "Mange ERP/CRM-projekter kræver integrationer. Vi kan matche konsulenter med erfaring i API-integration, middleware-platforme og specifik konnektorer til de systemer du bruger." },
    ],
  },
  {
    slug: "infrastruktur",
    title: "infrastruktur konsulent",
    eyebrow: "Infrastruktur",
    intro: "Byg og optimer din IT-infrastruktur med erfarne specialister. Fra netværksdesign til serverarkitektur og driftsoptimering — vi finder det rette match via 70+ partnere.",
    price: "750 – 1.300 kr/t",
    graphic: "network",
    metaTitle: "Infrastruktur konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette infrastruktur konsulent gratis. Netværk, serverarkitektur, virtualisering og backup via 70+ leverandører inden for 3 arbejdsdage.",
    metaKeywords: ["infrastruktur konsulent","IT infrastruktur Danmark","netværk konsulent","server konsulent","VMware konsulent","Cisco netværk","cloud infrastruktur","datacenter konsulent","hybrid cloud infrastruktur","gratis infrastruktur konsulent"],
    sections: [
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
    ],
    resources: [
      { title: "Cisco — Netværksløsninger til virksomheder", href: "https://www.cisco.com/c/en_dk/", desc: "Verdens ledende leverandør af netværksudstyr og sikkerhedsløsninger til virksomheder." },
      { title: "VMware by Broadcom", href: "https://www.vmware.com/", desc: "Markedsleder inden for servervirtualisering, cloud-infrastruktur og datacenterplatforme." },
      { title: "Azure Hybrid & Infrastructure", href: "https://azure.microsoft.com/da-dk/solutions/hybrid-cloud-and-infrastructure/", desc: "Microsofts løsninger til hybrid cloud-infrastruktur og on-premise/cloud integration." },
    ],
    faq: [
      { q: "Hvad koster en infrastruktur konsulent?", a: "Timepriser varierer typisk mellem 750 og 1.300 kr. Netværks- og infrastrukturspecialister med certifikationer fra Cisco eller VMware ligger typisk i den høje ende." },
      { q: "Kan I finde konsulenter til en on-premise til cloud migration?", a: "Ja — vi finder specialister med erfaring i lige præcis den platform du bruger, hvad enten det er Azure, AWS, GCP eller en hybrid løsning." },
      { q: "Hvad med ITIL og driftsprocesser?", a: "Vi matcher også konsulenter med stærk ITIL-baggrund der kan hjælpe med at strukturere driftsprocesser, change management og incident management." },
    ],
  },
  {
    slug: "it-konsulent",
    title: "IT konsulent",
    eyebrow: "IT konsulenter",
    intro: "Din partner i jagten på de rette IT-konsulenter. Vi finder de bedste kandidater til dine specifikke behov via 70+ leverandører.",
    graphic: "people",
    metaTitle: "IT konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette IT konsulent gratis via multi-sourcing. 70+ partnere præsenterer 4–9 screenede kandidater inden for 3 arbejdsdage. Alle IT-discipliner dækket.",
    metaKeywords: ["IT konsulent","IT konsulent Danmark","freelance IT konsulent","IT rådgiver","find IT konsulent","IT konsulenthjælp","IT specialist","gratis IT konsulent","IT konsulent rekruttering","IT konsulent til leje"],
    sections: [
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
    ],
    resources: [
      { title: "PROSA — Forbund for IT-specialister", href: "https://www.prosa.dk/", desc: "Dansk fagforening for IT-professionelle med indsigt i lønniveauer og markedsvilkår." },
      { title: "DI Digital — IT i dansk erhvervsliv", href: "https://www.danskindustri.dk/di-digital/", desc: "Dansk Industris digitale videnscenter med rapporter og analyser om IT i erhvervslivet." },
    ],
    faq: [
      { q: "Hvad koster det at bruge FindITkonsulenter.dk?", a: "Vores service er helt gratis for kunder. Vi tjener vores penge via samarbejde med leverandørnetværket." },
      { q: "Hvor lang tid tager det?", a: "Vi præsenterer typisk de første kandidater inden for 3 arbejdsdage efter vi har modtaget din forespørgsel." },
    ],
  },
  {
    slug: "it-projektleder",
    title: "IT projektleder",
    eyebrow: "Projekt- & forandringsledelse",
    intro: "Find en erfaren IT projektleder til at styre dit næste projekt sikkert i mål — via 70+ leverandører og freelancenetværk.",
    price: "900 – 1.800 kr/t",
    graphic: "gears",
    metaTitle: "IT projektleder — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette IT projektleder gratis. PMP, PRINCE2, Scrum Master og agile coaches via 70+ leverandører. Profiler inden for 3 arbejdsdage.",
    metaKeywords: ["IT projektleder","IT projektleder Danmark","projekt manager IT","Scrum Master","agile coach","PRINCE2 konsulent","PMP projektleder","forandringsleder","PMO konsulent","gratis IT projektleder"],
    sections: [
      {
        title: "Hvad er en IT projektleder?",
        content: "En IT projektleder er ansvarlig for at planlægge, organisere, udføre og afslutte et IT-projekt. Deres primære mål er at sikre, at projektet leveres til tiden, inden for budgettet og med den ønskede kvalitet.",
        bullets: [
          "Definering af projektets omfang og mål",
          "Udvikling af en detaljeret projektplan",
          "Allokering af ressourcer og budgettering",
          "Ledelse og motivering af projektteamet",
          "Identifikation og håndtering af risici",
          "Kommunikation med interessenter og styregruppe",
        ],
      },
      {
        title: "Fordele ved at bruge FindITkonsulenter.dk",
        content: "Vi gør det nemt og gratis at finde den rette IT projektleder til dit projekt.",
        bullets: [
          "<strong>Gratis og uforpligtende:</strong> Vores service er helt gratis for virksomheder.",
          "<strong>Tidsbesparende:</strong> Vi håndterer hele processen med at kontakte leverandører.",
          "<strong>Bredt udvalg:</strong> Adgang til et netværk af 70+ konsulenthuse og freelanceplatforme.",
          "<strong>Ekspertrådgivning:</strong> Vi hjælper dig med at definere den rette kompetenceprofil.",
          "<strong>Prissammenligning:</strong> Vi benchmarker priser på tværs af markedet.",
        ],
      },
    ],
    resources: [
      { title: "Project Management Institute (PMI)", href: "https://www.pmi.org/", desc: "Verdens største organisation for projektledelse — certificeringer, standarder og vidensbase." },
      { title: "PRINCE2 — Axelos", href: "https://www.axelos.com/certifications/propath/prince2-project-management", desc: "Internationalt anerkendt projektledelsesmetode og certificeringsprogram." },
      { title: "Scrum.org", href: "https://www.scrum.org/", desc: "Officiel ressource for Scrum-metoden, Professional Scrum certificeringer og agile guides." },
    ],
    faq: [
      { q: "Hvad koster en IT projektleder?", a: "Timepriser for IT projektledere varierer typisk mellem 900 og 1.800 kr. afhængigt af erfaring og certificeringer som PMP, PRINCE2 eller Scrum Master." },
      { q: "Kan I finde Scrum Masters og agile coaches?", a: "Ja — vi finder specialister inden for alle projektledelsesmetoder inkl. Scrum, SAFe, PRINCE2 og klassisk vandfaldsmodel." },
    ],
  },
  {
    slug: "nearshore",
    title: "nearshore konsulenter",
    eyebrow: "Nearshore – Offshore",
    intro: "Adgang til høj kvalitet til lavere priser. Vi finder nearshore IT-specialister fra nærområdet via 70+ partnere.",
    price: "400 – 900 kr/t",
    graphic: "globe",
    metaTitle: "Nearshore konsulenter — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find nearshore IT konsulenter gratis. Specialister fra Polen, Rumænien, Tjekkiet og Serbien til 40–60% lavere priser via 70+ leverandører.",
    metaKeywords: ["nearshore konsulenter","nearshore IT Danmark","offshore IT konsulenter","IT outsourcing","nearshore softwareudvikling","billige IT konsulenter","Polen IT konsulenter","Rumænien IT konsulenter","nearshore rekruttering","gratis nearshore konsulenter"],
    sections: [
      {
        title: "Hvad er nearshoring?",
        content: "Nearshore refererer til outsourcing af forretningsprocesser eller tjenester til et land, der ligger geografisk tæt på din lokation. Det indebærer typisk minimal tidsforskel, kulturelle ligheder og nem adgang for rejser og kommunikation.",
        bullets: [
          "<strong>Nearshore:</strong> Outsourcing til nærliggende lande — f.eks. Polen, Tjekkiet, Rumænien.",
          "<strong>Offshoring:</strong> Outsourcing til fjerne lande med store tidsforskelle.",
          "<strong>Onshoring:</strong> Outsourcing til leverandør inden for samme land.",
        ],
      },
      {
        title: "Fordele ved nearshore outsourcing",
        content: "Nearshore outsourcing tilbyder en god balance mellem omkostningsbesparelser og nem kommunikation.",
        bullets: [
          "<strong>Reducerede omkostninger:</strong> Typisk 40–60% lavere lønomkostninger end danske konsulenter.",
          "<strong>Adgang til specialiserede kompetencer:</strong> Bred pulje af talentfulde fagfolk.",
          "<strong>Tidszonekompatibilitet:</strong> Minimal tidsforskel letter realtidskommunikation.",
          "<strong>Kulturel lighed:</strong> Kulturelle ligheder reducerer misforståelser.",
          "<strong>Nem adgang:</strong> Geografisk nærhed gør det nemmere at besøge og bygge relationer.",
        ],
      },
    ],
    resources: [
      { title: "Invest in Denmark", href: "https://investindenmark.com/", desc: "Officiel portal for internationale virksomheder og samarbejde med danske virksomheder." },
      { title: "DI Digital — IT-outsourcing", href: "https://www.danskindustri.dk/di-digital/", desc: "Dansk Industris vejledning og anbefalinger til IT-outsourcing og leverandørstyring." },
    ],
    faq: [
      { q: "Hvilke lande tilbyder I nearshore fra?", a: "Vi har partnere i bl.a. Polen, Tjekkiet, Rumænien, Ukraine, Serbien og Indien. Vi finder det bedste match baseret på dine krav." },
      { q: "Hvad koster nearshore IT konsulenter?", a: "Typisk 400–900 kr/t afhængigt af land og specialisering — betydeligt lavere end danske priser." },
      { q: "Kan nearshore konsulenter arbejde onsite?", a: "Ja, mange nearshore konsulenter er villige til at rejse for kortere perioder. Vi afklarer arbejdsformen i forespørgslen." },
    ],
  },
  {
    slug: "power-bi",
    title: "Power BI konsulent",
    eyebrow: "Data & BI",
    intro: "Få styr på din data med de rette Power BI specialister. Vi finder kvalificerede kandidater via 70+ partnere.",
    price: "750 – 1.400 kr/t",
    graphic: "chart",
    metaTitle: "Power BI konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette Power BI konsulent gratis. Datavisualisering, BI-løsninger og DAX via 70+ leverandører. Screenede profiler inden for 3 arbejdsdage.",
    metaKeywords: ["Power BI konsulent","Power BI specialist Danmark","Power BI rådgivning","BI konsulent","datavisualisering konsulent","DAX konsulent","Microsoft Power BI","business intelligence konsulent","Power BI dashboard","gratis Power BI konsulent"],
    sections: [
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
    ],
    resources: [
      { title: "Microsoft Power BI — Officiel hjemmeside", href: "https://powerbi.microsoft.com/da-dk/", desc: "Officiel produktside med licenser, funktioner og kundecases for Microsoft Power BI." },
      { title: "Power BI Dokumentation", href: "https://learn.microsoft.com/da-dk/power-bi/", desc: "Komplet teknisk dokumentation og læringsressourcer fra Microsoft til Power BI." },
      { title: "Power BI Community", href: "https://community.powerbi.com/", desc: "Officielt Power BI-forum med over 400.000 medlemmer — tips, templates og eksperthjælp." },
    ],
    faq: [
      { q: "Hvad koster en Power BI konsulent?", a: "Timepriser varierer typisk mellem 750 og 1.400 kr. afhængigt af erfaring og opgavens kompleksitet." },
      { q: "Kan I finde konsulenter med DAX og datamodellering?", a: "Ja — vi specificerer præcist hvilke Power BI kompetencer du har brug for og matcher derefter." },
    ],
  },
  {
    slug: "sharepoint",
    title: "SharePoint konsulent",
    eyebrow: "Microsoft-teknologi",
    intro: "Find erfarne SharePoint-specialister til implementering, optimering og integration — via 70+ leverandører.",
    price: "800 – 1.500 kr/t",
    graphic: "shield",
    metaTitle: "SharePoint konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette SharePoint konsulent gratis. Implementering, migration og Microsoft 365-integration via 70+ leverandører inden for 3 arbejdsdage.",
    metaKeywords: ["SharePoint konsulent","SharePoint specialist Danmark","SharePoint Online konsulent","SharePoint implementering","SharePoint migration","Microsoft 365 konsulent","SharePoint intranet","Power Platform konsulent","SharePoint rådgivning","gratis SharePoint konsulent"],
    sections: [
      {
        title: "Hvorfor investere i SharePoint konsulenter?",
        content: "SharePoint er en kraftfuld platform der kan forbedre samarbejdet, strømline arbejdsgange og øge produktiviteten. Men for at realisere det fulde potentiale kræver det specialiseret viden.",
        bullets: [
          "<strong>Ekspertise og erfaring:</strong> Dybdegående viden om SharePoint og best practices.",
          "<strong>Tilpasning til jeres behov:</strong> Skræddersy SharePoint til jeres forretningsprocesser.",
          "<strong>Effektiv implementering:</strong> Hurtig opsætning der minimerer forstyrrelser.",
          "<strong>Træning og support:</strong> Oplæring af medarbejdere og løbende support.",
          "<strong>Fejlfinding og optimering:</strong> Identificer og løs problemer og optimer ydeevne.",
        ],
      },
      {
        title: "Hvad laver en SharePoint konsulent?",
        content: "SharePoint konsulenter dækker et bredt spektrum af opgaver fra grundlæggende konfiguration til komplekse integrationer.",
        bullets: [
          "Design og konfiguration af SharePoint-miljøer",
          "Migrering fra ældre versioner og andre platforme",
          "Integration med Microsoft 365, Teams og Power Platform",
          "Udvikling af tilpassede workflows og løsninger",
          "Governance og sikkerhedsopsætning",
        ],
      },
    ],
    resources: [
      { title: "Microsoft SharePoint — Officiel produktside", href: "https://www.microsoft.com/da-dk/microsoft-365/sharepoint/collaboration", desc: "Officiel produktside med funktioner og priser for SharePoint Online og Microsoft 365." },
      { title: "SharePoint Dokumentation", href: "https://learn.microsoft.com/da-dk/sharepoint/", desc: "Teknisk dokumentation og udviklingsguides til SharePoint fra Microsoft." },
      { title: "Microsoft 365 Adoption Hub", href: "https://adoption.microsoft.com/da-dk/", desc: "Ressourcer og guides til adoption af Microsoft 365 og SharePoint i organisationen." },
    ],
    faq: [
      { q: "Kan I finde konsulenter til SharePoint Online?", a: "Ja — vi finder specialister i både SharePoint Online (Microsoft 365) og on-premise SharePoint." },
      { q: "Hvad koster en SharePoint konsulent?", a: "Timepriser ligger typisk mellem 800 og 1.500 kr. afhængigt af erfaring og om det er SharePoint Online eller on-premise." },
    ],
  },
  {
    slug: "softwareudvikling",
    title: "softwareudvikler",
    eyebrow: "Softwareudvikling",
    intro: "Find de rette udviklere til dit næste projekt. Fra frontend og backend til fullstack og DevOps — vi aktiverer markedet og finder de bedste profiler via 70+ partnere.",
    price: "700 – 1.400 kr/t",
    graphic: "gears",
    metaTitle: "Softwareudvikler konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette softwareudvikler gratis. Frontend, backend, fullstack, React, .NET og DevOps engineering via 70+ leverandører inden for 3 arbejdsdage.",
    metaKeywords: ["softwareudvikler","softwareudvikler konsulent Danmark","freelance softwareudvikler","React konsulent","fullstack developer","backend developer","DevOps konsulent",".NET udvikler","Node.js udvikler","gratis softwareudvikler"],
    sections: [
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
    ],
    resources: [
      { title: "PROSA — Forbund for IT-specialister", href: "https://www.prosa.dk/", desc: "Dansk fagforbund for IT-professionelle med lønstatistik, markedsviden og brancheguides." },
      { title: "Stack Overflow Developer Survey", href: "https://survey.stackoverflow.co/2024/", desc: "Årets globale developer survey med indsigt i de mest brugte teknologier, løn og karrieretrends." },
      { title: "The Twelve-Factor App", href: "https://12factor.net/", desc: "Anerkendte best practices for modern, cloud-native og vedligeholdbar softwareudvikling." },
    ],
    faq: [
      { q: "Hvad koster en softwareudvikler konsulent?", a: "Timepriser varierer typisk mellem 700 og 1.400 kr. afhængigt af senioritet, teknologi og specialisering. Seniore fullstack udviklere og DevOps-specialister ligger typisk i den høje ende." },
      { q: "Kan I finde udviklere til en specifik teknologi?", a: "Ja — specificér præcist hvilke teknologier du har brug for, og vi matcher med konsulenter der har dokumenteret erfaring med netop den stack." },
      { q: "Er det muligt at forlænge en konsulentaftale undervejs?", a: "Det aftaler du direkte med leverandøren. De fleste konsulentaftaler er fleksible og kan forlænges efter gensidig aftale." },
    ],
  },
  {
    slug: "support",
    title: "IT support konsulent",
    eyebrow: "Support & Service Desk",
    intro: "Styrk din IT-supportfunktion med erfarne specialister. Fra 1st line support til service desk ledelse og ITIL-implementering — vi finder det rette match via 70+ partnere.",
    price: "350 – 750 kr/t",
    graphic: "people",
    metaTitle: "IT Support & Service Desk konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
    metaDescription: "Find den rette IT support eller service desk konsulent gratis. ITIL, 1st/2nd/3rd line support og servicedesk-ledelse via 70+ leverandører inden for 3 arbejdsdage.",
    metaKeywords: ["IT support konsulent","service desk konsulent","ITIL konsulent Danmark","helpdesk konsulent","IT supportdækning","servicedesk manager","ITSM konsulent","ServiceNow konsulent","TOPdesk konsulent","gratis IT support konsulent"],
    sections: [
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
    ],
    resources: [
      { title: "itSMF Danmark", href: "https://www.itsmf.dk/", desc: "Dansk brancheorganisation for IT-servicemanagement og ITIL-praksis." },
      { title: "ITIL 4 Foundation — Axelos", href: "https://www.axelos.com/certifications/itil-service-management/itil-4-foundation", desc: "Globalt anerkendt certificering inden for IT-servicemanagement og service desk best practices." },
      { title: "ServiceNow", href: "https://www.servicenow.com/", desc: "Markedsledende ITSM-platform til servicedesk, procesautomatisering og workflow management." },
    ],
    faq: [
      { q: "Hvad koster en IT support konsulent?", a: "Timepriser varierer typisk mellem 350 og 750 kr. 1st line support er billigst, mens erfarne service desk managers og ITSM-arkitekter ligger i den høje ende." },
      { q: "Kan I finde konsulenter til en midlertidig supportdækning?", a: "Ja — vi matcher både korte vikariater og længere projektopgaver. Specificér varighed og tidspunkter i din forespørgsel." },
      { q: "Kan I hjælpe med at implementere ServiceNow eller TOPdesk?", a: "Absolut. Vi finder specialister der kender den specifikke platform du bruger, og som kan hjælpe med konfiguration, tilpasning og træning." },
    ],
  },
];

export function getConsultantPage(slug: string): ConsultantPageData | undefined {
  return consultantPages.find(p => p.slug === slug);
}
