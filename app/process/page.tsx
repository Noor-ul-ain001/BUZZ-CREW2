import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NextPage from "@/components/NextPage";
import Process from "@/components/Process";
import Compare from "@/components/Compare";
import Ribbons from "@/components/Ribbons";

export const metadata: Metadata = {
  title: "Process",
  description: "How Buzz Crew works — from discovery and strategy to execution, reporting and growth.",
};

export default function ProcessPage() {
  return (
    <main id="main-content" className="page">
      <PageHero
        id="process"
        eyebrow="How we work"
        title={["From idea", { accent: "to" }, "execution."]}
        lead="A repeatable four-step process behind every account, so you always know what we’re doing, why, and what it’s delivering."
        stickers={["bulb", "target", "rocket"]}
        marquee="Process"
      />
      <Process />
      <Compare />
      <Ribbons set="services" />
      <NextPage id="process" />
    </main>
  );
}
