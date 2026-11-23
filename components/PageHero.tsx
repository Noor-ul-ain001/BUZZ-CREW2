"use client";

import Link from "next/link";
import { Fragment, useRef, type PointerEvent } from "react";
import Sticker, { type StickerName } from "@/components/Sticker";
import { PAGES } from "@/lib/content";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export type TitlePart = string | { accent: string };

type Props = {
  /** Page id from PAGES (used for the "02 / 07" counter). */
  id: string;
  eyebrow: string;
  title: TitlePart[];
  lead: string;
  stickers: [StickerName, StickerName, StickerName];
  /** Word repeated in the giant background marquee. */
  marquee: string;
};

/**
 * Header for every inner page: breadcrumb, masked word-by-word title,
 * pointer-parallax 3D stickers and a giant outlined marquee that drifts on scroll.
 */
export default function PageHero({ id, eyebrow, title, lead, stickers, marquee }: Props) {
  const root = useRef<HTMLElement>(null);
  const moveRef = useRef<((e: PointerEvent<HTMLElement>) => void) | null>(null);
  const index = PAGES.findIndex((p) => p.id === id);
  const page = PAGES[index];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });
        tl.set(q(".ph__title"), { opacity: 1 }).fromTo(q(".ph__crumb > *"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.06 })
          .fromTo(
            q(".ph__w"),
            { yPercent: 115, rotation: 6 },
            { yPercent: 0, rotation: 0, duration: 1.3, stagger: 0.07 },
            0.1,
          )
          .fromTo(q(".ph__lead"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 }, 0.5)
          .fromTo(q(".ph__meta > *"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 }, 0.6)
          .fromTo(
            q(".ph__sticker"),
            { scale: 0, rotation: -90 },
            { scale: 1, rotation: 0, duration: 1.2, stagger: 0.1, ease: "back.out(1.8)" },
            0.35,
          );

        // Scroll: title lifts and fades, marquee drifts.
        gsap.to(q(".ph__inner"), {
          yPercent: -18,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.fromTo(
          q(".ph__marquee-track"),
          { xPercent: 0 },
          {
            xPercent: -25,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          },
        );

        // Pointer parallax on the stickers.
        const items = q(".ph__float") as HTMLElement[];
        const setters = items.map((el, i) => ({
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
          k: (i + 1) * 14,
        }));
        moveRef.current = (e) => {
          if (e.pointerType !== "mouse") return;
          const r = root.current!.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          setters.forEach((s) => {
            s.x(nx * s.k * 2);
            s.y(ny * s.k * 2);
          });
        };
        return () => {
          moveRef.current = null;
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="ph" onPointerMove={(e) => moveRef.current?.(e)}>
      <div className="ph__bg" aria-hidden="true">
        <span className="ph__blob ph__blob--a" />
        <span className="ph__blob ph__blob--b" />
      </div>

      <div className="ph__marquee" aria-hidden="true">
        <div className="ph__marquee-track">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>
              {marquee} <em>✦</em>{" "}
            </span>
          ))}
        </div>
      </div>

      {stickers.map((name, i) => (
        <span key={name + i} className={`ph__float ph__float--${i}`} aria-hidden="true">
          <Sticker name={name} className="ph__sticker" />
        </span>
      ))}

      <div className="container ph__inner">
        <p className="ph__crumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{page?.label}</span>
          <span className="ph__dot" aria-hidden="true" />
          <span className="ph__eyebrow">{eyebrow}</span>
        </p>

        <h1 className="ph__title">
          {title.map((part, i) => {
            const accent = typeof part !== "string";
            const text = accent ? part.accent : part;
            return (
              <Fragment key={i}>
                {text.split(" ").map((w, j) => (
                  <Fragment key={j}>
                    <span className="ph__mask">
                      <span className={`ph__w${accent ? " serif-accent" : ""}`}>{w}</span>
                    </span>{" "}
                  </Fragment>
                ))}
              </Fragment>
            );
          })}
        </h1>

        <div className="ph__row">
          <p className="ph__lead">{lead}</p>
          <div className="ph__meta">
            <span className="ph__count">
              {String(index + 1).padStart(2, "0")} <i>/ {String(PAGES.length).padStart(2, "0")}</i>
            </span>
            <span className="ph__scroll">
              Scroll <span aria-hidden="true">↓</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
