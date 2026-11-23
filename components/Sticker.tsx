import { useId } from "react";

export type StickerName =
  | "globe"
  | "asterisk"
  | "eyes"
  | "pill"
  | "head"
  | "pixels"
  | "megaphone"
  | "camera"
  | "chat"
  | "spark"
  | "play"
  | "heart"
  | "arrow"
  | "ring"
  | "bolt"
  | "rocket"
  | "bulb"
  | "chart"
  | "palette"
  | "target"
  | "laptop"
  | "phone"
  | "trophy"
  | "brain";

/** Glossy 3D icons (Microsoft Fluent Emoji 3D, MIT licence) — stored in /public/images/emoji. */
const EMOJI_3D: Partial<Record<StickerName, string>> = {
  globe: "globe_showing_asia-australia",
  eyes: "eyes",
  megaphone: "megaphone",
  camera: "camera_with_flash",
  chat: "speech_balloon",
  spark: "sparkles",
  play: "clapper_board",
  heart: "red_heart",
  bolt: "high_voltage",
  head: "brain",
  brain: "brain",
  rocket: "rocket",
  bulb: "light_bulb",
  chart: "chart_increasing",
  palette: "artist_palette",
  target: "bullseye",
  laptop: "laptop",
  phone: "mobile_phone",
  trophy: "trophy",
};

/**
 * Small glossy "sticker" icons used inline with headlines — the playful
 * emoji-in-type device from the reference video, drawn in the Buzz Crew palette.
 */
