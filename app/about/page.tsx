import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NextPage from "@/components/NextPage";
import About from "@/components/About";
import Manifesto from "@/components/Manifesto";
import Ribbons from "@/components/Ribbons";

export const metadata: Metadata = {
  title: "About",
  description: "Who Buzz Crew is — a full-service creative and digital agency from Karachi, founded in 2022.",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="page">
      <PageHero
        id="about"
        eyebrow="Who we are"
        title={["We are", { accent: "storytellers" }, "with a strategy."]}
        lead="A full-service creative & digital agency from Karachi, partnering with brands across Pakistan, the UAE and the UK since 2022."
        stickers={["globe", "heart", "spark"]}
        marquee="About us"
      />
      <About />
      <Manifesto />
      <Ribbons set="services" />
      <NextPage id="about" />
    </main>
  );
}
