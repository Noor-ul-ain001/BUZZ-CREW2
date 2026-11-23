import Image from "next/image";
import Sticker from "@/components/Sticker";

const PILLARS = [
  { n: "01", title: "Creative thinking", text: "Ideas that make brands stand out." },
  { n: "02", title: "Strategic execution", text: "Turning ideas into structured digital campaigns." },
  { n: "03", title: "Digital growth", text: "Stronger visibility, engagement and business opportunities." },
];

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container">
        <p className="eyebrow" data-reveal>
          <span className="dot" /> Who we are
        </p>
        <div className="about__grid">
          <div className="about__copy">
            <h2 id="about-title" className="display" data-reveal>
              Built in Karachi. <span className="soft">Made for brands</span> that move{" "}
              <Sticker name="bolt" className="inline-sticker" /> with purpose.
            </h2>
            <div className="about__text" data-reveal>
              <p>
                Founded in 2022, Buzz Crew is a full-service digital agency partnering with local and international
                businesses across social media marketing, SEO, web development and design — helping them build stronger
                digital presences and drive measurable growth.
              </p>
              <p>
                Every campaign and platform we build is grounded in strategy first, so creative decisions serve clear
                business objectives rather than trends alone. Our style is bold, culturally attuned and rooted in the
                markets we serve, while staying sharp enough for a global stage.
              </p>
            </div>
          </div>

          <figure className="about__media" data-reveal>
            <div className="about__img">
              <Image
                src="/images/about/team.jpg"
                alt="The Buzz Crew team around a meeting table"
                width={1400}
                height={912}
                sizes="(max-width: 900px) 100vw, 46vw"
                data-parallax="24"
              />
            </div>
            <span className="chip chip--float chip--a">
              <Sticker name="globe" /> Pakistan · UAE · UK
            </span>
            <span className="chip chip--float chip--b">
              <Sticker name="spark" /> 90+ projects shipped
            </span>
            <span className="chip chip--float chip--c">
              <Sticker name="heart" /> 4+ years, one crew
            </span>
          </figure>
        </div>

        <ol className="pillars">
          {PILLARS.map((p, i) => (
            <li key={p.n} className="pillar" data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
              <span className="pillar__n">{p.n}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
