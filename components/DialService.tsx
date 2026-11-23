"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CONTACT, DIAL_SERVICES, DIAL_TIMES } from "@/lib/content";

type Step = "dial" | "details" | "done";

type Lead = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
};

const EMPTY: Lead = { name: "", phone: "", email: "", date: "", time: DIAL_TIMES[0] };

/** wa.me wants digits only, no "+" or spaces. */
const WA_NUMBER = CONTACT.phoneHref.replace(/\D/g, "");

/** Standard DTMF pairs (low row Hz, high column Hz) — the tones a phone keypad plays. */
const DTMF: [number, number][] = [
  [697, 1209], [697, 1336], [697, 1477],
  [770, 1209], [770, 1336], [770, 1477],
  [852, 1209], [852, 1336], [852, 1477],
];

let audioCtx: AudioContext | null = null;

/** Plays a short iPhone-style keypad tone for key index `i` (0–8). */
function playTone(i: number) {
  if (typeof window === "undefined") return;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  audioCtx ??= new Ctx();
  const ctx = audioCtx;
  // Browsers keep audio locked until the visitor has clicked/tapped the page once.
  if (ctx.state === "suspended") void ctx.resume();
  if (ctx.state !== "running") return;

  const t = ctx.currentTime;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
  gain.gain.setValueAtTime(0.12, t + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  gain.connect(ctx.destination);

  for (const f of DTMF[i]) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    osc.connect(gain);
    osc.start(t);
    osc.stop(t + 0.19);
  }
}

/** Unlocks audio on the visitor's first interaction so hover tones can play. */
function unlockAudio() {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  audioCtx ??= new Ctx();
  if (audioCtx.state === "suspended") void audioCtx.resume();
}

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function prettyDate(iso: string) {
  if (!iso) return "Flexible";
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}

