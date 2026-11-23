"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

const HEADINGS = ".display, .contact__title, .ft__title, .featured__title, .tm__title";
/** Elements kept whole (not split into words) inside a heading. */
const ATOMIC = "img, svg, .serif-accent, .sticker, .tm__badges";

/** Wrap every word (and atomic child) of `el` in a clipping mask. Returns the inner movers. */
function splitWords(el: HTMLElement): HTMLElement[] {
  const movers: HTMLElement[] = [];
  const wrap = (node: Node) => {
    const outer = document.createElement("span");
    outer.className = "sw";
    const inner = document.createElement("span");
    inner.className = "sw__i";
    node.parentNode!.insertBefore(outer, node);
    inner.appendChild(node);
    outer.appendChild(inner);
    movers.push(inner);
  };
  const walk = (parent: Node) => {
    Array.from(parent.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = (node.textContent ?? "").split(/(\s+)/);
        if (parts.every((p) => !p.trim())) return;
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          const t = document.createTextNode(p);
          frag.appendChild(t);
        });
        const nodes = Array.from(frag.childNodes);
        parent.replaceChild(frag, node);
        nodes.forEach((t) => {
          if (t.textContent!.trim()) wrap(t);
        });
      } else if (node instanceof HTMLElement || node instanceof SVGElement) {
        if (node.matches(ATOMIC)) wrap(node);
        else walk(node);
      }
    });
  };
  walk(el);
  return movers;
}

/**
 * Site-wide scroll choreography layered on top of the static sections.
 * Everything here is progressive: without JS or with reduced motion the page
 * stays fully readable.
 */
