import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NextPage from "@/components/NextPage";
import Contact from "@/components/Contact";
import Ribbons from "@/components/Ribbons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Buzz Crew — email, phone, Instagram or the project form.",
};

export default function ContactPage() {
  return (
    <main id="main-content" className="page">
      <PageHero
        id="contact"
        eyebrow="Looking ahead"
        title={["Let’s make", { accent: "something" }, "worth sharing."]}
        lead="Tell us about your brand, your goals and what’s not working today. We’ll take it from there."
        stickers={["chat", "rocket", "spark"]}
        marquee="Say hello"
      />
      <Contact />
      <Ribbons set="cta" />
      <NextPage id="contact" />
    </main>
  );
}
