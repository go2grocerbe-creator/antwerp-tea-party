# Asset Selection

## V0.3 Storyboard SVG References

Original folder: `../Reference Documents/ANT-TP-Slide1`

Files inspected: `1.svg`, `2.svg`, `3.svg`, `4.svg`, `5.svg`, `6.svg`

Reason: These six SVGs were used as sequential storyboard references for the continuous tea journey. They were not copied into the app because they are heavy exported SVGs with embedded raster data and path-converted text. The implementation recreates the reusable leaf, origin paths, storage tin, brewing vessel, steam, and lounge reveal as lightweight HTML/CSS/SVG layers.

Reference files modified: no.

## V0.4 Asset Fidelity Pass

Goal: Replace the temporary illustrated/CSS primitives in the V0.3 journey with the highest-fidelity available assets while preserving the same six-part narrative and GSAP timeline: leaf -> origin -> storage -> collection/store -> brewing -> sharing/atmosphere.

Reference files modified: no.

## V0.4 Leaf

External source: `https://commons.wikimedia.org/wiki/File:Camellia_sinensis_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-025.jpg`

Downloaded as: `public/tea-journey/leaf/camellia-sinensis-koehler-source.jpg`

Optimized derivatives:

- `public/tea-journey/leaf/leaf-variant-a.webp`
- `public/tea-journey/leaf/leaf-variant-b.webp`
- `public/tea-journey/leaf/leaf-variant-c.webp`

Reason: The supplied `Reference Photos/tealeaf-cup-jpg.jpg` reads as clip art and repeats the V0.1/V0.3 weakness. The public-domain Camellia sinensis botanical plate gives the leaf moment a more credible tea-specific visual language until a real Antwerp Tea Party loose-leaf macro photo is available.

## V0.4 Storage Tin

Original: `public/images/black-tea-tin-detail.jpg`

Optimized derivative: `public/tea-journey/storage/actual-black-tea-tin.webp`

Reason: Replaces the CSS black cylinder with a cutout from actual shop tin photography. This is the most important fidelity correction in the storage and selected-tea moments.

## V0.4 Shelf Reveal

Original: `public/images/tea-wall-silver-tins.jpg`

Optimized derivative: `public/tea-journey/shelf/shelf-reveal-warm.webp`

Reason: Keeps the V0.3 collection/store reveal, but uses a warmer optimized crop from the real shelf photograph so the sequence feels less like a mockup and more like the shop.

## V0.4 Brewing

Originals:

- `public/images/teapot-detail.jpg`
- `public/images/teapot-display.jpg`

Optimized derivatives:

- `public/tea-journey/brewing/porcelain-teapot-cup.webp`
- `public/tea-journey/brewing/teapot-table-display.webp`

Reason: Replaces the CSS kettle and CSS cup with real porcelain/shop photography. The detail photo carries the main brewing moment; the tabletop display supports the selected-tea context.

## V0.4 Sharing / Atmosphere

Original: `public/images/tea-table-chairs.jpg`

Optimized derivative: `public/tea-journey/lounge/lounge-chairs-warm.webp`

Reason: Keeps the V0.3 emotional ending but uses an optimized warmer crop of the real seating area.

## V0.4 Rejected / Not Used

- `Reference Photos/tealeaf-cup-jpg.jpg`: rejected because it looks like generic clip art, not a premium tea-homepage asset.
- `Reference Photos/Recording 2026-08-25 152415.mp4`: sampled, but not used because it appears to be a recording of the existing webpage rather than source product/shop footage.

## Shelf Reveal

Original: `../Reference Photos/WhatsApp Image 2026-08-25 at 2.26.23 PM.jpeg`

Copied as: `public/images/tea-wall-silver-tins.jpg`

Reason: Strong repeated wall of silver tea tins in wooden cabinetry, useful for the final tin-to-shelf reveal. V0.2 keeps this as the final shelf image because it reads most clearly as "many teas"; the black tin imagery is stronger for object reference but less expansive as a full-viewport shelf reveal.

## Shelf Angle Detail

Original: `../Reference Photos/WhatsApp Image 2026-08-25 at 2.26.24 PM (1).jpeg`

Copied as: `public/images/tea-wall-silver-tins-angle.jpg`

Reason: Angled close-up of tins that reinforces depth and texture for action panels.

## Black Tin Detail

Original: `../Reference Photos/WhatsApp Image 2026-08-25 at 2.26.24 PM (9).jpeg`

Copied as: `public/images/black-tea-tin-detail.jpg`

Reason: Best available black tin photograph for the selected tea/tin moment.

## Black Tin Cabinet

Original: `../Reference Photos/WhatsApp Image 2026-08-25 at 2.26.24 PM (8).jpeg`

Copied as: `public/images/black-tea-tin-cabinet.jpg`

Reason: Useful backup/detail view of black tins inside a cabinet.

## Shop Interior

Original: `../Reference Photos/WhatsApp Image 2026-08-25 at 2.26.24 PM (6).jpeg`

Copied as: `public/images/shop-interior-wide.jpg`

Reason: Strongest image for entering the real shop: long aisle, wooden shelves, tins, terracotta floor, and store depth.

## Table And Chairs

Original: `../Reference Photos/WhatsApp Image 2026-08-25 at 2.26.24 PM (3).jpeg`

Copied as: `public/images/tea-table-chairs.jpg`

Reason: Warm leather chairs and small table make the best emotional ending for tastings and shared tea.

## Storefront

Original: `../Reference Photos/WhatsApp Image 2026-08-25 at 2.26.24 PM (5).jpeg`

Copied as: `public/images/storefront.jpg`

Reason: Shows the physical entrance and supports the visit path.

## Porcelain Detail

Original: `../Reference Photos/WhatsApp Image 2026-08-25 at 2.26.22 PM (1).jpeg`

Copied as: `public/images/porcelain-detail.jpg`

Reason: Quiet craft/detail texture for the knowledge section.

## Teapot Detail

Original: `../Reference Photos/WhatsApp Image 2026-08-25 at 2.26.22 PM.jpeg`

Copied as: `public/images/teapot-detail.jpg`

Reason: Decorative teapot and cup detail for artisanal shop texture.

## Teapot Display

Original: `../Reference Photos/WhatsApp Image 2026-08-25 at 2.26.24 PM.jpeg`

Copied as: `public/images/teapot-display.jpg`

Reason: Colorful tabletop display that captures the shop's layered, human interior.

## Teaware Shelves

Original: `../Reference Photos/WhatsApp Image 2026-08-25 at 2.26.24 PM (10).jpeg`

Copied as: `public/images/teaware-shelves.jpg`

Reason: Clear shelves of teaware and glassware for the experiences/action path.
