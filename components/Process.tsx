import Sticker from "@/components/Sticker";
import { PROCESS } from "@/lib/content";

const TONES = ["cream", "lilac", "sky", "gold"];

export default function Process() {
  return (
    <section id="process" className="section process" aria-labelledby="process-title">
      <div className="container process__grid">
        <div className="process__intro">
          <p className="eyebrow" data-reveal>
            <span className="dot" /> How we work
          </p>
          <h2 id="process-title" className="display" data-reveal>
            From idea <Sticker name="arrow" className="inline-sticker" /> <span className="soft">to</span> execution.
          </h2>
          <p className="section-lead" data-reveal>
            A repeatable process behind every account — so you always know what we&apos;re doing, why, and what it&apos;s
            delivering.
          </p>
        </div>

        <ol className="process__stack">
          {PROCESS.map((p, i) => (
            <li
              key={p.step}
              className={`step step--${TONES[i]}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="step__top">
                <span className="step__n">{p.step}</span>
                <span className="step__lead">{p.lead}</span>
              </div>
              <h3 className="step__title">{p.title}</h3>
              <p className="step__text">{p.text}</p>
              <ul className="step__points">
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
