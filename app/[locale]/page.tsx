import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import LogoBar from "@/components/sections/LogoBar";
import StatsCounter from "@/components/sections/StatsCounter";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyUs from "@/components/sections/WhyUs";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Partners from "@/components/sections/Partners";
import CTA from "@/components/sections/CTA";

export const metadata: Metadata = {
  title: "FindITconsultants.com — Gratis IT-konsulent matching | 70+ leverandører",
  description:
    "Gratis og uforpligtende multi-sourcing service. Beskriv dit IT-behov — vi aktiverer 70+ konsulenthuse og præsenterer 4–9 screenede profiler inden for 3 arbejdsdage.",
  alternates: {
    canonical: "https://finditconsultants.com",
  },
  openGraph: {
    title: "FindITconsultants.com — Gratis IT-konsulent matching",
    description:
      "Beskriv dit IT-behov og modtag 4–9 screenede konsulentprofiler inden for 3 arbejdsdage — helt gratis.",
    url: "https://finditconsultants.com",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LogoBar />
        <StatsCounter />
        <HowItWorks />
        <WhyUs />
        <Services />
        <Testimonials />
        <FAQ />
        <Partners />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
