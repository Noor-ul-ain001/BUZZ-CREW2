import Image from "next/image";
import Link from "next/link";
import Sticker from "@/components/Sticker";
import { CONTACT, PAGES, SERVICES } from "@/lib/content";

const SOCIAL = [
  { label: "Instagram", href: CONTACT.instagramUrl, text: CONTACT.instagram },
  { label: "Website", href: CONTACT.websiteUrl, text: CONTACT.website },
  { label: "Email", href: `mailto:${CONTACT.email}`, text: CONTACT.email },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft">
      <div className="ft__panel">
        <div className="ft__glow" aria-hidden="true" />
        <Sticker name="spark" className="ft__float ft__float--a" />
        <Sticker name="rocket" className="ft__float ft__float--b" />
        <Sticker name="heart" className="ft__float ft__float--c" />

        <div className="ft__cta">
          <p className="ft__eyebrow">
            <span className="dot dot--live" /> Taking on new projects
          </p>
          <h2 className="ft__title">
            Have a story <em className="serif-accent">worth</em> telling?
          </h2>
          <div className="ft__actions">
            <Link href="/contact" className="btn ft__btn" data-cursor="Let's go">
              Start a project <span aria-hidden="true">→</span>
            </Link>
            <a href={CONTACT.instagramUrl} target="_blank" rel="noreferrer" className="btn ft__btn ft__btn--ghost">
              DM us on Instagram <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="ft__cols">
          <div className="ft__brand">
            <Image src="/images/logo-mark.png" alt="" width={441} height={396} sizes="56px" />
            <p>
              A full-service creative &amp; digital agency from Karachi — working with brands across Pakistan, the UAE
              and the UK since 2022.
            </p>
          </div>

          <nav className="ft__col" aria-label="Footer">
            <h3>Explore</h3>
            <ul>
              {PAGES.map((l) => (
                <li key={l.id}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ft__col">
            <h3>Services</h3>
            <ul>
              {SERVICES.slice(0, 6).map((s) => (
                <li key={s.title}>
                  <Link href="/services">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft__col">
            <h3>Connect</h3>
            <ul>
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    <span className="ft__label">{s.label}</span>
                    {s.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="ft__giant" aria-hidden="true">
          Buzz<em>Crew</em>
        </p>

        <div className="ft__bottom">
          <span>© {year} The Buzz Crew. All rights reserved.</span>
          <span className="ft__tag">Ideas that connect · Strategies that move · Experiences that grow</span>
          <a href="#top" className="ft__top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
