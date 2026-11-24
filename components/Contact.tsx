"use client";

import { useState, type FormEvent } from "react";
import Sticker from "@/components/Sticker";
import { CONTACT, SERVICES } from "@/lib/content";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const service = String(data.get("service") ?? "");
    const message = String(data.get("message") ?? "");
    const email = String(data.get("email") ?? "");
    const subject = encodeURIComponent(`New project${service ? ` — ${service}` : ""} from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact__grid">
          <div>
            <p className="eyebrow" data-reveal>
              <span className="dot" /> Looking ahead
            </p>
            <h2 id="contact-title" className="contact__title" data-reveal>
              Let&apos;s create stories <Sticker name="spark" className="inline-sticker" />{" "}
              <span className="soft">worth</span> remembering.
            </h2>
            <ul className="contact__links" data-reveal>
              <li>
                <span>Email</span>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li>
                <span>Instagram</span>
                <a href={CONTACT.instagramUrl} target="_blank" rel="noreferrer">
                  {CONTACT.instagram}
                </a>
              </li>
              <li>
                <span>Web</span>
                <a href={CONTACT.websiteUrl} target="_blank" rel="noreferrer">
                  {CONTACT.website}
                </a>
              </li>
            </ul>
            <p className="contact__avail" data-reveal>
              <span className="dot dot--live" /> Available for worldwide collaborations
            </p>
          </div>

          <form className="form" onSubmit={onSubmit} data-reveal>
            <div className="form__row">
              <label>
                <span>Your name</span>
                <input name="name" required autoComplete="name" placeholder="Jane Doe" />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" required autoComplete="email" placeholder="jane@brand.com" />
              </label>
            </div>
            <label>
              <span>What do you need?</span>
              <select name="service" defaultValue="">
                <option value="">Not sure yet — let&apos;s talk</option>
                {SERVICES.map((s) => (
                  <option key={s.title}>{s.title}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Tell us about your brand</span>
              <textarea name="message" rows={5} required placeholder="Goals, timelines, what's not working today…" />
            </label>
            <button type="submit" className="btn btn--dark btn--lg">
              Send to Buzz Crew <span aria-hidden="true">→</span>
            </button>
            <p className="form__note" role="status">
              {sent ? "Your email app should open with the message ready to send." : "Opens your email app — no data stored here."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