export default function DialService() {
  const [step, setStep] = useState<Step>("dial");
  const [sel, setSel] = useState(0);
  const [pressed, setPressed] = useState<number | null>(null);
  const [lead, setLead] = useState<Lead>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({});
  const [copied, setCopied] = useState(false);
  const [sound, setSound] = useState(true);
  const soundRef = useRef(true);
  soundRef.current = sound;
  const rootRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  const service = DIAL_SERVICES[sel];

  const beep = (i: number) => {
    if (soundRef.current) playTone(i);
  };

  // Audio can only start after a user gesture; unlock it on the first click/tap/key anywhere.
  useEffect(() => {
    const once = () => unlockAudio();
    const opts = { once: true, passive: true } as const;
    window.addEventListener("pointerdown", once, opts);
    window.addEventListener("keydown", once, opts);
    return () => {
      window.removeEventListener("pointerdown", once);
      window.removeEventListener("keydown", once);
    };
  }, []);

  const pick = (i: number) => {
    beep(i);
    setSel(i);
    setPressed(i);
    window.setTimeout(() => {
      setPressed(null);
      setStep("details");
    }, 220);
  };

  // Number keys 1–9 dial a service while the keypad is visible on screen.
  useEffect(() => {
    if (step !== "dial") return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1 || n > DIAL_SERVICES.length) return;
      const r = rootRef.current?.getBoundingClientRect();
      if (!r || r.bottom < 0 || r.top > window.innerHeight) return;
      e.preventDefault();
      pick(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  // Escape steps back; focus moves to the first useful control on each step.
  useEffect(() => {
    if (step === "details") nameRef.current?.focus({ preventScroll: true });
    if (step === "done") doneRef.current?.focus({ preventScroll: true });
    if (step === "dial") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStep(step === "done" ? "details" : "dial");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const message = useMemo(
    () =>
      [
        "New lead — Dial a Service",
        `Service: ${sel + 1} · ${service.title}`,
        `Name: ${lead.name}`,
        `WhatsApp: ${lead.phone}`,
        `Email: ${lead.email || "—"}`,
        `Free meeting: ${prettyDate(lead.date)}, ${lead.time}`,
      ].join("\n"),
    [lead, sel, service.title],
  );

  const set = (k: keyof Lead) => (v: string) => {
    setLead((l) => ({ ...l, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!lead.name.trim()) next.name = "Tell us what to call you.";
    if (lead.phone.replace(/\D/g, "").length < 8) next.phone = "Add a WhatsApp number we can reach.";
    if (lead.email && !/^\S+@\S+\.\S+$/.test(lead.email)) next.email = "That email doesn’t look right.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setCopied(false);
    setStep("done");
  };

  const reset = () => {
    setLead(EMPTY);
    setErrors({});
    setStep("dial");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  const mailHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
    `New lead: ${service.title}`,
  )}&body=${encodeURIComponent(message)}`;

  const stepIndex = step === "dial" ? 0 : step === "details" ? 1 : 2;

  return (
    <section ref={rootRef} id="dial" className="section dial" aria-labelledby="dial-title">
      <div className="container dial__grid">
        <div className="dial__intro">
          <p className="eyebrow" data-reveal>
            <span className="dot" /> Dial a service
          </p>
          <h2 id="dial-title" className="display" data-reveal>
            Choose. Connect. <span className="serif-accent">Grow.</span>
          </h2>
          <p className="section-lead" data-reveal>
            Press the number for what you need, drop your details and pick a slot. We&apos;ll book a free
            30-minute call. You can send the request on WhatsApp or by email.
          </p>

          <ol className="dial__steps" aria-label="Progress" data-reveal>
            {["Pick a service", "Your details", "Send"].map((label, i) => (
              <li
                key={label}
                className={i === stepIndex ? "is-current" : i < stepIndex ? "is-done" : undefined}
                aria-current={i === stepIndex ? "step" : undefined}
              >
                <span className="dial__step-n">{i < stepIndex ? "✓" : i + 1}</span>
                {label}
              </li>
            ))}
          </ol>
        </div>

        <div className="dial__phone" data-reveal>
          <div className="dial__screen" aria-live="polite">
            <span className="dial__screen-label">
              {step === "dial" ? "Ready to dial" : step === "details" ? "Connecting…" : "Connected"}
            </span>
            <strong>
              {step === "dial" ? "Press 1 – 9" : `${sel + 1} · ${service.title}`}
            </strong>
          </div>

          {step === "dial" && (
            <div className="dial__pad">
              <div className="dial__keys" role="group" aria-label="Services keypad">
                {DIAL_SERVICES.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    className={`dial__key${pressed === i ? " is-pressed" : ""}`}
                    onClick={() => pick(i)}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") beep(i);
                    }}
                    aria-label={`${i + 1}: ${s.title}`}
                  >
                    <b>{i + 1}</b>
                    <span>{s.title}</span>
                  </button>
                ))}
              </div>
              <div className="dial__hint">
                <p>
                  <span aria-hidden="true">☎</span> Tap a key, or press 1–9 on your keyboard
                </p>
                <button
                  type="button"
                  className="dial__sound"
                  aria-pressed={sound}
                  onClick={() => setSound((s) => !s)}
                >
                  <span aria-hidden="true">{sound ? "🔊" : "🔇"}</span> Keypad sound {sound ? "on" : "off"}
                </button>
              </div>
            </div>
          )}

          {step === "details" && (
            <form className="dial__form" onSubmit={submit} noValidate>
              <p className="dial__blurb">{service.text}</p>

              <label>
                <span>Your name</span>
                <input
                  ref={nameRef}
                  value={lead.name}
                  onChange={(e) => set("name")(e.target.value)}
                  autoComplete="name"
                  placeholder="Jane Doe"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "dial-err-name" : undefined}
                />
                {errors.name && <em id="dial-err-name">{errors.name}</em>}
              </label>

              <div className="dial__row">
                <label>
                  <span>WhatsApp number</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={lead.phone}
                    onChange={(e) => set("phone")(e.target.value)}
                    autoComplete="tel"
                    placeholder="+60 12-345 6789"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "dial-err-phone" : undefined}
                  />
                  {errors.phone && <em id="dial-err-phone">{errors.phone}</em>}
                </label>
                <label>
                  <span>
                    Email <small>(optional)</small>
                  </span>
                  <input
                    type="email"
                    value={lead.email}
                    onChange={(e) => set("email")(e.target.value)}
                    autoComplete="email"
                    placeholder="jane@brand.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "dial-err-email" : undefined}
                  />
                  {errors.email && <em id="dial-err-email">{errors.email}</em>}
                </label>
              </div>

              <label>
                <span>Free meeting · day</span>
                <input
                  type="date"
                  min={todayISO()}
                  value={lead.date}
                  onChange={(e) => set("date")(e.target.value)}
                />
              </label>

              <fieldset className="dial__times">
                <legend>Time</legend>
                {DIAL_TIMES.map((t) => (
                  <label key={t} className={lead.time === t ? "is-on" : undefined}>
                    <input
                      type="radio"
                      name="dial-time"
                      value={t}
                      checked={lead.time === t}
                      onChange={() => set("time")(t)}
                    />
                    {t}
                  </label>
                ))}
              </fieldset>

              <div className="dial__actions">
                <button type="button" className="btn btn--ghost" onClick={() => setStep("dial")}>
                  <span aria-hidden="true">←</span> Back
                </button>
                <button type="submit" className="btn btn--dark">
                  Book free meeting <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          )}

          {step === "done" && (
            <div className="dial__done">
              <h3 ref={doneRef} tabIndex={-1}>
                Almost there. Send it our way.
              </h3>
              <p>Here&apos;s your request. Pick how you&apos;d like to send it:</p>
              <pre className="dial__msg">{message}</pre>
              <div className="dial__send">
                <a className="btn dial__wa" href={waHref} target="_blank" rel="noopener noreferrer">
                  Send via WhatsApp <span aria-hidden="true">→</span>
                </a>
                <a className="btn dial__mail" href={mailHref}>
                  Send via email <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="dial__actions">
                <button type="button" className="btn btn--ghost" onClick={copy}>
                  {copied ? "Copied ✓" : "Copy message"}
                </button>
                <button type="button" className="btn btn--ghost" onClick={reset}>
                  Start again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
