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
