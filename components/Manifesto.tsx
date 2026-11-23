"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import Sticker, { type StickerName } from "@/components/Sticker";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Piece =
  | { t: "soft" | "strong"; text: string }
  | { t: "sticker"; name: StickerName }
  | { t: "logo" }
  | { t: "tagged"; text: string; tags: { label: string; tone: string; pos: "top" | "bottom"; rot: number }[] };

const SENTENCE =
  "Designing stories that move people. Crafting meaningful and measurable digital experiences. Buzz Crew is a full-service creative company that brings brands, stories, and experiences to life through strategy, design, and technology.";

const PIECES: Piece[] = [
  { t: "soft", text: "Designing" },
  {
    t: "tagged",
    text: "stories",
    tags: [
      { label: "Strategy first", tone: "pink", pos: "top", rot: -6 },
      { label: "Story-led", tone: "cyan", pos: "bottom", rot: 4 },
    ],
  },
  { t: "soft", text: "that" },
  { t: "strong", text: "move people." },
  { t: "sticker", name: "arrow" },
  { t: "sticker", name: "globe" },
  { t: "sticker", name: "asterisk" },
  { t: "soft", text: "Crafting" },
  {
    t: "tagged",
    text: "meaningful",
    tags: [
      { label: "and measurable", tone: "peach", pos: "bottom", rot: -5 },
    ],
  },
  { t: "strong", text: "digital experiences." },
  { t: "sticker", name: "eyes" },
  { t: "strong", text: "Buzz Crew" },
  { t: "soft", text: "— is a" },
  {
    t: "tagged",
    text: "full-service",
    tags: [
      { label: "since 2022", tone: "cyan", pos: "top", rot: 5 },
      { label: "PK · UAE · UK", tone: "pink", pos: "bottom", rot: -4 },
    ],
  },
  { t: "sticker", name: "pill" },
  { t: "strong", text: "creative company" },
  { t: "soft", text: "that brings" },
  { t: "strong", text: "brands, stories," },
  { t: "soft", text: "and" },
  { t: "sticker", name: "head" },
  { t: "strong", text: "experiences" },
  { t: "soft", text: "to life through" },
  { t: "strong", text: "strategy, design," },
  { t: "soft", text: "and" },
  { t: "sticker", name: "pixels" },
  { t: "strong", text: "technology." },
  { t: "logo" },
];

function renderPiece(p: Piece, i: number): ReactNode {
  switch (p.t) {
    case "soft":
      return <span key={i} className="mf__soft">{p.text}</span>;
    case "strong":
      return <span key={i} className="mf__strong">{p.text}</span>;
    case "sticker":
      return <Sticker key={i} name={p.name} className="mf__sticker" />;
    case "logo":
      return (
        <span key={i} className="mf__logo">
          <Image src="/images/logo-mark.png" alt="" width={441} height={396} sizes="120px" />
        </span>
      );
    case "tagged":
      return (
        <span key={i} className="mf__tagged">
          <span className="mf__strong">{p.text}</span>
          {p.tags.map((tag) => (
            <span
              key={tag.label}
              className={`mf__tag mf__tag--${tag.tone} mf__tag--${tag.pos}`}
              style={{ "--rot": `${tag.rot}deg` } as React.CSSProperties}
            >
              {tag.label}
            </span>
          ))}
        </span>
      );
  }
}

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = root.current!;
        const pin = section.querySelector<HTMLElement>(".mf__pin")!;
        const panel = section.querySelector<HTMLElement>(".mf__panel")!;
        const track = section.querySelector<HTMLElement>(".mf__track")!;
        const stickers = gsap.utils.toArray<HTMLElement>(".mf__sticker, .mf__logo", section);
        const tags = gsap.utils.toArray<HTMLElement>(".mf__tag", section);
        const floaters = gsap.utils.toArray<HTMLElement>(".mf__floater", section);

        const distance = () => track.scrollWidth - panel.clientWidth + panel.clientWidth * 0.12;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance() * 1.1}`,
            pin,
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          track,
          { x: () => panel.clientWidth * 0.55 },
          { x: () => -distance() + panel.clientWidth * 0.06, ease: "none", duration: 1 },
          0,
        );

        floaters.forEach((f, i) => {
          tl.fromTo(f, { y: 40 * (i % 2 ? 1 : -1), rotation: -20 }, { y: -60 * (i % 2 ? 1 : -1), rotation: 40, ease: "none", duration: 1 }, 0);
        });

        // Stickers and tags pop as they cross into view.
        [...stickers, ...tags].forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 0.2, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              ease: "back.out(2.2)",
              duration: 0.5,
              scrollTrigger: {
                trigger: el,
                containerAnimation: tl,
                start: "left 92%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mf" aria-label="Who we are, in one sentence">
      <div className="mf__pin">
        <div className="mf__panel">
          <p className="sr-only">{SENTENCE}</p>
          <Sticker name="asterisk" className="mf__floater mf__floater--a" />
          <Sticker name="ring" className="mf__floater mf__floater--b" />
          <Sticker name="asterisk" className="mf__floater mf__floater--c" />
          <div className="mf__track" aria-hidden="true">
            {PIECES.map(renderPiece)}
          </div>
          <div className="mf__progress" aria-hidden="true">
            <span>Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}
