# Mobile Motion Story Audit — Restoring the Cinematic Tea Journey

Date: 2026-09-12 (third pass on `feat/mobile-commerce-v1`, same day as the previous two).
Scope: `src/components/home/OriginJourney.tsx`, `src/app/globals.css` (`.origin-journey`,
`.m-*`, `.journey-mobile*`), `src/data/origins.ts`, `src/data/assets.ts`, `src/i18n.ts`.

## Why the first two mobile attempts both failed

**Attempt 1 (first pass, earlier today):** adapted the desktop pinned/scrubbed GSAP timeline for
mobile by reusing the same absolutely-positioned, `vw`/`vh`-travel-distance elements and simply
shortening the pin (`+=450%` → `+=300%`). This kept the *structure* of a full-viewport pin but
not its content design: on a narrow portrait screen the leaf/tin/shelf stages (which default to
`opacity: 0` and only become visible via the scroll-linked timeline) produced a long blank
scroll region before anything appeared, text overlapped the tea tin, and the chair artwork in
the separate tea-table section (unrelated to this journey, but broken the same way) overlapped
its headline. See `docs/audits/mobile-audit.md` "Round 1" for the original findings.

**Attempt 2 (second pass, earlier today):** removed GSAP/pinning entirely and replaced it with
`MobileJourneyStatic` — six stacked `<div>` stages in plain document flow, each sized to its
content, no motion at all. This fixed the blank-space and overlap defects (confirmed via real
Chromium screenshots, `docs/audits/mobile-audit.md` "Round 2") but at the cost of the actual
point of the section: on desktop, the cup visibly becomes leaves, the leaves visibly travel to
origin points and then converge into the tin, and the tin visibly gives way to the shop shelf —
one continuous transformation the user scrolls through. The static replacement was six unrelated
illustrations in a list. It read as a slideshow, not a story.

**This pass:** keeps `MobileJourneyStatic` (renamed, unchanged in substance) but restricts it to
the `prefers-reduced-motion: reduce` fallback only, and adds a **new**, **dedicated** mobile
timeline (`MobileJourneyAnimated`) — pinned, scroll-scrubbed, GSAP-driven, composed and
positioned specifically for portrait screens rather than adapted from desktop coordinates.

## Desktop timeline inventory (authority: `OriginJourney.tsx`, `min-width: 769px` `matchMedia`
branch, read directly from the code and confirmed by scrolling the real desktop page at
1280×800 and 1440×900 in Chromium)

Positions below are GSAP timeline-time values (the desktop timeline's own internal numbering,
0 to ≈1.16), scrubbed linearly across a `+=560%` (5.6× viewport height) scroll distance.

| Stage | Timeline position | Visible objects | Text | Motion |
|---|---|---|---|---|
| Opening | 0 – 0.12 | `hero-cup` (cup with leaves rising from it), scroll cue | `origin-title` (eyebrow/h1/body) | Cup holds, scroll cue fades at 0.08 |
| Cup → teapot | 0.12 – 0.32 | `hero-cup` fades out, `teapot-layer` (+ steam SVG) fades in then out | — | Cup recedes, teapot briefly "brews," then recedes too |
| Leaves emerge | 0.34 – 0.46 | 6 `journey-leaf` elements fade/scale in, first dispersal | `origin-title` fades out at 0.42 | Leaves appear near center, then scatter outward (`vw`/`vh` offsets) |
| Origins reveal | 0.42 – 0.64 | `origin-map` (SVG paths) + 6 `origin-label`s fade in; leaves continue scattering to final `vw`/`vh` positions | — | Leaves settle near origin points; paths draw in |
| Origins resolve | 0.64 – 0.82 | Labels/paths fade out; leaves converge toward center-bottom (`y: 23vh`) | — | Leaves travel toward the tin's entry point |
| Tin receives leaves | 0.74 – 0.94 | `storage-tin` fades in; leaves shrink/fade (absorbed) | — | Leaves visibly enter the tin |
| Preservation copy | 0.88 – 0.98 | Tin remains | `tin-copy` ("Met zorg bewaard." / preserved-with-care) fades in then out | — |
| Shelf reveal | 0.98 – 1.16 | `shelf-reveal` (real shop photo) fades/scales in; tin shrinks and fades out | `shelf-copy` (final heading/body/CTA) fades in | Tin gives way to the shop shelf |
| Release | 1.16 | Pin ends | — | Normal scroll resumes into `ShopStory` |

Confirmed present in the current codebase, unchanged by this pass: all of the above. Desktop's
own `matchMedia` branch, tween values, and `end: "+=560%"` were not edited.

