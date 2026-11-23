"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef, type PointerEvent } from "react";
import Sticker, { type StickerName } from "@/components/Sticker";
import { POSTS } from "@/lib/content";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { LOADER_EVENT } from "@/components/Loader";

const TITLE_WORDS = ["We", "Tell", "Your", "Stories"];
const ACCENT_WORD = "Stories";
const TRAIN: StickerName[] = ["megaphone", "camera", "palette", "rocket", "heart", "spark"];

const CARD_POSTS = [POSTS[1], POSTS[4], POSTS[12], POSTS[9], POSTS[15], POSTS[2], POSTS[10]];

/** Positions in card-width units, relative to the bottom-centre anchor. */
const STACK = [
  { x: -1.55, y: 0.18, r: -14 },
  { x: -0.8, y: -0.02, r: 7 },
  { x: 0, y: -0.14, r: -3 },
  { x: 0.8, y: 0.04, r: 9 },
  { x: 1.56, y: 0.16, r: -10 },
  { x: -0.4, y: 0.34, r: 13 },
  { x: 0.42, y: 0.38, r: -12 },
];

/** Scatter positions as a fraction of the viewport, from its centre. */
const SCATTER = [
  { x: -0.38, y: -0.24, r: -16 },
  { x: 0.37, y: -0.27, r: 12 },
  { x: -0.44, y: 0.2, r: 9 },
  { x: 0.43, y: 0.18, r: -11 },
  { x: -0.2, y: 0.52, r: -6 },
  { x: 0.22, y: 0.54, r: 8 },
  { x: 0.03, y: -0.66, r: -10 },
];

/** Final fan — card 2 (top of the pile) lands in the middle. */
const FAN = [-3, -2, 0, -1, 2, 1, 3].map((o) => ({ x: o * 0.6, y: Math.abs(o) ** 2 * 0.045, r: o * 6 }));

const CHIPS: { icon: StickerName; label: string }[] = [
  { icon: "chart", label: "90+ projects delivered" },
  { icon: "globe", label: "12+ international clients" },
  { icon: "trophy", label: "3 photography awards" },
];

