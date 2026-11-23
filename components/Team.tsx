import Sticker from "@/components/Sticker";
import { TEAM, VALUES } from "@/lib/content";

const DEPARTMENTS = [
  {
    name: "Sales",
    lead: "Yashab Zahra Kazmi",
    text: "Client communication, lead management, business development and relationship building.",
  },
  {
    name: "AI Content Creation",
    lead: "Creative team",
    text: "AI-assisted ideation, creative production and faster content workflows with room to experiment.",
  },
  {
    name: "Web Development",
    lead: "Shahab Amjad",
    text: "Modern websites, clean user experience and business-focused development.",
  },
];

export default function Team() {
  return (
    <section id="team" className="section team" aria-labelledby="team-title">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow" data-reveal>
            <span className="dot" /> The crew
          </p>
          <h2 id="team-title" className="display" data-reveal>
            One team. <span className="soft">Multiple</span> strengths <Sticker name="head" className="inline-sticker" />
          </h2>
        </div>

        <ul className="people">
          {TEAM.map((p, i) => (
            <li key={p.name} className="person" data-reveal style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
              <span className={`person__avatar person__avatar--${i}`} aria-hidden="true">
                {p.initials}
              </span>
              <p className="person__group">{p.group}</p>
              <h3 className="person__name">{p.name}</h3>
              <p className="person__role">{p.role}</p>
            </li>
          ))}
        </ul>

        <div className="team__split">
          <ul className="depts">
            {DEPARTMENTS.map((d) => (
              <li key={d.name} data-reveal>
                <div className="depts__head">
                  <h3>{d.name}</h3>
                  <span>{d.lead}</span>
                </div>
                <p>{d.text}</p>
              </li>
            ))}
          </ul>

          <div className="values" data-reveal>
            <p className="values__label">What drives us</p>
            <ul>
              {VALUES.map((v, i) => (
                <li key={v.title}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong>{v.title}</strong>
                  <em>{v.text}</em>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