## What existed in mobile before this pass, and what disappeared

`MobileJourneyStatic` (the "Round 2" component) covered the same six narrative beats
(opening, statement, leaf+origins, tin+preservation, shelf+CTA) but as static, independently-
sized sections with no relationship between them beyond page order. What disappeared relative
to desktop:

- The cup **visibly turning into** leaves (there was a cup image, then separately a leaf image
  in the next static block — no transformation).
- Leaves **traveling** anywhere (no motion at all).
- Origins **appearing as part of the same scene** as the leaves (separate static block).
- Leaves **visibly entering the tin** (the tin was just the next static image).
- The tin **giving way to** the shelf (same — juxtaposition, not transformation).
- Any sense of continuous scroll-driven progression — each block was its own independent
  scroll-into-view moment, like an image gallery.

## Mobile timeline design (this pass)

### Architecture

`MobileJourneyAnimated` (`.m-journey.journey-mobile-animated-only`) is a **third** tree sharing
the `<section className="origin-journey">` with the existing desktop tree and the (now reduced-
motion-only) static tree. Exactly one is visible at a time, controlled entirely by CSS media
queries so server/client rendering stays consistent and there's no flash-of-wrong-tree:

```
.journey-desktop-only          -> visible at >= 769px (any motion preference)
.journey-mobile-animated-only  -> visible at <= 768px, default motion
.journey-mobile-reduced-only   -> visible at <= 768px AND prefers-reduced-motion: reduce
```

**Two-zone layout, not overlapping absolute positioning everywhere:** `.m-journey` is a flex
column: `.m-text-zone` (captions, crossfading) stacked above `.m-stage` (artwork, transforming)
above a small `.m-scroll-cue`. Text and artwork occupy different, non-overlapping boxes for the
entire pinned duration — "text overlaps the tin" is structurally impossible here regardless of
animation timing, not just avoided by careful tuning of numbers. This was a deliberate
architectural choice specifically because attempt 1's overlap defect came from text and artwork
sharing the same absolutely-positioned space.

Artwork within `.m-stage` (cup, leaves, tin) is centered via `inset: 0; margin: auto` with an
explicit `width`/`height` (or `aspect-ratio`), so GSAP's `x`/`y` transforms move each element
*from* a well-defined center point using plain pixel offsets sized for a capped
`max-width: 420px` stage — not `vw`/`vh` viewport-relative travel distances, which the
correction brief specifically flagged as a mobile risk (they don't scale sensibly across a
320–768px range the way a bounded, centered stage does).

### Timeline labels/phases

Built with `gsap.timeline().addLabel(...)` at each phase boundary, matching the suggested
vocabulary from the correction brief:

```
intro -> cup_exit -> leaves_emerge -> origins_reveal -> origins_resolve
      -> tin_receive -> preservation_copy -> shelf_reveal -> final_copy -> release
```

Each label is a named position in `src/components/home/OriginJourney.tsx`'s mobile `matchMedia`
branch — tweens reference labels (`"leaves_emerge+=0.06"`, etc.) rather than bare numbers
scattered through the file, so the sequence stays readable and re-orderable.

### Phase-by-phase (mobile-specific composition, not desktop's coordinates)

