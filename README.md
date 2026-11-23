# Buzz Crew — We Tell Your Stories

Portfolio site for **The Buzz Crew**, a full-service creative & digital agency from Karachi working across Pakistan, the UAE and the UK.

Built with **Next.js 16 (App Router)**, **GSAP + ScrollTrigger** for the scroll-driven story scenes, and **Lenis** for smooth scrolling.

## Run locally

```bash
npm install
npm run dev        # development
npm run build      # production build
npm start          # serve the production build
```

## Where things live

| What | Where |
| --- | --- |
| All copy (services, clients, team, testimonials, links) | `lib/content.ts` |
| Page order | `app/page.tsx` |
| Styles & design tokens | `app/globals.css` |
| Fonts (Bricolage Grotesque + Instrument Serif) | `app/layout.tsx` |
| Hero scroll scene | `components/HeroStory.tsx` |
| "Not just visuals" orbit panel | `components/ResultsPanel.tsx` |
| Loader / cursor follower | `components/Loader.tsx`, `components/CursorFollower.tsx` |
| Images (posts, client logos, 3D icons) | `public/images/` |

3D icons are [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (MIT licence).

All motion respects `prefers-reduced-motion`.

## Deploy

Deployed on Netlify (`netlify.toml`). Netlify detects Next.js automatically.
