"use client";

import Image from "next/image";
import { useRef } from "react";
import Sticker from "@/components/Sticker";
import { TESTIMONIALS } from "@/lib/content";
import { gsap, useGSAP, Draggable, MOTION_OK } from "@/lib/gsap";

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 900px)`, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".quote-slot", root.current);
        const title = root.current!.querySelector(".tm__title");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "center 55%",
            scrub: 0.8,
          },
        });
        tl.fromTo(title, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 0);
        cards.forEach((card, i) => {
          tl.fromTo(
            card,
            { y: 260, x: (1 - i) * 220, rotation: 0, autoAlpha: 0 },
            { y: 0, x: 0, rotation: [-6, 3, -3][i], autoAlpha: 1, duration: 0.7, ease: "power3.out" },
            0.15 + i * 0.12,
          );
        });
      });

      // Grab-and-throw cards that spring back home (fine pointers only).
      mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
        const quotes = gsap.utils.toArray<HTMLElement>(".quote", root.current);
        const drags = quotes.map((q) => {
          const tilt = gsap.quickTo(q, "rotation", { duration: 0.4, ease: "power3.out" });
          let lastX = 0;
          return Draggable.create(q, {
            type: "x,y",
            zIndexBoost: true,
            onPress() {
              lastX = this.x;
              gsap.to(q, { scale: 1.05, boxShadow: "0 60px 90px -30px rgba(0,0,0,0.8)", duration: 0.3 });
            },
            onDrag() {
              tilt(gsap.utils.clamp(-18, 18, (this.x - lastX) * 0.9));
              lastX = this.x;
            },
            onRelease() {
              gsap.to(q, {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                boxShadow: "0 40px 70px -30px rgba(0,0,0,0.7)",
                duration: 1.3,
                ease: "elastic.out(1, 0.45)",
              });
            },
          })[0];
        });
        return () => drags.forEach((d) => d.kill());
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section tm" aria-labelledby="tm-title">
      <div className="tm__panel">
        <h2 id="tm-title" className="tm__title">
          The work{" "}
          <span className="tm__badges" aria-hidden="true">
            <Sticker name="heart" />
            <Sticker name="play" />
            <Sticker name="chat" />
          </span>{" "}
          <span className="soft">speaks.</span>
        </h2>
        <ul className="tm__cards">
          {TESTIMONIALS.map((t) => (
            <li key={t.name} className="quote-slot">
              <div className={`quote quote--${t.tone}`} data-cursor="Drag">
              <blockquote>
                <p>“{t.quote}”</p>
              </blockquote>
              <div className="quote__who">
                <span className="quote__logo">
                  <Image src={t.logo} alt="" width={48} height={48} sizes="48px" />
                </span>
                <span>
                  <strong>{t.name}</strong>
                  <em>{t.place}</em>
                </span>
              </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
