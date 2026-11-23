"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Sticker from "@/components/Sticker";
import { POSTS } from "@/lib/content";

const ROW_A = POSTS.slice(0, 9);
const ROW_B = POSTS.slice(9);

export default function Work() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };

  const step = (d: number) => setIndex((i) => (i + d + POSTS.length) % POSTS.length);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onKey = (e: KeyboardEvent) => {
      if (!dlg.open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const row = (items: typeof POSTS, offset: number, reverse: boolean) => (
    <div className={`marquee${reverse ? " marquee--reverse" : ""}`}>
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__group" aria-hidden={copy === 1 ? true : undefined}>
            {items.map((post, i) => (
              <li key={post.src}>
                <button
                  type="button"
                  className="post"
                  data-cursor="View"
                  onClick={() => open(offset + i)}
                  tabIndex={copy === 1 ? -1 : undefined}
                  aria-label={`Open “${post.title}”`}
                >
                  <Image src={post.src} alt="" fill sizes="(max-width: 700px) 60vw, 300px" />
                  <span className="post__tag">{post.tag}</span>
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );

  const current = POSTS[index];

  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow" data-reveal>
              <span className="dot" /> Selected work
            </p>
            <h2 id="work-title" className="display" data-reveal>
              The feed <Sticker name="play" className="inline-sticker" /> <span className="soft">we build</span> for
              brands.
            </h2>
          </div>
          <p className="section-lead" data-reveal>
            Campaign creatives, service launches and content series designed in-house — warm tones, genuine moments and
            storytelling compositions inspired by everyday life.
          </p>
        </div>
      </div>

      <div className="work__rows" data-reveal>
        {row(ROW_A, 0, false)}
        {row(ROW_B, ROW_A.length, true)}
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={current.title}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        <div className="lightbox__inner">
          <div className="lightbox__img">
            <Image key={current.src} src={current.src} alt={current.title} fill sizes="(max-width: 700px) 92vw, 640px" />
          </div>
          <div className="lightbox__bar">
            <div>
              <p className="lightbox__tag">{current.tag}</p>
              <p className="lightbox__title">{current.title}</p>
            </div>
            <div className="lightbox__ctrl">
              <button type="button" onClick={() => step(-1)} aria-label="Previous design">
                ←
              </button>
              <span>
                {String(index + 1).padStart(2, "0")} / {POSTS.length}
              </span>
              <button type="button" onClick={() => step(1)} aria-label="Next design">
                →
              </button>
              <button type="button" className="lightbox__close" onClick={() => dialogRef.current?.close()} aria-label="Close">
                ✕
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  );
}
