"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (n): n is HTMLElement => Boolean(n),
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}${open ? " nav--open" : ""}`}>
      <div className="nav__inner">
        <a href="#top" className="nav__brand" aria-label="Buzz Crew, back to top" onClick={() => setOpen(false)}>
          <Image src="/images/logo-mark.png" alt="" width={441} height={396} loading="eager" sizes="34px" className="nav__mark" />
          <span className="nav__word">Buzz Crew</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`nav__link${active === link.id ? " is-active" : ""}`}
              aria-current={active === link.id ? "location" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="btn btn--dark nav__cta">
          Start a project <span aria-hidden="true">→</span>
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className="nav__sheet" hidden={!open}>
        <ul>
          {NAV_LINKS.map((link, i) => (
            <li key={link.id} style={{ "--i": i } as React.CSSProperties}>
              <a href={link.href} onClick={() => setOpen(false)}>
                <span className="nav__sheet-num">0{i + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
          <li style={{ "--i": NAV_LINKS.length } as React.CSSProperties}>
            <a href="#contact" onClick={() => setOpen(false)}>
              <span className="nav__sheet-num">0{NAV_LINKS.length + 1}</span>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
