import Image from "next/image";
import Sticker from "@/components/Sticker";
import { CLIENT_LOGOS, FEATURED_CLIENTS, INDUSTRIES } from "@/lib/content";

export default function Clients() {
  const half = Math.ceil(CLIENT_LOGOS.length / 2);
  const rows = [CLIENT_LOGOS.slice(0, half), CLIENT_LOGOS.slice(half)];

  return (
    <section className="section clients" aria-labelledby="clients-title">
      <div className="container">
        <div className="clients__grid">
          <div>
            <p className="eyebrow" data-reveal>
              <span className="dot" /> Where we&apos;ve worked
            </p>
            <h2 id="clients-title" className="display" data-reveal>
              Cross-industry experience, <span className="soft">not a one-vertical playbook</span>{" "}
              <Sticker name="globe" className="inline-sticker" />
            </h2>
          </div>
          <ul className="industries">
            {INDUSTRIES.map((ind, i) => (
              <li key={ind.title} data-reveal style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
                <span className="industries__n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{ind.title}</h3>
                  <p>{ind.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container">
        <div className="featured">
          <div className="featured__head" data-reveal>
            <h3 className="featured__title">
              Featured clients <Sticker name="rocket" className="inline-sticker" />
            </h3>
            <p>Follow the brands we create for — every card opens their page.</p>
          </div>
          <ul className="featured__grid">
            {FEATURED_CLIENTS.map((c, i) => (
              <li key={c.name} data-reveal style={{ "--d": `${(i % 4) * 70}ms` } as React.CSSProperties}>
                <a className="fcard" data-cursor="Visit" href={c.url} target="_blank" rel="noreferrer">
                  <span className={`fcard__logo${c.dark ? " fcard__logo--dark" : ""}`}>
                    {c.logo ? (
                      <Image src={c.logo} alt="" width={76} height={76} sizes="76px" />
                    ) : (
                      <span className="fcard__initials">{c.initials}</span>
                    )}
                  </span>
                  <span className="fcard__body">
                    <strong>{c.name}</strong>
                    <span>{c.category}</span>
                  </span>
                  <span className="fcard__handle">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                    {c.handle}
                  </span>
                  <span className="fcard__arrow" aria-hidden="true">↗</span>
                </a>
                {c.site ? (
                  <a className="fcard__site" href={c.site} target="_blank" rel="noreferrer">
                    Visit website ↗
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="logos" aria-label="Notable clients">
        <p className="logos__label">Notable clients</p>
        {rows.map((items, r) => (
          <div key={r} className={`marquee marquee--logos${r === 1 ? " marquee--reverse" : ""}`}>
            <div className="marquee__track">
              {[0, 1].map((copy) => (
                <ul key={copy} className="marquee__group" aria-hidden={copy === 1 ? true : undefined}>
                  {items.map((logo) => (
                    <li key={logo.src} className={`logo-tile${logo.dark ? " logo-tile--dark" : ""}`}>
                      <Image src={logo.src} alt={copy === 0 ? logo.name : ""} width={160} height={110} sizes="160px" />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
