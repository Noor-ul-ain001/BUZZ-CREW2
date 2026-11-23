import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NextPage from "@/components/NextPage";
import Services from "@/components/Services";
import DialService from "@/components/DialService";
import ResultsPanel from "@/components/ResultsPanel";
import Ribbons from "@/components/Ribbons";

export const metadata: Metadata = {
  title: "Services",
  description: "Eleven disciplines under one roof — digital marketing, SEO, design, web, video, AI content and more.",
};

export default function ServicesPage() {
  return (
    <main id="main-content" className="page">
      <PageHero
        id="services"
        eyebrow="What we do"
        title={["Eleven", { accent: "disciplines." }, "One crew."]}
        lead="Marketing, design, web, video and AI-assisted content working together as one organised team — one plan, not eleven vendors."
        stickers={["megaphone", "palette", "laptop"]}
        marquee="Services"
      />
      <Services />
      <DialService />
      <ResultsPanel />
      <Ribbons set="services" />
      <NextPage id="services" />
    </main>
  );
}
