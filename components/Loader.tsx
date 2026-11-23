"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Sticker, { type StickerName } from "@/components/Sticker";
import { gsap, MOTION_OK } from "@/lib/gsap";

export const LOADER_EVENT = "bc:loaded";

declare global {
  interface Window {
    __bcLoaded?: boolean;
  }
}

const ICONS: { name: StickerName; x: string; y: string }[] = [
  { name: "megaphone", x: "-300%", y: "-110%" },
  { name: "camera", x: "260%", y: "-150%" },
  { name: "palette", x: "-280%", y: "130%" },
  { name: "rocket", x: "290%", y: "100%" },
  { name: "heart", x: "-40%", y: "-260%" },
  { name: "spark", x: "60%", y: "240%" },
];

const MIN_TIME = 1.1; // seconds — long enough to read, short enough to stay out of the way
const MAX_TIME = 4; // never block the page longer than this

/** Marks the site as ready and tells the hero to start its intro. */
function announceLoaded() {
  window.__bcLoaded = true;
  document.documentElement.classList.remove("is-loading");
  window.dispatchEvent(new Event(LOADER_EVENT));
}

export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    if (!window.matchMedia(MOTION_OK).matches) {
      announceLoaded();
      setGone(true);
      return;
    }

    const fill = el.querySelector<HTMLElement>(".loader__fill")!;
    const count = el.querySelector<HTMLElement>(".loader__count")!;
    const bar = el.querySelector<HTMLElement>(".loader__bar span")!;
    const icons = el.querySelectorAll<HTMLElement>(".loader__icon");
    const word = el.querySelectorAll<HTMLElement>(".loader__word > span");

    const progress = { v: 0 };
    const render = () => {
      const p = Math.round(progress.v);
      count.textContent = String(p).padStart(3, "0");
      fill.style.clipPath = `inset(${100 - p}% 0 0 0)`;
      bar.style.transform = `scaleX(${p / 100})`;
    };

    const ctx = gsap.context(() => {
      gsap.from(word, { yPercent: 110, duration: 0.8, stagger: 0.08, ease: "expo.out", delay: 0.1 });
      gsap.from(icons, {
        scale: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: "back.out(1.8)",
        delay: 0.2,
      });
    }, el);

    // Climb toward 90% while we wait for the real work to finish.
    const climb = gsap.to(progress, { v: 90, duration: MIN_TIME + 0.6, ease: "power2.out", onUpdate: render });

    const started = performance.now();
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_TIME - (performance.now() - started) / 1000);
      climb.kill();
      gsap
        .timeline({ delay: wait, onComplete: () => setGone(true) })
        .to(progress, { v: 100, duration: 0.35, ease: "power1.out", onUpdate: render })
        .to(".loader__icon", { scale: 0, duration: 0.35, stagger: 0.03, ease: "back.in(2)" }, "+=0.05")
        .to(".loader__center", { scale: 0.9, autoAlpha: 0, duration: 0.45, ease: "power3.in" }, "<")
        .add(announceLoaded, "-=0.1")
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, "-=0.15");
    };

    const ready = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true })),
    ]);
    ready.then(finish);
    const cap = window.setTimeout(finish, MAX_TIME * 1000);

    return () => {
      window.clearTimeout(cap);
      climb.kill();
      ctx.revert();
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={root} className="loader" role="status" aria-live="polite" aria-label="Loading Buzz Crew">
      <div className="loader__center">
        <div className="loader__logo">
          {ICONS.map((ic) => (
            <span
              key={ic.name}
              className="loader__icon"
              style={{ "--x": ic.x, "--y": ic.y } as React.CSSProperties}
              aria-hidden="true"
            >
              <Sticker name={ic.name} />
            </span>
          ))}
          <Image className="loader__base" src="/images/logo-mark.png" alt="" width={441} height={396} loading="eager" sizes="180px" />
          <span className="loader__fill" aria-hidden="true">
            <Image src="/images/logo-mark.png" alt="" width={441} height={396} loading="eager" sizes="180px" />
          </span>
        </div>
        <p className="loader__word" aria-hidden="true">
          <span>We tell</span> <span>your</span> <span><em>stories</em></span>
        </p>
      </div>

      <div className="loader__foot" aria-hidden="true">
        <span>Buzz Crew — Pakistan · UAE · UK</span>
        <span className="loader__count">000</span>
      </div>
      <div className="loader__bar" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
