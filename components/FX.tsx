"use client";

import { useEffect } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

const TILT = ".post, .fcard, [data-tilt]";
const MAGNET = ".btn, [data-magnetic]";
const GLOW = ".svc__row, .fcard, .compare__card, .person, .pillar, .industries li, .values li";
const BURST = ".btn, .ft__btn, .menu__cta";
const BURST_ICONS = ["sparkles", "red_heart", "rocket", "high_voltage", "trophy", "light_bulb"].map(
  (n) => `/images/emoji/${n}.png`,
);

/**
 * Site-wide micro-interactions, all via event delegation:
 *  - scroll progress bar
 *  - magnetic buttons (CSS `translate`, so hover transforms stay intact)
 *  - 3D tilt + light glare on cards
 *  - pointer spotlight on service rows / client cards
 */
export default function FX() {
  useEffect(() => {
    const root = document.documentElement;
    const bar = document.querySelector<HTMLElement>(".progress__bar");

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = root.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const motion = window.matchMedia(MOTION_OK).matches;
    if (!fine || !motion) {
      return () => window.removeEventListener("scroll", onScroll);
    }
    root.classList.add("has-fx");

    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;

    const releaseMagnet = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };
    const releaseTilt = () => {
      if (tilt) {
        tilt.style.removeProperty("--rx");
        tilt.style.removeProperty("--ry");
      }
      tilt = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as Element | null;
      if (!t?.closest) return;

      const m = t.closest<HTMLElement>(MAGNET);
      if (m !== magnet) releaseMagnet();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.translate = `${dx * 0.25}px ${dy * 0.35}px`;
      }

      const c = t.closest<HTMLElement>(TILT);
      if (c !== tilt) releaseTilt();
      if (c) {
        tilt = c;
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        c.style.setProperty("--rx", `${(0.5 - py) * 12}deg`);
        c.style.setProperty("--ry", `${(px - 0.5) * 14}deg`);
        c.style.setProperty("--mx", `${px * 100}%`);
        c.style.setProperty("--my", `${py * 100}%`);
      }

      const g = t.closest<HTMLElement>(GLOW);
      if (g && g !== c) {
        const r = g.getBoundingClientRect();
        g.style.setProperty("--mx", `${e.clientX - r.left}px`);
        g.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };

    const onLeave = () => {
      releaseMagnet();
      releaseTilt();
    };

    // Emoji burst from buttons on click.
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest?.(BURST)) return;
      for (let i = 0; i < 10; i++) {
        const img = document.createElement("img");
        img.src = BURST_ICONS[i % BURST_ICONS.length];
        img.alt = "";
        img.className = "burst";
        img.style.left = `${e.clientX}px`;
        img.style.top = `${e.clientY}px`;
        document.body.appendChild(img);
        const a = (i / 10) * Math.PI * 2 + Math.random() * 0.6;
        const d = 70 + Math.random() * 90;
        gsap
          .timeline({ onComplete: () => img.remove() })
          .fromTo(
            img,
            { x: 0, y: 0, scale: 0.2, rotation: 0, opacity: 1 },
            {
              x: Math.cos(a) * d,
              y: Math.sin(a) * d - 40,
              scale: 0.6 + Math.random() * 0.6,
              rotation: (Math.random() - 0.5) * 240,
              duration: 0.7,
              ease: "power3.out",
            },
          )
          .to(img, { y: "+=70", opacity: 0, duration: 0.5, ease: "power1.in" });
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerdown", onDown);
      root.classList.remove("has-fx");
      onLeave();
    };
  }, []);

  return (
    <div className="progress" aria-hidden="true">
      <span className="progress__bar" />
    </div>
  );
}
