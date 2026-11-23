"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

const INTERACTIVE = "a, button, [role='button'], select, label, summary, [data-cursor]";
const TEXT_FIELD = "input, textarea, [contenteditable='true']";

/**
 * Custom cursor: a precise dot plus the Buzz Crew logo trailing behind it.
 * The logo leans and stretches with pointer velocity, grows and spins over
 * interactive elements, and shows a label pill for `data-cursor="Label"`.
 * Fine pointers with motion allowed only; touch keeps native behaviour.
 */
export default function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches || !window.matchMedia(MOTION_OK).matches) return;

    const root = document.documentElement;
    const dot = dotRef.current!;
    const logo = logoRef.current!;
    const inner = innerRef.current!;
    const label = labelRef.current!;

    gsap.set([dot, logo], { xPercent: -50, yPercent: -50, x: -200, y: -200 });
    const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const lx = gsap.quickTo(logo, "x", { duration: 0.55, ease: "power3.out" });
    const ly = gsap.quickTo(logo, "y", { duration: 0.55, ease: "power3.out" });
    const rot = gsap.quickTo(inner, "rotation", { duration: 0.5, ease: "power3.out" });
    const sx = gsap.quickTo(inner, "scaleX", { duration: 0.4, ease: "power3.out" });
    const sy = gsap.quickTo(inner, "scaleY", { duration: 0.4, ease: "power3.out" });

    let tx = -200;
    let ty = -200;
    let visible = false;
    const show = (on: boolean) => {
      if (on === visible) return;
      visible = on;
      root.classList.toggle("has-cursor", on);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      show(true);
      tx = e.clientX;
      ty = e.clientY;
      logo.classList.toggle("is-flip", tx > window.innerWidth - 170);
      dx(tx);
      dy(ty);
      lx(tx);
      ly(ty);
    };

    // Lean + stretch from the gap between the pointer and the trailing logo.
    const tick = () => {
      const gx = tx - (gsap.getProperty(logo, "x") as number);
      const gy = ty - (gsap.getProperty(logo, "y") as number);
      const speed = Math.min(Math.hypot(gx, gy), 160);
      rot(gsap.utils.clamp(-28, 28, gx * 0.22));
      sx(1 + speed / 900);
      sy(1 - speed / 1400);
    };
    gsap.ticker.add(tick);

    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const text = t?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      const field = Boolean(t?.closest(TEXT_FIELD));
      const interactive = !field && Boolean(t?.closest(INTERACTIVE));
      label.textContent = text;
      logo.classList.toggle("is-label", Boolean(text));
      logo.classList.toggle("is-hover", interactive && !text);
      logo.classList.toggle("is-field", field);
      dot.classList.toggle("is-hidden", field);
    };

    const onDown = () => logo.classList.add("is-down");
    const onUp = () => logo.classList.remove("is-down");
    const onLeave = () => show(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={logoRef} className="cursor__logo">
        <div ref={innerRef} className="cursor__logo-inner">
          <span className="cursor__glow" />
          <Image src="/images/logo-mark.png" alt="" width={441} height={396} sizes="64px" />
        </div>
        <span ref={labelRef} className="cursor__label" />
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  );
}
