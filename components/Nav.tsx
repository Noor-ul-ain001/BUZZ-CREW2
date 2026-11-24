"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import Sticker from "@/components/Sticker";
import ThemeToggle from "@/components/ThemeToggle";
import { CONTACT, PAGES } from "@/lib/content";

type LenisLike = { stop: () => void; start: () => void; scrollTo: (t: number | string, o?: object) => void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

const LINKS = PAGES;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const active = LINKS.find((l) => l.href === pathname)?.id ?? "";
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Warm up every page so menu navigation feels instant.
  useEffect(() => {
    LINKS.forEach((l) => router.prefetch(l.href));
  }, [router]);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scrolling, manage focus and Escape while the menu is open.
  useEffect(() => {
    const root = document.documentElement;
    if (!open) return;
    lenis()?.stop();
    root.classList.add("menu-open");
    const first = menuRef.current?.querySelector<HTMLElement>("a");
    const t = window.setTimeout(() => first?.focus({ preventScroll: true }), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      root.classList.remove("menu-open");
      lenis()?.start();
    };
  }, [open]);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    if (href === pathname) {
      // Same page: glide back to the top once scrolling is unlocked.
      requestAnimationFrame(() => {
        const l = lenis();
        if (l) {
          l.start();
          l.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
      return;
    }
    router.push(href);
  };

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}${open ? " nav--open" : ""}`}>
      <div className="nav__inner">
        <a href="/" className="nav__brand" aria-label="Buzz Crew home" onClick={(e) => go(e, "/")}>
          <Image src="/images/logo-mark.png" alt="" width={441} height={396} loading="eager" sizes="34px" className="nav__mark" />
          <span className="nav__word">Buzz Crew</span>
        </a>

        <div className="nav__actions">
          <ThemeToggle />
        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          data-magnetic
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-label" aria-hidden="true">
            <span>Menu</span>
            <span>Close</span>
          </span>
          <span className="nav__toggle-icon" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
        </div>
      </div>

      <div id="site-menu" ref={menuRef} className="menu" inert={!open} aria-hidden={!open}>
        <div className="menu__bg" aria-hidden="true">
          <span className="menu__glow menu__glow--a" />
          <span className="menu__glow menu__glow--b" />
        </div>

        <div className="menu__inner">
          <nav className="menu__nav" aria-label="Primary">
            <ol className="menu__list">
              {LINKS.map((link, i) => (
                <li key={link.id} style={{ "--i": i } as React.CSSProperties}>
                  <a
                    href={link.href}
                    className={`menu__link${active === link.id ? " is-active" : ""}`}
                    aria-current={active === link.id ? "location" : undefined}
                    onClick={(e) => go(e, link.href)}
                  >
                    <span className="menu__num">0{i + 1}</span>
                    <span className="menu__mask">
                      <span className="menu__text" data-text={link.label}>
                        {link.label}
                      </span>
                    </span>
                    <span className="menu__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <aside className="menu__side">
            <div className="menu__block">
              <p className="menu__label">Say hello</p>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
            <div className="menu__block">
              <p className="menu__label">Follow</p>
              <a href={CONTACT.instagramUrl} target="_blank" rel="noreferrer">
                Instagram {CONTACT.instagram}
              </a>
              <a href={CONTACT.websiteUrl} target="_blank" rel="noreferrer">
                {CONTACT.website}
              </a>
            </div>
            <a href="/contact" className="btn menu__cta" onClick={(e) => go(e, "/contact")}>
              Start a project <span aria-hidden="true">→</span>
            </a>
            <Sticker name="spark" className="menu__sticker menu__sticker--a" />
            <Sticker name="rocket" className="menu__sticker menu__sticker--b" />
          </aside>
        </div>

        <p className="menu__foot">
          <span>Karachi · Dubai · London</span>
          <span>We tell your stories ✦</span>
        </p>
      </div>
    </header>
  );
}
