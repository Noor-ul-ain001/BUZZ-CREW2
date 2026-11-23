import Image from "next/image";
import Sticker from "@/components/Sticker";
import { COMPARE, CONTACT } from "@/lib/content";

export default function Compare() {
  return (
    <section className="section compare" aria-labelledby="compare-title">
      <div className="compare__panel">
        <div className="compare__dots" aria-hidden="true" />
        <div className="container compare__inner">
          <div className="compare__head">
            <Image src="/images/logo-full.png" alt="" width={441} height={463} className="compare__logo" sizes="90px" />
            <h2 id="compare-title" className="compare__title" data-reveal>
              <span className="compare__pill compare__pill--a">Not all</span>
              <span className="compare__pill compare__pill--b">marketing agencies</span>
              <span className="compare__pill compare__pill--c">
                are the <em>same…</em>
              </span>
            </h2>
          </div>

          <ul className="compare__list">
            {COMPARE.map((row, i) => (
              <li key={row.us} className="compare__row" data-reveal style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
                <div className="compare__card compare__card--others">
                  <span className="compare__icon" aria-hidden="true">✕</span>
                  <div>
                    <p className="compare__label">Others</p>
                    <p className="compare__text">“{row.others}”</p>
                  </div>
                </div>
                <span className="compare__vs" aria-hidden="true">→</span>
                <div className="compare__card compare__card--us">
                  <span className="compare__icon" aria-hidden="true">✓</span>
                  <div>
                    <p className="compare__label">Us</p>
                    <p className="compare__text">“{row.us}”</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="compare__foot" data-reveal>
            <p>
              <Sticker name="asterisk" className="inline-sticker" /> That&apos;s why clients stay with us long-term.
            </p>
            <a className="btn btn--neon" href={CONTACT.instagramUrl} target="_blank" rel="noreferrer">
              Ready to scale your brand? <strong>DM us now</strong>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
