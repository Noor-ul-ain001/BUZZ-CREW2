import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NextPage from "@/components/NextPage";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Team",
  description: "The crew behind Buzz Crew — founders, departments and the values that drive us.",
};

export default function TeamPage() {
  return (
    <main id="main-content" className="page">
      <PageHero
        id="team"
        eyebrow="The crew"
        title={["One team.", { accent: "Multiple" }, "strengths."]}
        lead="Founders who lead from the front, departments that move as one, and values that keep every project honest."
        stickers={["brain", "chat", "heart"]}
        marquee="The crew"
      />
      <Team />
      <Testimonials />
      <NextPage id="team" />
    </main>
  );
}
