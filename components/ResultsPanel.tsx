"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";
import Sticker from "@/components/Sticker";
import { FEATURED_CLIENTS, STATS, TESTIMONIALS } from "@/lib/content";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const LINE_B = ["Real", "results", "that", "grow."];
const ORBIT = FEATURED_CLIENTS.filter((c) => c.logo).slice(0, 6);
const STAT_ICONS = ["chart", "globe", "rocket", "trophy"] as const;
const QUOTE = TESTIMONIALS[0];
/** Deterministic star field (no hydration mismatch). */
const STARS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(i * 37 + 11) % 97}%`,
  top: `${(i * 53 + 7) % 88}%`,
  delay: `${(i * 0.37) % 3}s`,
  size: 3 + (i % 3) * 2,
}));

export default function ResultsPanel() {
  const root = useRef<HTMLElement>(null);
  /** Shared orbit state — written by the scroll timeline, read by the ticker. */
  const orbit = useRef({ angle: -Math.PI / 2, spread: 1, paused: false });
  const tiltRef = useRef<((e: PointerEvent<HTMLElement>) => void) | null>(null);

  /* ---------- Elliptical 3D orbit: badges pass in front of and behind the brain ---------- */
  useEffect(() => {
    const section = root.current;
    if (!section) return;
    const object = section.querySelector<HTMLElement>(".results__object")!;
    const slots = Array.from(section.querySelectorAll<HTMLElement>(".results__slot"));
    const reduce = !window.matchMedia(MOTION_OK).matches;
    const n = slots.length;

    const place = () => {
      const { angle, spread } = orbit.current;
      const obj = object.offsetWidth;
      const rx = obj * 0.98 * spread;
      const ry = obj * 0.4 * spread;
      slots.forEach((slot, i) => {
        const a = angle + (i / n) * Math.PI * 2;
        const depth = (Math.sin(a) + 1) / 2; // 0 = back, 1 = front
        const s = 0.72 + depth * 0.38;
        slot.style.transform = `translate3d(${Math.cos(a) * rx}px, ${Math.sin(a) * ry}px, 0) scale(${s})`;
        slot.style.zIndex = depth > 0.45 ? "4" : "1";
        slot.style.opacity = String(0.55 + depth * 0.45);
      });
    };

    if (reduce) {
      place();
      window.addEventListener("resize", place);
      return () => window.removeEventListener("resize", place);
    }

    const tick = (_t: number, dt: number) => {
      if (!orbit.current.paused) orbit.current.angle += dt * 0.00022;
      place();
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = root.current!;
        const pin = section.querySelector<HTMLElement>(".results__pin")!;
        const card = section.querySelector<HTMLElement>(".results__card")!;
        const object = section.querySelector<HTMLElement>(".results__object")!;
        const float = section.querySelector<HTMLElement>(".results__float")!;
        const tilt = section.querySelector<HTMLElement>(".results__tilt")!;
        const rings = gsap.utils.toArray<HTMLElement>(".results__ring", section);
        const titleA = section.querySelector<HTMLElement>(".results__title-a")!;
        const caption = section.querySelector<HTMLElement>(".results__caption")!;
        const quote = section.querySelector<HTMLElement>(".results__quote")!;
        const wordsB = gsap.utils.toArray<HTMLElement>(".results__title-b .w", section);
        const badges = gsap.utils.toArray<HTMLElement>(".results__badge", section);
        const stats = gsap.utils.toArray<HTMLElement>(".results__stat", section);
        const nums = gsap.utils.toArray<HTMLElement>(".results__num", section);
        const bars = gsap.utils.toArray<HTMLElement>(".results__bar i", section);
        const watermark = section.querySelector<HTMLElement>(".results__watermark")!;
        const halo = section.querySelector<HTMLElement>(".results__halo")!;
        const floor = section.querySelector<HTMLElement>(".results__floor")!;

        const small = () => pin.offsetWidth < 700;

        gsap.to(float, { y: -16, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });

        // Pointer tilt on the brain.
        gsap.set(tilt, { transformPerspective: 900 });
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3.out" });
        tiltRef.current = (e) => {
          if (e.pointerType !== "mouse") return;
          const r = pin.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 26);
          rx(((e.clientY - r.top) / r.height - 0.5) * -18);
          card.style.setProperty("--px", `${e.clientX - r.left}px`);
          card.style.setProperty("--py", `${e.clientY - r.top}px`);
        };

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=130%",
            pin,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          card,
          { clipPath: () => (small() ? "inset(20% 6% 20% 6% round 28px)" : "inset(20% 24% 20% 24% round 36px)") },
          {
            clipPath: () =>
              small() ? "inset(10px 10px 10px 10px round 22px)" : "inset(14px 14px 14px 14px round 30px)",
            duration: 0.4,
          },
          0,
        )
          .fromTo(object, { scale: 0.55, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.45 }, 0)
          .fromTo(floor, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.4, ease: "power3.out" }, 0.1)
          .fromTo(watermark, { autoAlpha: 0, scale: 0.7, yPercent: 20 }, { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.4, ease: "power3.out" }, 0.16)
          .to(watermark, { xPercent: -8, duration: 0.6, ease: "none" }, 0.5)
          .fromTo(halo, { autoAlpha: 0 }, { autoAlpha: 0.45, duration: 0.3 }, 0.22)
          .fromTo(titleA, { autoAlpha: 0, x: -50 }, { autoAlpha: 1, x: 0, duration: 0.2 }, 0.26)
          .fromTo(rings, { scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, stagger: 0.05 }, 0.24)
          .fromTo(orbit.current, { spread: 0 }, { spread: 1, duration: 0.34, ease: "power3.out" }, 0.28)
          .fromTo(badges, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.18, stagger: 0.03, ease: "back.out(2)" }, 0.28)
          .fromTo(caption, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.36)
          .fromTo(quote, { autoAlpha: 0, y: 40, rotation: -8 }, { autoAlpha: 1, y: 0, rotation: -3, duration: 0.2, ease: "power3.out" }, 0.42)
          .fromTo(wordsB, { opacity: 0.2, y: 24 }, { opacity: 1, y: 0, duration: 0.12, stagger: 0.06 }, 0.48)
          .fromTo(stats, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.16, stagger: 0.04, ease: "power3.out" }, 0.7);

        nums.forEach((el, i) => {
          el.textContent = "0";
          const obj = { v: 0 };
          tl.to(
            obj,
            {
              v: STATS[i].value,
              duration: 0.2,
              ease: "power1.out",
              onUpdate: () => {
                el.textContent = String(Math.round(obj.v));
              },
            },
            0.72 + i * 0.04,
          );
        });
        tl.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 0.2, stagger: 0.04, ease: "power2.out" }, 0.72);
        tl.to({}, { duration: 0.1 });

        return () => {
          tiltRef.current = null;
          orbit.current.spread = 1;
          nums.forEach((el, i) => {
            el.textContent = String(STATS[i].value);
          });
        };
      });
    },
    { scope: root },
  );

  const setPaused = (paused: boolean) => {
    orbit.current.paused = paused;
  };

  return (
    <section
      ref={root}
      className="results"
      aria-labelledby="results-title"
      onPointerMove={(e) => tiltRef.current?.(e)}
    >
      <div className="results__pin">
        <div className="results__card">
          <div className="results__aurora" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="results__floor" aria-hidden="true" />
          <div className="results__spot" aria-hidden="true" />
          <div className="results__glow" aria-hidden="true" />
          <div className="results__sweep" aria-hidden="true" />
          <div className="results__stars" aria-hidden="true">
            {STARS.map((s, i) => (
              <span
                key={i}
                style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
              />
            ))}
          </div>
          <p className="results__watermark" aria-hidden="true">
            Results
          </p>

          <h2 id="results-title" className="results__title-a">
            Not just <em className="serif-accent">visuals</em>
          </h2>

          <p className="results__caption">
            <Sticker name="spark" /> Brands we grow — tap a logo to visit
          </p>

          <figure className="results__quote">
            <blockquote>“{QUOTE.quote}”</blockquote>
            <figcaption>
              <span className="results__quote-logo">
                <Image src={QUOTE.logo} alt="" width={36} height={36} sizes="36px" />
              </span>
              {QUOTE.name}
            </figcaption>
          </figure>

          <div className="results__object">
            <span className="results__halo" aria-hidden="true" />
            <span className="results__ring results__ring--a" aria-hidden="true" />
            <span className="results__ring results__ring--b" aria-hidden="true" />
            <div className="results__tilt" aria-hidden="true">
              <div className="results__float">
                <Image src="/images/logo-mark.png" alt="" width={441} height={396} sizes="(max-width: 700px) 60vw, 400px" />
              </div>
            </div>
            <ul
              className="results__orbit"
              aria-label="Featured clients"
              onPointerEnter={() => setPaused(true)}
              onPointerLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              {ORBIT.map((c) => (
                <li key={c.name} className="results__slot">
                  <a
                    className={`results__badge${c.dark ? " results__badge--dark" : ""}`}
                    data-cursor="Visit"
                    href={c.site ?? c.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${c.name} — opens in a new tab`}
                  >
                    <Image src={c.logo!} alt="" width={80} height={80} sizes="80px" />
                    <span className="results__badge-name" aria-hidden="true">
                      {c.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="results__title-b" aria-label="Real results that grow.">
            {LINE_B.map((w) => (
              <span key={w} className={`w${w === "results" || w === "grow." ? " w--strong" : ""}`} aria-hidden="true">
                {w}{" "}
              </span>
            ))}
          </p>

          <dl className="results__stats">
            {STATS.map((s, i) => (
              <div key={s.label} className="results__stat">
                <dt>
                  <Sticker name={STAT_ICONS[i]} /> {s.label}
                </dt>
                <dd>
                  <span className="results__num">{s.value}</span>
                  <span className="results__suffix">{s.suffix}</span>
                  <span className="results__bar" aria-hidden="true">
                    <i />
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
