"use client";

import { Fragment, useRef } from "react";
import Sticker, { type StickerName } from "@/components/Sticker";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

type Icon = StickerName;
type Item = { text: string; icon: Icon; outline?: boolean };

const SETS: Record<"services" | "cta", [Item[], Item[]]> = {
  services: [
    [
      { text: "Branding", icon: "palette" },
      { text: "Social media", icon: "megaphone", outline: true },
      { text: "Video", icon: "play" },
      { text: "Web development", icon: "laptop", outline: true },
      { text: "Photography", icon: "camera" },
      { text: "AI content", icon: "bolt", outline: true },
    ],
    [
      { text: "Ideas that connect", icon: "bulb" },
      { text: "Strategies that move", icon: "rocket", outline: true },
      { text: "Experiences that grow", icon: "chart" },
      { text: "Stories worth telling", icon: "heart", outline: true },
    ],
  ],
  cta: [
    [
      { text: "Let's talk", icon: "chat" },
      { text: "Start a project", icon: "rocket", outline: true },
      { text: "Say hello", icon: "heart" },
      { text: "Build your brand", icon: "spark", outline: true },
    ],
    [
      { text: "Karachi", icon: "globe" },
      { text: "Dubai", icon: "globe", outline: true },
      { text: "London", icon: "globe" },
      { text: "Worldwide", icon: "trophy", outline: true },
    ],
  ],
};

/**
 * Two crossing, tilted marquee ribbons. They loop on their own and speed up
 * with scroll velocity, then ease back — a burst of energy between sections.
 */
export default function Ribbons({ set = "services" }: { set?: keyof typeof SETS }) {
  const root = useRef<HTMLDivElement>(null);
  const [a, b] = SETS[set];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tracks = gsap.utils.toArray<HTMLElement>(".ribbon__track", root.current);
        const loops = tracks.map((t, i) =>
          gsap.fromTo(
            t,
            { xPercent: i ? -50 : 0 },
            { xPercent: i ? 0 : -50, duration: i ? 34 : 28, ease: "none", repeat: -1 },
          ),
        );

        let boost = 0;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            boost = Math.max(boost, gsap.utils.clamp(0, 6, Math.abs(self.getVelocity()) / 350));
          },
          onToggle: (self) => loops.forEach((l) => (self.isActive ? l.play() : l.pause())),
        });
        const tick = () => {
          boost *= 0.92;
          loops.forEach((l) => l.timeScale(1 + boost));
        };
        gsap.ticker.add(tick);

        gsap.fromTo(
          ".ribbon--a",
          { rotation: -8 },
          { rotation: -3, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.fromTo(
          ".ribbon--b",
          { rotation: 7 },
          { rotation: 3, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );

        return () => {
          gsap.ticker.remove(tick);
          st.kill();
        };
      });
    },
    { scope: root },
  );

  const row = (items: Item[], cls: string) => (
    <div className={`ribbon ${cls}`}>
      <div className="ribbon__track">
        {[0, 1].map((copy) => (
          <div key={copy} className="ribbon__group">
            {[...items, ...items].map((it, i) => (
              <Fragment key={i}>
                <span className={`ribbon__item${it.outline ? " ribbon__item--o" : ""}`}>
                  <Sticker name={it.icon} />
                  {it.text}
                </span>
                <span className="ribbon__sep">✦</span>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={root} className={`ribbons ribbons--${set}`} aria-hidden="true">
      {row(b, "ribbon--b")}
      {row(a, "ribbon--a")}
    </div>
  );
}
