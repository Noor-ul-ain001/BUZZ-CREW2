"use client";

import Image from "next/image";
import { useRef } from "react";
import Sticker from "@/components/Sticker";
import { TESTIMONIALS } from "@/lib/content";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 900px)`, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".quote", root.current);
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
            <li key={t.name} className={`quote quote--${t.tone}`}>
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
