# Tea Journey Animation Map

## 01 Leaf

Reference: `../Reference Documents/ANT-TP-Slide1/1.svg`

An editorial first frame pairs the headline with the isolated cup-and-three-leaves asset so the page has a clear focal object immediately. As scrolling begins, the cup recedes and the isolated single leaf becomes the journey protagonist.

## 02 Origin

Reference: `../Reference Documents/ANT-TP-Slide1/2.svg`

The same isolated leaf instances separate outward toward neutral placeholder origin points. Origin labels are intentionally generic until founder-supplied sourcing data is confirmed in `src/data/origins.ts`.

## 03 Storage

Reference: `../Reference Documents/ANT-TP-Slide1/3.svg`

Leaves gather downward into the isolated open-lid black tin asset. The tin sits over the leaves so they visibly disappear into the opening.

## 04 Collection

Reference: `../Reference Documents/ANT-TP-Slide1/4.svg`

The single canister scales down while an optimized real shelf photograph fades and pans into place, implying one tin becoming part of the wider Antwerp Tea Party collection.

## 05 Brewing

Reference: `../Reference Documents/ANT-TP-Slide1/5.svg`

A chosen tin recedes into real porcelain teapot and shop-display photography. A leaf detail and slow steam introduce preparation without simulating literal pouring.

## 06 Sharing

Reference: `../Reference Documents/ANT-TP-Slide1/6.svg`

Steam lifts into the warm chair/lounge photograph. The final copy resolves the animated journey into the existing tasting message: "Some teas are better shared."

## Implementation Notes

- Animation method: one GSAP ScrollTrigger timeline inside `src/components/home/OriginJourney.tsx`.
- GSAP was already installed before V0.3; no new animation dependency was added.
- V0.4 replaces the temporary leaf SVG, CSS storage tin, and CSS kettle/cup with optimized photographic or botanical assets in `public/tea-journey`.
- V0.5 integrates the new isolated assets from `Reference Photos/Assets` for the hero cup, journey leaf, open tin, front tin, and invitation chair.
- Reduced motion keeps all six chapters readable as static stacked content.
- The original storyboard SVGs remain read-only and unchanged.
