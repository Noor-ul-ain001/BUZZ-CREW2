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

const SENTENCE = "Designing stories that move people. Buzz Crew brings brands to life through strategy, design and technology.";

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
  {
    t: "tagged",
    text: "Buzz Crew",
    tags: [{ label: "since 2022", tone: "peach", pos: "top", rot: 5 }],
  },
  { t: "soft", text: "brings brands to life through" },
  { t: "strong", text: "strategy, design" },
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
        const words = gsap.utils.toArray<HTMLElement>(".mf__soft, .mf__strong", section);
        const ghost = section.querySelector<HTMLElement>(".mf__ghost")!;
        const bar = section.querySelector<HTMLElement>(".mf__progress-bar i")!;
        const num = section.querySelector<HTMLElement>(".mf__progress-num")!;
        const skew = gsap.quickTo(track, "skewX", { duration: 0.4, ease: "power3.out" });
        let idle = 0;

        const distance = () => track.scrollWidth - panel.clientWidth + panel.clientWidth * 0.12;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance() * 0.75}`,
            pin,
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(bar, { scaleX: self.progress });
              num.textContent = String(Math.round(self.progress * 100)).padStart(2, "0");
              skew(gsap.utils.clamp(-10, 10, self.getVelocity() / -300));
              window.clearTimeout(idle);
              idle = window.setTimeout(() => skew(0), 120);
            },
          },
        });

        tl.fromTo(
          track,
          { x: () => panel.clientWidth * 0.3 },
          { x: () => -distance() + panel.clientWidth * 0.06, ease: "none", duration: 1 },
          0,
        );

        // Ghost words drift the opposite way for depth.
        tl.fromTo(ghost, { xPercent: -45 }, { xPercent: 0, ease: "none", duration: 1 }, 0);

        // Karaoke highlight: words light up as they cross the middle of the panel.
        words.forEach((w) => {
          gsap.fromTo(
            w,
            { opacity: 0.14, y: 24 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: w, containerAnimation: tl, start: "left 85%", end: "left 50%", scrub: true },
            },
          );
        });

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
        <div
          className="mf__panel"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--px", `${e.clientX - r.left}px`);
            e.currentTarget.style.setProperty("--py", `${e.clientY - r.top}px`);
          }}
        >
          <div className="mf__spot" aria-hidden="true" />
          <p className="mf__ghost" aria-hidden="true">
            Stories ✦ Strategy ✦ Design ✦ Technology ✦ Stories ✦ Strategy ✦ Design ✦ Technology
          </p>
          <p className="sr-only">{SENTENCE}</p>
          <Sticker name="asterisk" className="mf__floater mf__floater--a" />
          <Sticker name="ring" className="mf__floater mf__floater--b" />
          <Sticker name="asterisk" className="mf__floater mf__floater--c" />
          <div className="mf__track" aria-hidden="true">
            {PIECES.map(renderPiece)}
          </div>
          <div className="mf__progress" aria-hidden="true">
            <span>Scroll</span>
            <span className="mf__progress-bar">
              <i />
            </span>
            <span className="mf__progress-num">00</span>
          </div>
        </div>
      </div>
    </section>
  );
}
