import HeroStory from "@/components/HeroStory";
import ResultsPanel from "@/components/ResultsPanel";
import Manifesto from "@/components/Manifesto";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import Compare from "@/components/Compare";
import Process from "@/components/Process";
import Clients from "@/components/Clients";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import DialService from "@/components/DialService";
import Ribbons from "@/components/Ribbons";

export default function HomePage() {
  return (
    <main id="main-content">
        <HeroStory />
        <ResultsPanel />
        <Ribbons set="services" />
        <Manifesto />
        <About />
        <Services />
        <Work />
        <Compare />
        <Process />
        <Clients />
        <Team />
        <Testimonials />
        <DialService />
        <Ribbons set="cta" />
        <Contact />
    </main>
  );
}