export default function Sticker({
  name,
  className = "",
  title,
}: {
  name: StickerName;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const emoji = EMOJI_3D[name];
  const g = (k: string) => `${uid}-${k}`;

  const art = (() => {
    switch (name) {
      case "globe":
        return (
          <>
            <defs>
              <linearGradient id={g("a")} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f6f0b8" />
                <stop offset=".55" stopColor="#a9e2a0" />
                <stop offset="1" stopColor="#f29cc6" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="24" rx="21" ry="15" fill={`url(#${g("a")})`} />
            <g fill="none" stroke="#1f5b33" strokeWidth="1.8">
              <ellipse cx="24" cy="24" rx="21" ry="15" />
              <ellipse cx="24" cy="24" rx="9" ry="15" />
              <path d="M3 24h42M6 16h36M6 32h36M24 9v30" />
            </g>
          </>
        );
      case "asterisk":
        return (
          <g stroke="#f1a9d6" strokeWidth="4.5" strokeLinecap="round">
            <path d="M24 6v36M8.4 15l31.2 18M8.4 33l31.2-18" />
            <path d="M24 6v36" stroke="#fff" strokeWidth="1.4" opacity=".7" />
          </g>
        );
      case "eyes":
        return (
          <>
            <defs>
              <radialGradient id={g("e")} cx=".4" cy=".35" r=".7">
                <stop offset="0" stopColor="#fff9df" />
                <stop offset="1" stopColor="#f3c96b" />
              </radialGradient>
            </defs>
            <circle cx="15" cy="24" r="12" fill={`url(#${g("e")})`} />
            <circle cx="33" cy="24" r="12" fill={`url(#${g("e")})`} />
            <ellipse cx="17" cy="25" rx="4" ry="6" fill="#16131f" />
            <ellipse cx="35" cy="25" rx="4" ry="6" fill="#16131f" />
            <circle cx="18.5" cy="22" r="1.4" fill="#fff" />
            <circle cx="36.5" cy="22" r="1.4" fill="#fff" />
          </>
        );
      case "pill":
        return (
          <>
            <defs>
              <linearGradient id={g("p")} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ff9fb3" />
                <stop offset=".5" stopColor="#c9a7ff" />
                <stop offset="1" stopColor="#7fd3e6" />
              </linearGradient>
            </defs>
            <rect x="3" y="15" width="42" height="18" rx="9" fill={`url(#${g("p")})`} transform="rotate(-24 24 24)" />
            <path d="M9 20h22" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".75" transform="rotate(-24 24 24)" />
          </>
        );
      case "head":
        return (
          <>
            <defs>
              <linearGradient id={g("h")} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#7fe0c9" />
                <stop offset=".5" stopColor="#f08ab8" />
                <stop offset="1" stopColor="#6c63ff" />
              </linearGradient>
            </defs>
            <path d="M24 4c10 0 17 7 17 16 0 5-2 8-4 10v12H20v-6h-6c-2 0-3-1-3-3v-5l-4-1 4-7C11 11 15 4 24 4Z" fill={`url(#${g("h")})`} />
            <circle cx="30" cy="16" r="3" fill="#fff" opacity=".6" />
          </>
        );
      case "pixels":
        return (
          <g>
            <rect x="26" y="6" width="12" height="12" rx="2" fill="#f472b6" />
            <rect x="14" y="18" width="12" height="12" rx="2" fill="#f9a8d4" />
            <rect x="26" y="18" width="12" height="12" rx="2" fill="#ec4899" opacity=".6" />
            <rect x="4" y="30" width="12" height="12" rx="2" fill="#fbcfe8" />
            <rect x="14" y="30" width="12" height="12" rx="2" fill="#f472b6" />
          </g>
        );
      case "megaphone":
        return (
          <>
            <path d="M8 19h8l18-10v30L16 29H8z" fill="#4f7cff" />
            <path d="M8 19h8v10H8z" fill="#2b4fd6" />
            <path d="M14 29l3 10h5l-2-10" fill="#2b4fd6" />
            <path d="M38 18c3 2 3 10 0 12" stroke="#f5c84b" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        );
      case "camera":
        return (
          <>
            <rect x="5" y="13" width="38" height="26" rx="6" fill="#2a2a3d" />
            <rect x="15" y="9" width="12" height="6" rx="2" fill="#2a2a3d" />
            <circle cx="24" cy="26" r="9" fill="#7aa7ff" />
            <circle cx="24" cy="26" r="5" fill="#132046" />
            <circle cx="22" cy="24" r="1.6" fill="#fff" />
            <circle cx="37" cy="18" r="2" fill="#f5c84b" />
          </>
        );
      case "chat":
        return (
          <>
            <path d="M6 10h30a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H18l-8 7v-7H6a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z" fill="#34d399" />
            <circle cx="14" cy="22" r="2.4" fill="#fff" />
            <circle cx="21" cy="22" r="2.4" fill="#fff" />
            <circle cx="28" cy="22" r="2.4" fill="#fff" />
          </>
        );
      case "spark":
        return (
          <>
            <defs>
              <linearGradient id={g("s")} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#c4b5fd" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <ellipse cx="24" cy="26" rx="20" ry="11" fill={`url(#${g("s")})`} />
            <path d="M24 14l2.6 7 7.4.8-5.6 4.8 1.8 7.2L24 29.8l-6.2 4 1.8-7.2L14 21.8l7.4-.8Z" fill="#fff" />
          </>
        );
      case "play":
        return (
          <>
            <rect x="4" y="8" width="40" height="32" rx="9" fill="#ef4444" />
            <path d="M20 17v14l12-7z" fill="#fff" />
          </>
        );
      case "heart":
        return <path d="M24 41S5 30 5 17a9 9 0 0 1 19-4 9 9 0 0 1 19 4c0 13-19 24-19 24Z" fill="#fb7185" />;
      case "arrow":
        return (
          <>
            <defs>
              <linearGradient id={g("r")} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#7dd3fc" />
                <stop offset=".5" stopColor="#f0abfc" />
                <stop offset="1" stopColor="#fb7185" />
              </linearGradient>
            </defs>
            <path d="M4 18h20V8l20 16-20 16V30H4z" fill={`url(#${g("r")})`} />
          </>
        );
      case "ring":
        return (
          <g fill="none" stroke="#e5e7eb" strokeWidth="2">
            <ellipse cx="24" cy="21" rx="19" ry="9" />
            <ellipse cx="24" cy="27" rx="19" ry="9" opacity=".6" />
          </g>
        );
      case "bolt":
        return <path d="M27 3 9 27h12l-4 18 20-26H25z" fill="#eecf55" stroke="#b7951f" strokeWidth="1.2" />;
      default:
        return null;
    }
  })();

  if (emoji) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- tiny static icons; next/image adds no value here
      <img
        src={`/images/emoji/${emoji}.png`}
        alt={title ?? ""}
        aria-hidden={title ? undefined : true}
        width={160}
        height={160}
        decoding="async"
        draggable={false}
        className={`sticker sticker--3d ${className}`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 48 48"
      className={`sticker ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {art}
    </svg>
  );
}