1. **intro** — cup (`isolatedCupLeaves`, same asset as desktop's `hero-cup`) + headline, fully
   visible at scroll position 0 with no animation dependency (see "Initial state" below).
2. **cup_exit** — cup fades/scales down and lifts away; intro text fades with it.
3. **leaves_emerge** — 4 leaves (fewer than desktop's 6, per the brief's allowance to reduce
   leaf count on narrow screens) fade/scale in from the cup's vacated center point and spread to
   a first set of positions. The origin caption begins fading in *during* this phase (not after
   it) so the text zone is never empty between "cup" and "origins" — an early build of this pass
   had a dead gap here; fixed by overlapping the caption's entrance with the tail of leaf
   emergence (see the "text zone was empty" defect below).
4. **origins_reveal** — leaves spread further to 4 quadrant positions; 4 origin labels (reduced
   from desktop's 6, same rationale) fade in near them.
5. **origins_resolve** — labels and caption fade out; leaves converge back toward the stage
   center, heading toward the tin.
6. **tin_receive** — tin fades/scales in *while* leaves are still converging (overlapping, not
   sequential) so there's no dead beat between "origins resolved" and "tin appears"; leaves
   shrink and fade as they arrive, reading as absorption into the tin.
7. **preservation_copy** — "Preserved with care" text fades in, positioned in `.m-text-zone`
   (never overlapping the tin, which lives only in `.m-stage`).
8. **shelf_reveal** — preservation text fades out; tin shrinks/fades; the shop shelf photo
   fades/scales in to fill `.m-stage`, reading as the tin giving way to the shop.
9. **final_copy** / **release** — final heading/body/CTA fade in; pin ends; normal scroll
   resumes into `ShopStory`.

### Scroll-distance decision

Tested visually (real Chromium screenshots at every 10–15% of progress) at `+=200%`, `+=220%`,
and `+=240%`. `+=220%` (2.2× one viewport height of scroll) was selected: short enough that the
sequence never feels like it's trapping the visitor, long enough that every phase above gets a
legible window rather than flashing past. This compares to desktop's `+=560%` — mobile is
roughly 2.5× shorter, appropriate for a shorter, simpler composition on a smaller screen, per
the brief's explicit instruction not to reuse `+=450%` or assume `+=300%` was already right.

### Reduced-motion behavior

Unchanged in substance from the second pass, just re-scoped: `MobileJourneyStatic` renders the
complete narrative in normal document flow, no pin, no GSAP. Verified this pass:
`document.querySelectorAll('.pin-spacer')` returns zero elements when
`prefers-reduced-motion: reduce` is set, confirming no pin is created at all (not merely
skipped visually) — see `tests/e2e/mobile-motion-journey.spec.ts` "reduced-motion fallback."

### Initial state (first paint before GSAP runs)

`.m-text-intro`, `.m-cup` are `opacity: 1` / `visibility: visible` in the base CSS (not just via
a JS `gsap.set` call); every other panel/artwork element defaults to `opacity: 0` /
`visibility: hidden` in CSS. This means the opening composition (header, headline, body, cup,
scroll cue) is correct even if JavaScript fails to load entirely — GSAP's `gsap.set()` calls at
effect-start reassert the same values, so there's no flash between the CSS default and the JS-
managed state.

### Cleanup and refresh

- `gsap.context()` + `ctx.revert()` on unmount (unchanged pattern from before this pass) reverts
  every tween/ScrollTrigger this component created.
- `gsap.matchMedia()` + `mm.revert()` handles the desktop/mobile branch switch.
- Added this pass: a `window.addEventListener("load", ...)` and `orientationchange` listener
  that calls `ScrollTrigger.refresh()` once, plus a `document.fonts.ready` hook — image/font
  loads and orientation changes can change the section's natural height after the pin's scroll
  distance was first calculated. Both listeners are removed in the effect's cleanup.

## A real bug found and fixed during this pass: desktop was broken

While regression-checking desktop at 1280×800, the origins stage rendered with the leaf/label
scatter pushed down by exactly one viewport height, with the top of the visible area completely
blank. Diagnosis (`getBoundingClientRect()` on the desktop stage element): it was being rendered
**800px lower than the pinned container's top**, i.e. something above it was occupying a full
extra viewport height.

Root cause: `.journey-mobile-animated-only, .journey-mobile-reduced-only { display: none }`
inside `@media (min-width: 769px)` has the same CSS specificity (one class selector) as the
later, unconditional `.m-journey { display: flex }` base rule. Equal specificity + later source
order meant `.m-journey`'s `display: flex` won *even at desktop widths*, so the mobile animated
tree was rendering (with none of its GSAP ever initializing, since the mobile `matchMedia`
branch never matches at 1280px) sitting directly above the desktop tree, pushing it down by its
own full-viewport height.

**Fix:** compound the selectors (`.m-journey.journey-mobile-animated-only`) so the hide rule has
higher specificity than the base display rule regardless of source order — the same pattern
already used for `.origin-journey__stage.journey-desktop-only` earlier in this file (that one
was fixed correctly the first time; this one was missed). A regression test
(`tests/e2e/mobile-motion-journey.spec.ts` → "desktop pinned journey is present, unchanged, and
not pushed off-screen") now asserts the desktop stage's top edge stays within 5px of the
viewport top, specifically to catch this class of bug again.

**This means the desktop journey was broken by the second pass's CSS changes and stayed broken
until this pass caught it during the required desktop regression check** — direct evidence for
why that check is mandatory, not optional, on every pass that touches this section's CSS.

## Viewports tested and what was actually verified

Full forward + partial-backward checkpoint screenshots (Playwright + Chromium, opening / leaves
/ origins / preservation / shelf / release), console errors checked, horizontal overflow
checked:

- **390×844** — full depth: all 6 forward checkpoints and all 6 backward checkpoints visually
  read, plus 4 additional targeted checkpoints (0.70, 0.92, 1.0, 1.02 scroll-progress) to
  specifically verify the preservation-text/tin relationship and the exact release moment. This
  is where the "leaves_emerge" text-zone-empty defect and the tin_receive dead-gap defect were
  found and fixed.
- **320×568** (narrowest required width) — opening, origins, and preservation checkpoints read
  in full; confirmed no overflow, no clipped labels, tin/text still non-overlapping at the
  smallest screen.
- **768×1024** (widest mobile-breakpoint width) — full checkpoint sequence run; opening read in
  full (found and fixed an excessive-empty-space issue specific to this taller/wider end of the
  mobile range — art sizes were capped in raw pixels, so they stayed small even as the available
  stage grew; changed to `clamp()`-based sizing plus a `.m-stage` `max-height` cap).
- **430×932** — full checkpoint sequence captured (opening screenshot read; matches 390/768
  behavior, no separate defects found).
- **375×667, 414×896** (spot-check width per the brief) — one targeted checkpoint each (origins
  for 375, preservation for 414) read directly; both clean, no overflow, no console errors.
- **1280×800, 1440×900** (desktop regression) — 5-point checkpoint sweep each; this is where the
  specificity bug above was found and then re-verified fixed (origins stage and final shelf
  state both re-screenshotted and read after the fix).

All of the above also had `document.documentElement.scrollWidth <=
document.documentElement.clientWidth` asserted programmatically at every checkpoint, and
`page.on('pageerror', ...)` confirmed empty (no console errors) throughout.

**Not read screenshot-by-screenshot to the same depth:** the full 6-checkpoint forward+backward
sequence was captured (not just spot-checked) at 320/390/430/768, but only the opening,
origins, and preservation frames were individually *visually inspected* at 320, and only opening
at 430/768, rather than all 6 stages at every width — time-boxed given the number of required
widths. The automated structural test suite (`mobile-motion-journey.spec.ts`) covers all 5
required widths' overflow behavior exhaustively, which is a narrower check (no overlap/clipping
judgment, just geometry) than a human/visual read.

## Motion recording

One Playwright video recorded at 390×844 (`recordVideo`, ~30s, `.webm`), covering: a smooth
90-step forward scroll through the entire pinned range and slightly past release, a pause, then
a smooth 40-step partial backward scroll to roughly the origins stage. Reviewed by extracting
frames at 1fps (`ffmpeg -vf fps=1`) and reading ten of them directly (frames 1, 5, 9, 13, 16, 19,
23, 27, 30). Observed:

- **Transitions appeared continuous** — cup → leaves → origins → tin/preservation → shelf, each
  frame a clear, legible progression from the last, no abrupt jumps between sampled frames.
- **No blank pause visible** at any sampled frame (this is exactly the defect this pass exists
  to fix, so it was checked specifically).
- **Release was smooth** — frame 16 shows the settled final-shelf state; frame 19 (further into
  the recording, past the scripted release point) shows normal continued scroll into `ShopStory`
  content, no jump or duplicated frame.
- **Reverse scrolling restored earlier stages correctly** — frames 23/27/30 (backward phase)
  show the origins stage with labels fading back in, matching the forward-phase origins frames;
  no ghost leaves or stale opacity left over from later stages.
- Not independently verified: the *smoothness between* the ten sampled frames (i.e. the 1-second
  gaps in between) — sampling at 1fps cannot rule out a sub-second stutter. The scrub value
  (0.8s) and the checkpoint-screenshot method (950ms settle) are consistent with smooth
  interpolation, but a frame-by-frame (e.g. 10fps+) review was not performed.

## Remaining limitations / unverified

- **iOS Safari was not tested.** Every check in this document and the linked test suite used
  Chromium (via Playwright). Safari-specific behavior — `100svh` support nuances, momentum-
  scroll interaction with `position: sticky`/pinning, address-bar show/hide during the pinned
  section — is **unverified**, not confirmed working.
- Android Chrome/Firefox mobile were not tested (Chromium desktop-engine emulation only).
- The opening composition's vertical spacing at 768×1024 was tightened but not further tuned;
  it's acceptable (no blank-region failure) but not necessarily optimal.
- Leaf-count/origin-label-count reduction (4 vs desktop's 6) was a deliberate simplification per
  the brief's explicit allowance, not a limitation, but is worth flagging as a visible
  difference from desktop if that's ever raised as a discrepancy.
- No real-device testing (physical phones) was performed — everything above is emulated-
  viewport Chromium.
