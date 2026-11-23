import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import RevealObserver from "@/components/RevealObserver";
import SmoothScroll from "@/components/SmoothScroll";
import Loader from "@/components/Loader";
import CursorFollower from "@/components/CursorFollower";
import FX from "@/components/FX";
import ScrollFX from "@/components/ScrollFX";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { THEME_SCRIPT } from "@/lib/theme";
import "./globals.css";

/** One characterful grotesque for the whole site — optical sizing keeps body text readable. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/** Editorial italic accent for a few key words. */
const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Buzz Crew — We Tell Your Stories", template: "%s · Buzz Crew" },
  description:
    "Buzz Crew is a full-service creative and digital agency from Karachi, working across Pakistan, the UAE and the UK. Strategy, creation and growth for brands that want to move with purpose.",
  icons: { icon: "/images/logo-mark.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f2ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0b14" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS pre-hide intro elements only when JS will animate them in. */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js','is-loading');${THEME_SCRIPT}` }}
        />
      </head>
      <body>
        <Loader />
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Nav />
        {children}
        <Footer />
        <RevealObserver />
        <SmoothScroll />
        <CursorFollower />
        <FX />
        <ScrollFX />
      </body>
    </html>
  );
}