export default function ScrollFX() {
  const pathname = usePathname();
  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    const desktop = window.matchMedia("(min-width: 900px)").matches;
    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      /* ---------- 1. Word-mask heading reveals ---------- */
      gsap.utils.toArray<HTMLElement>(HEADINGS).forEach((h) => {
        if (h.closest(".results, .hero, .menu") || h.dataset.split) return;
        h.dataset.split = "1";
        h.classList.add("fx-own");
        const words = splitWords(h);
        gsap.fromTo(
          words,
          { yPercent: 115, rotation: 7, transformOrigin: "0% 100%" },
          {
            yPercent: 0,
            rotation: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.045,
            scrollTrigger: { trigger: h, start: "top 88%", once: true },
          },
        );
      });

      /* ---------- 2. Eyebrow dots pop ---------- */
      ScrollTrigger.batch(".eyebrow .dot", {
        start: "top 92%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(els, { scale: 0 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)", stagger: 0.05 }),
      });

      /* ---------- 3. Inline stickers wobble with scroll ---------- */
      gsap.utils.toArray<HTMLElement>(".section .inline-sticker").forEach((s, i) => {
        gsap.fromTo(
          s,
          { rotation: i % 2 ? 18 : -18 },
          {
            rotation: i % 2 ? -12 : 12,
            ease: "none",
            scrollTrigger: { trigger: s, start: "top bottom", end: "bottom top", scrub: 1 },
          },
        );
      });

      /* ---------- 4. About: image zoom-out ---------- */
      const aboutImg = document.querySelector<HTMLElement>(".about__img img");
      if (aboutImg) {
        gsap.fromTo(
          aboutImg,
          { scale: 1.25 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: ".about__media", start: "top bottom", end: "bottom center", scrub: true },
          },
        );
      }

      /* ---------- 5. Pillars / industries / featured cards / team: batched staggers ---------- */
      const batchIn = (sel: string, from: gsap.TweenVars) => {
        const els = gsap.utils.toArray<HTMLElement>(sel);
        if (!els.length) return;
        els.forEach((e) => e.classList.add("fx-own"));
        gsap.set(els, { autoAlpha: 0, ...from });
        ScrollTrigger.batch(els, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 1,
              ease: "power4.out",
              stagger: 0.09,
              overwrite: true,
              clearProps: "transform",
            }),
        });
      };
      batchIn(".pillar", { y: 80, rotation: 3 });
      batchIn(".industries li", { x: -60 });
      batchIn(".featured__grid > li", { y: 90, scale: 0.9 });
      batchIn(".person", { y: 70, rotation: -2 });
      batchIn(".depts li", { x: -50 });

      ScrollTrigger.batch(".person__avatar", {
        start: "top 90%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { scale: 0, rotation: -160 },
            { scale: 1, rotation: 0, duration: 1.1, ease: "back.out(1.8)", stagger: 0.08, delay: 0.15, clearProps: "transform" },
          ),
      });

      /* ---------- 6. Values list counts in ---------- */
      const values = gsap.utils.toArray<HTMLElement>(".values li");
      if (values.length) {
        gsap.from(values, {
          x: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".values", start: "top 85%", once: true },
        });
      }

      /* ---------- 7. Panels zoom into place ---------- */
      gsap.utils.toArray<HTMLElement>(".compare__panel, .tm__panel, .ft__panel").forEach((p) => {
        gsap.fromTo(
          p,
          { scale: 0.9, borderRadius: 64 },
          {
            scale: 1,
            borderRadius: 32,
            ease: "none",
            scrollTrigger: { trigger: p, start: "top bottom", end: "top 35%", scrub: 0.6 },
          },
        );
      });

      /* ---------- 8. Compare: pills fly in, rows split apart ---------- */
      const pills = gsap.utils.toArray<HTMLElement>(".compare__pill");
      if (pills.length) {
        document.querySelector(".compare__title")?.classList.add("fx-own");
        gsap.fromTo(
          pills,
          { x: (i) => [-260, 260, -200][i] ?? 0, rotation: (i) => [-14, 12, -8][i] ?? 0, autoAlpha: 0 },
          {
            x: 0,
            rotation: (i) => [-3, 2, -2][i] ?? 0,
            autoAlpha: 1,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".compare__head", start: "top 85%", end: "top 40%", scrub: 0.8 },
          },
        );
      }
      gsap.utils.toArray<HTMLElement>(".compare__row").forEach((row) => {
        row.classList.add("fx-own");
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 88%", end: "top 55%", scrub: 0.6 } });
        tl.fromTo(row.querySelector(".compare__card--others"), { x: -120, autoAlpha: 0 }, { x: 0, autoAlpha: 1 }, 0)
          .fromTo(row.querySelector(".compare__card--us"), { x: 120, autoAlpha: 0 }, { x: 0, autoAlpha: 1 }, 0.1)
          .fromTo(row.querySelector(".compare__vs"), { scale: 0, rotation: -180 }, { scale: 1, rotation: 0 }, 0.2);
      });

      /* ---------- 9. Process: stacked cards recede as the next one lands ---------- */
      const steps = gsap.utils.toArray<HTMLElement>(".step");
      steps.forEach((step, i) => {
        const next = steps[i + 1];
        if (!next) return;
        gsap.to(step, {
          scale: 0.9,
          filter: "brightness(0.82) saturate(0.85)",
          transformOrigin: "50% 0%",
          ease: "none",
          scrollTrigger: { trigger: next, start: "top 85%", end: "top 25%", scrub: true },
        });
      });
      steps.forEach((step) => {
        const pts = step.querySelectorAll("li");
        gsap.from(pts, {
          x: 30,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: step, start: "top 75%", once: true },
        });
      });

      /* ---------- 10. Services: numbers slide, arrows spin ---------- */
      gsap.utils.toArray<HTMLElement>(".svc__row").forEach((row) => {
        gsap.from(row.querySelector(".svc__arrow"), {
          rotation: -180,
          scale: 0,
          duration: 0.9,
          ease: "back.out(2)",
          clearProps: "transform",
          scrollTrigger: { trigger: row, start: "top 90%", once: true },
        });
      });

      /* ---------- 11. Contact: form fields cascade ---------- */
      const fields = gsap.utils.toArray<HTMLElement>(".form label, .form .btn");
      if (fields.length) {
        gsap.from(fields, {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".form", start: "top 85%", once: true },
        });
      }
      const contactLinks = gsap.utils.toArray<HTMLElement>(".contact__links li");
      if (contactLinks.length) {
        gsap.from(contactLinks, {
          x: -40,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".contact__links", start: "top 88%", once: true },
        });
      }

      /* ---------- 12. Footer: giant wordmark breathes in ---------- */
      const giant = document.querySelector<HTMLElement>(".ft__giant");
      if (giant) {
        gsap.fromTo(
          giant,
          { yPercent: 45, letterSpacing: "0.12em", autoAlpha: 0.2 },
          {
            yPercent: 0,
            letterSpacing: "-0.06em",
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: giant, start: "top bottom", end: "bottom bottom", scrub: 0.8 },
          },
        );
      }
      gsap.utils.toArray<HTMLElement>(".ft__col li").forEach((li, i) => {
        gsap.from(li, {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: (i % 7) * 0.04,
          scrollTrigger: { trigger: ".ft__cols", start: "top 92%", once: true },
        });
      });

      /* ---------- 13. Scroll-velocity skew on marquees (desktop) ---------- */
      if (desktop) {
        const marquees = gsap.utils.toArray<HTMLElement>(".work__rows .marquee, .logos .marquee");
        const setters = marquees.map((m) => gsap.quickTo(m, "skewX", { duration: 0.5, ease: "power3.out" }));
        let idle = 0;
        const settle = () => setters.forEach((s) => s(0));
        const st = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-8, 8, self.getVelocity() / -260);
            setters.forEach((s) => s(v));
            window.clearTimeout(idle);
            idle = window.setTimeout(settle, 120);
          },
        });
        cleanups.push(() => {
          st.kill();
          window.clearTimeout(idle);
        });
      }
    });

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 300);
    return () => {
      window.clearTimeout(t);
      cleanups.forEach((c) => c());
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