export default function HeroStory() {
  const root = useRef<HTMLElement>(null);
  const pointer = useRef<((e: PointerEvent<HTMLElement>) => void) | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const section = root.current!;
        const pin = section.querySelector<HTMLElement>(".hero__pin")!;
        const chars = gsap.utils.toArray<HTMLElement>(".hero__char", section);
        const train = section.querySelector<HTMLElement>(".hero__train")!;
        const trainItems = gsap.utils.toArray<HTMLElement>(".hero__train .sticker", section);
        const intro = section.querySelector<HTMLElement>(".hero__intro")!;
        const meta = gsap.utils.toArray<HTMLElement>(".hero__eyebrow, .hero__meta > *", section);
        const swash = section.querySelector<SVGPathElement>(".hero__swash path")!;
        const concept = section.querySelector<HTMLElement>(".hero__concept")!;
        const cue = section.querySelector<HTMLElement>(".hero__cue")!;
        const deco = gsap.utils.toArray<HTMLElement>(".hero__deco", section);
        const cardsWrap = section.querySelector<HTMLElement>(".hero__cards")!;
        const cards = gsap.utils.toArray<HTMLElement>(".hero__card", section);
        const inners = gsap.utils.toArray<HTMLElement>(".hero__card-inner", section);

        const w = () => cards[0].offsetWidth;
        const H = () => pin.offsetHeight;
        const W = () => pin.offsetWidth;

        /* ---------- Intro: type the headline with a sticker train ---------- */
        const swashLen = swash.getTotalLength();
        gsap.set(swash, { strokeDasharray: swashLen, strokeDashoffset: swashLen });
        gsap.set(chars, { autoAlpha: 0, yPercent: 40, rotation: 6 });
        gsap.set(meta, { autoAlpha: 0, y: 18 });
        gsap.set([cue, ...deco], { autoAlpha: 0 });
        gsap.set(inners, { y: () => H() * 0.7 });

        const placeTrain = (index: number) => {
          const c = chars[Math.min(index, chars.length - 1)];
          const after = index > 0;
          const ref = after ? chars[index - 1] : c;
          gsap.set(train, {
            x: after ? ref.offsetLeft + ref.offsetWidth + 6 : ref.offsetLeft,
            y: ref.offsetTop + ref.offsetHeight * 0.2,
          });
        };

        const counter = { n: 0 };
        let shown = 0;
        placeTrain(0);

        const introTl = gsap.timeline({ paused: true, delay: 0.05 });
        introTl
          .fromTo(trainItems, { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.04, ease: "back.out(2.4)" })
          .to(counter, {
            n: chars.length,
            duration: 1.2,
            ease: "none",
            onUpdate: () => {
              const k = Math.floor(counter.n);
              while (shown < k) {
                gsap.to(chars[shown], { autoAlpha: 1, yPercent: 0, rotation: 0, duration: 0.5, ease: "power3.out" });
                shown += 1;
              }
              placeTrain(k);
            },
          })
          .to(trainItems, { scale: 0, duration: 0.28, stagger: 0.035, ease: "back.in(2)" }, "+=0.02")
          .to(swash, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, "-=0.25")
          .to(meta, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" }, "-=0.6")
          .to(deco, { autoAlpha: 1, duration: 0.8, stagger: 0.1 }, "-=0.5")
          .to(cue, { autoAlpha: 1, duration: 0.6 }, "-=0.4")
          .to(inners, { y: 0, duration: 1.2, stagger: 0.06, ease: "expo.out" }, 0.7);

        // Start the intro as the loader curtain lifts.
        const startIntro = () => introTl.play();
        if (window.__bcLoaded) startIntro();
        else window.addEventListener(LOADER_EVENT, startIntro, { once: true });

        /* ---------- Pointer parallax (fine pointers only) ---------- */
        const qx = gsap.quickTo(cardsWrap, "x", { duration: 0.9, ease: "power3.out" });
        const qy = gsap.quickTo(cardsWrap, "y", { duration: 0.9, ease: "power3.out" });
        const qdx = gsap.quickTo(deco, "x", { duration: 1.2, ease: "power3.out" });
        pointer.current = (e) => {
          if (e.pointerType !== "mouse") return;
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          qx(nx * -26);
          qy(ny * -14);
          qdx(nx * 30);
        };

        /* ---------- Scroll: cards scatter, concept appears, cards regroup ---------- */
        const stackX = (i: number) => STACK[i].x * w();
        const stackY = (i: number) => H() / 2 - 0.28 * w() + STACK[i].y * w();
        const fanY = (i: number) => H() / 2 - 0.36 * w() + FAN[i].y * w();

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=220%",
            pin,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        tl.to(intro, { yPercent: -40, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0);
        tl.to(cue, { autoAlpha: 0, duration: 0.08 }, 0);
        tl.to(deco, { yPercent: -120, autoAlpha: 0, duration: 0.3, stagger: 0.02 }, 0);
        cards.forEach((card, i) => {
          tl.fromTo(
            card,
            { x: () => stackX(i), y: () => stackY(i), rotation: STACK[i].r, scale: 1 },
            {
              x: () => SCATTER[i].x * W(),
              y: () => SCATTER[i].y * H(),
              rotation: SCATTER[i].r,
              scale: 0.86,
              duration: 0.42,
            },
            0.02 + i * 0.012,
          );
          tl.to(
            card,
            { x: () => FAN[i].x * w(), y: () => fanY(i), rotation: FAN[i].r, scale: 1, duration: 0.4 },
            0.6 + i * 0.01,
          );
        });
        tl.fromTo(concept, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.24, ease: "power3.out" }, 0.3);
        tl.to({}, { duration: 0.1 });

        return () => {
          introTl.kill();
          window.removeEventListener(LOADER_EVENT, startIntro);
          pointer.current = null;
        };
      });
    },
    { scope: root },
  );

  let charIndex = 0;

  return (
    <section
      id="top"
      ref={root}
      className="hero"
      aria-labelledby="hero-title"
      onPointerMove={(e) => pointer.current?.(e)}
    >
      <div className="hero__pin">
        <div className="hero__bg" aria-hidden="true">
          <span className="hero__blob hero__blob--a" />
          <span className="hero__blob hero__blob--b" />
          <span className="hero__blob hero__blob--c" />
        </div>

        <Sticker name="bulb" className="hero__deco hero__deco--a" />
        <Sticker name="ring" className="hero__deco hero__deco--b" />
        <Sticker name="spark" className="hero__deco hero__deco--c" />

        <div className="hero__intro">
          <p className="hero__eyebrow">
            <span className="dot dot--live" /> Creative &amp; digital growth team
          </p>
          <h1 id="hero-title" className="hero__title" aria-label="We Tell Your Stories">
            {TITLE_WORDS.map((word, wi) => {
              const accent = word === ACCENT_WORD;
              return (
                <Fragment key={word}>
                  <span className={`hero__word${accent ? " hero__word--accent" : ""}`} aria-hidden="true">
                    {word.split("").map((ch) => {
                      charIndex += 1;
                      return (
                        <span key={`${word}-${charIndex}`} className="hero__char">
                          {ch}
                        </span>
                      );
                    })}
                    {accent ? (
                      <svg className="hero__swash" viewBox="0 0 300 24" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="swash-grad" x1="0" x2="1" y1="0" y2="0">
                            <stop offset="0" stopColor="#eecf55" />
                            <stop offset=".5" stopColor="#a4639a" />
                            <stop offset="1" stopColor="#4f94ab" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M4 16 C 60 6, 120 4, 180 9 S 270 18, 296 8"
                          fill="none"
                          stroke="url(#swash-grad)"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : null}
                  </span>
                  {wi < TITLE_WORDS.length - 1 ? " " : null}
                </Fragment>
              );
            })}
            <span className="hero__train" aria-hidden="true">
              {TRAIN.map((s) => (
                <Sticker key={s} name={s} />
              ))}
            </span>
          </h1>
          <div className="hero__meta">
            <p className="hero__kicker">
              Strategy<span>·</span>Creation<span>·</span>Growth
            </p>
            <ul className="hero__chips">
              {CHIPS.map((c) => (
                <li key={c.label} className="chip">
                  <Sticker name={c.icon} /> {c.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hero__concept">
          <h2 className="hero__concept-title">
            From idea{" "}
            <span className="inline-mark">
              <Image src="/images/logo-mark.png" alt="" width={441} height={396} sizes="60px" />
            </span>{" "}
            <span className="soft">to</span> <em className="serif-accent">impact,</em>
            <br />
            built <span className="soft">through</span> real strategy
          </h2>
          <p className="hero__concept-text">
            A full-service agency from Karachi working across Pakistan, the UAE and the UK — strategy first, with
            creative that serves clear business goals.
          </p>
          <div className="hero__actions">
            <Link href="/work" className="btn btn--dark">
              View our work <span aria-hidden="true">→</span>
            </Link>
            <Link href="/services" className="btn btn--ghost">
              What we do
            </Link>
          </div>
        </div>

        <div className="hero__cards" aria-hidden="true">
          {CARD_POSTS.map((post, i) => (
            <div
              key={post.src}
              className="hero__card"
              style={
                {
                  "--sx": STACK[i].x,
                  "--sy": STACK[i].y,
                  "--sr": STACK[i].r,
                  "--fx": FAN[i].x,
                  "--fy": FAN[i].y,
                  "--fr": FAN[i].r,
                  zIndex: i === 2 ? 8 : i + 1,
                } as React.CSSProperties
              }
            >
              <div className="hero__card-inner">
                <Image
                  src={post.src}
                  alt=""
                  fill
                  sizes="(max-width: 700px) 160px, 260px"
                  loading="eager"
                  fetchPriority={i === 2 ? "high" : "auto"}
                />
              </div>
            </div>
          ))}
        </div>

        <a href="#about" className="hero__cue">
          <span className="hero__cue-line" aria-hidden="true" />
          Scroll to explore
        </a>
      </div>
    </section>
  );
}
