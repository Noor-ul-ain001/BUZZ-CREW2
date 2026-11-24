import HeroStory from "@/components/HeroStory";
import ResultsPanel from "@/components/ResultsPanel";
import About from "@/components/About";
import Services from "@/components/Services";
import Work from "@/components/Work";
import DialService from "@/components/DialService";
import Ribbons from "@/components/Ribbons";

export default function HomePage() {
  return (
    <main id="main-content">
        <HeroStory />
        <ResultsPanel />
        <Ribbons set="services" />
        <About compact />
        <Services limit={6} />
        <Work />
        <DialService />
    </main>
  );
}
