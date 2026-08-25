# The Antwerp Tea Party

V0.1 homepage demo for The Antwerp Tea Party, a specialized independent tea boutique in Antwerp. The first page is built as a lightweight production foundation: Next.js App Router, TypeScript, Tailwind CSS, `next/image`, and GSAP ScrollTrigger for one restrained scroll storytelling sequence.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Linting:

```bash
npm run lint
```

## Deployment

The project is intended to deploy cleanly to Vercel. The repository root should be this `webapp` folder.

## Assets

Original source material lives outside the app and must remain read-only:

```text
E:\ANTWERP TEA PARTY\Reference Photos
E:\ANTWERP TEA PARTY\Reference Documents
```

Selected, optimized copies are placed in:

```text
public/images
public/illustrations
```

See `ASSET_SELECTION.md` for the current homepage image choices.

## Content

Business and editable content is centralized in:

```text
src/data/site.ts
src/data/navigation.ts
src/data/origins.ts
src/data/assets.ts
```

Unverified details are marked with TODO comments in the data files and summarized in `DEMO_NOTES.md`.

## Animation

The GSAP ScrollTrigger timeline lives in:

```text
src/components/home/OriginJourney.tsx
```

It handles the opening journey from prototype origins to leaf, tin, and real shelf reveal. Editorial sections after that are intentionally calmer and mostly static.
