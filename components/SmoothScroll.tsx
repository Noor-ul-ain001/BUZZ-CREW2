"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

/**
 * Inertial smooth scrolling (Lenis) driven by GSAP's ticker so pinned
 * ScrollTrigger scenes stay perfectly in sync, plus light parallax for
 * any element marked `data-parallax="<strength>"`.
 * Disabled entirely for people who prefer reduced motion.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;

    document.documentElement.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      anchors: { offset: -72 },
    });

    lenis.on("scroll", ScrollTrigger.update);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Hold scrolling while the loader is on screen.
    const onLoaded = () => lenis.start();
    if (document.documentElement.classList.contains("is-loading")) {
      lenis.stop();
      window.addEventListener("bc:loaded", onLoaded, { once: true });
    }
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Layout can shift once fonts/images settle — re-measure pinned scenes.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("bc:loaded", onLoaded);
      gsap.ticker.remove(tick);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  // Per route: reset scroll, wire parallax for the new page, re-measure triggers.
  useEffect(() => {
    const l = (window as unknown as { __lenis?: Lenis }).__lenis;
    l?.scrollTo(0, { immediate: true, force: true });
    if (!window.matchMedia(MOTION_OK).matches) return;

    const parallax = gsap.utils.toArray<HTMLElement>("[data-parallax]").map((el) => {
      const amount = Number(el.dataset.parallax) || 60;
      return gsap.fromTo(
        el,
        { y: amount },
        {
          y: -amount,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120);

    return () => {
      window.clearTimeout(t);
      parallax.forEach((tw) => {
        tw.scrollTrigger?.kill();
        tw.kill();
      });
    };
  }, [pathname]);

  return null;
}
