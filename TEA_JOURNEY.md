# Tea Journey Animation Map

## 01 Leaf

Reference: `../Reference Documents/ANT-TP-Slide1/1.svg`

An editorial first frame pairs the headline with the isolated cup-with-tea-leaves asset so the page has a clear focal object immediately. As scrolling begins, the cup recedes into the next object-led story beat.

## 02 Origin

Reference: `../Reference Documents/ANT-TP-Slide1/2.svg`

The isolated floral teapot appears as the second scene with subtle steam, then the single-leaf instances separate outward toward real location labels from `src/data/origins.ts`: Darjeeling, China, Nepal, India, Bangladesh, and Mozambique.

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

The pinned journey now hands off to the single illustrated tea-table invitation section below. The final copy resolves there into the existing tasting message: "Some teas are better shared."

## Implementation Notes

- Animation method: one GSAP ScrollTrigger timeline inside `src/components/home/OriginJourney.tsx`.
- GSAP was already installed before V0.3; no new animation dependency was added.
- V0.4 replaces the temporary leaf SVG, CSS storage tin, and CSS kettle/cup with optimized photographic or botanical assets in `public/tea-journey`.
- V0.5 integrates the new isolated assets from `Reference Photos/Assets` for the hero cup, second-scene teapot, journey leaf, open tin, and invitation chair. The front-view tin remains available in the asset folder but is not rendered over the shelf scene.
- Reduced motion keeps all six chapters readable as static stacked content.
- The original storyboard SVGs remain read-only and unchanged.
