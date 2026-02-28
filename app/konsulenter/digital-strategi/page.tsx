import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital strategi konsulent — Gratis multi-sourcing | FindITkonsulenter.dk",
  description: "Find den rette digital strategi konsulent gratis. IT-strategi, digital transformation og teknologiledelse via 70+ leverandører.",
};

export default function DigitalStrategiPage() {
  return (
    <ConsultantPage
      title="digital strategi konsulent"
      eyebrow="Digital strategi & transformation"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">digital strategi konsulenter</span></>}
      intro="Sæt retningen for din digitale rejse med erfarne strateger. Vi finder konsulenter der kombinerer teknologisk indsigt med forretningsmæssig forståelse — via 70+ partnere."
      price="1.000 – 1.700 kr/t"
      graphic="globe"
      sections={[
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
      ]}
      faq={[
        {
          q: "Hvad koster en digital strategi konsulent?",
          a: "Timepriser varierer typisk mellem 1.000 og 1.700 kr. afhængigt af senioritet og opgavens kompleksitet. Interim CDO/CTO-profiler kan ligge højere.",
        },
        {
          q: "Kan I finde konsulenter med erfaring fra specifik branche?",
          a: "Ja — vi matcher på tværs af både kompetencer og brancheerfaring. Fortæl os din branche i forespørgslen, og vi prioriterer leverandører med relevant sektorerfaring.",
        },
        {
          q: "Er det muligt at få en konsulent til at lave en IT-strategi fra bunden?",
          a: "Absolut. Vi finder specialister der kan facilitere strategi-workshops, lave as-is analyser og levere et komplet strategidokument med roadmap og prioriterede initiativer.",
        },
      ]}
    />
  );
}
