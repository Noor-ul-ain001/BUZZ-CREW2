import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NextPage from "@/components/NextPage";
import Work from "@/components/Work";
import Clients from "@/components/Clients";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected campaign creatives, client brands and what they say about working with Buzz Crew.",
};

export default function WorkPage() {
  return (
    <main id="main-content" className="page">
      <PageHero
        id="work"
        eyebrow="Selected work"
        title={["The feed", { accent: "we build" }, "for brands."]}
        lead="Campaign creatives, service launches and content series — plus the brands we grow across industries and borders."
        stickers={["camera", "play", "trophy"]}
        marquee="Our work"
      />
      <Work />
      <Clients />
      <Testimonials />
      <NextPage id="work" />
    </main>
  );
}
