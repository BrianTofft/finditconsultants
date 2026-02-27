import ConsultantPage from "@/components/ConsultantPage";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Nearshore konsulenter — Gratis multi-sourcing | FindITkonsulenter.dk",
  description: "Find nearshore IT konsulenter gratis. Specialister fra nærområdet til lavere priser via 70+ leverandører.",
};
export default function NearshoreKonsulenterPage() {
  return (
    <ConsultantPage
      title="nearshore konsulenter"
      eyebrow="Nearshore – Offshore"
      hero={<>Gratis multi-sourcing af <span className="text-orange italic">nearshore konsulenter</span></>}
      intro="Adgang til høj kvalitet til lavere priser. Vi finder nearshore IT-specialister fra nærområdet via 70+ partnere."
      price="400 – 900 kr/t"
      graphic="globe"
      sections={[
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
      ]}
      faq={[
        { q: "Hvilke lande tilbyder I nearshore fra?", a: "Vi har partnere i bl.a. Polen, Tjekkiet, Rumænien, Ukraine, Serbien og Indien. Vi finder det bedste match baseret på dine krav." },
        { q: "Hvad koster nearshore IT konsulenter?", a: "Typisk 400–900 kr/t afhængigt af land og specialisering — betydeligt lavere end danske priser." },
        { q: "Kan nearshore konsulenter arbejde onsite?", a: "Ja, mange nearshore konsulenter er villige til at rejse for kortere perioder. Vi afklarer arbejdsformen i forespørgslen." },
      ]}
    />
  );
}
