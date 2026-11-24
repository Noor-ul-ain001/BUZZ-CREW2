"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import Sticker from "@/components/Sticker";
import { SERVICES } from "@/lib/content";

export default function Services({ limit }: { limit?: number }) {
  const list = limit ? SERVICES.slice(0, limit) : SERVICES;
  const [hover, setHover] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !previewRef.current || !listRef.current) return;
    const r = listRef.current.getBoundingClientRect();
    previewRef.current.style.transform = `translate3d(${e.clientX - r.left}px, ${e.clientY - r.top}px, 0)`;
  };

  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal>
            <span className="dot" /> What we do
          </p>
          <h2 id="services-title" className="display" data-reveal>
            Eleven disciplines. <span className="soft">One</span> crew{" "}
            <Sticker name="megaphone" className="inline-sticker" />
          </h2>
          <p className="section-lead" data-reveal>
            Sales, AI-assisted content, web development and creative strategy working together as one organised team —
            so your brand gets one plan, not eleven vendors.
          </p>
        </div>

        <div ref={listRef} className="svc-wrap" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <ol className="svc">
          {list.map((s, i) => (
            <li
              key={s.title}
              className="svc__row"
              data-hover={hover === i ? "" : undefined}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
              data-reveal
              style={{ "--d": `${(i % 4) * 60}ms` } as React.CSSProperties}
            >
              <span className="svc__n">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="svc__title">{s.title}</h3>
              <p className="svc__text">{s.text}</p>
              <span className="svc__arrow" aria-hidden="true">↗</span>
            </li>
          ))}
        </ol>

          <div ref={previewRef} className={`svc__preview${hover !== null ? " is-on" : ""}`} aria-hidden="true">
            {list.map((s, i) => (
              <Image
                key={s.title}
                src={s.image}
                alt=""
                fill
                sizes="300px"
                className={hover === i ? "is-on" : ""}
              />
            ))}
          </div>
        </div>

        {limit && limit < SERVICES.length && (
          <p className="svc__more" data-reveal>
            <Link href="/services" className="btn btn--dark">
              See all {SERVICES.length} services <span aria-hidden="true">→</span>
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
