import { test, expect, type Page } from "@playwright/test";

// Structural checks for the dedicated mobile GSAP journey (see
// docs/audits/mobile-motion-story-audit.md). These test visible outcomes and safe bounding
// relationships, not exact transform values - a retuned offset/duration should never break
// this suite, only a genuine structural regression should.

const REQUIRED_OVERFLOW_VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
];

/** Pin distance in px, derived from the actual rendered pin-spacer rather than a hardcoded
 * multiplier, so retuning the timeline's scroll distance can't silently break these tests. */
async function getPinDistance(page: Page) {
  return page.evaluate(() => {
    const spacer = document.querySelector<HTMLElement>(".pin-spacer");
    if (!spacer) return 0;
    return spacer.getBoundingClientRect().height - window.innerHeight;
  });
}

async function scrollToFraction(page: Page, fraction: number) {
  const pin = await getPinDistance(page);
  await page.evaluate((y) => window.scrollTo(0, y), pin * fraction);
  await page.waitForTimeout(950); // let the scrub (0.8s smoothing) settle
}

/** Navigate and wait for images/network to settle before measuring the pin-spacer - otherwise
 * ScrollTrigger may have measured the section's height before images finished loading, giving
 * a smaller-than-final pin distance and making fraction-based scrolling land on the wrong
 * narrative point. */
async function gotoJourney(page: Page, path = "/nl") {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
}

test.describe("mobile animated tea journey", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("animated journey is the default; opening content is visible at load", async ({ page }) => {
    await gotoJourney(page);
    await expect(page.locator(".journey-mobile-animated-only")).toBeVisible();
    await expect(page.locator(".journey-mobile-reduced-only")).toBeHidden();

    // Meaningful opening composition present immediately, before any scroll.
    await expect(page.locator(".m-text-intro h1")).toBeVisible();
    await expect(page.locator(".m-cup")).toBeVisible();
    const cupBox = await page.locator(".m-cup").boundingBox();
    expect(cupBox?.width).toBeGreaterThan(0);
    expect(cupBox?.height).toBeGreaterThan(0);
  });

  test("a pinned ScrollTrigger is created, with a bounded scroll distance", async ({ page }) => {
    await gotoJourney(page);
    await page.waitForTimeout(300);
    await expect(page.locator(".pin-spacer")).toHaveCount(1);

    const pin = await getPinDistance(page);
    // Designed range is ~180-240% of one viewport height (see the audit doc's "Scroll-distance
    // decision") - assert a generous band around that so minor retuning doesn't break this.
    expect(pin).toBeGreaterThan(844 * 1.2);
    expect(pin).toBeLessThan(844 * 3.5);
  });

  test("key animated elements exist: cup, leaves, origin labels, tin, shelf", async ({ page }) => {
    await gotoJourney(page);
    await expect(page.locator(".m-cup")).toHaveCount(1);
    await expect(page.locator(".m-leaf")).toHaveCount(4);
    await expect(page.locator(".m-origin-label")).toHaveCount(4);
    await expect(page.locator(".m-tin")).toHaveCount(1);
    await expect(page.locator(".m-shelf")).toHaveCount(1);
  });

  test("origin labels are within the viewport during the origins checkpoint", async ({ page }) => {
    await gotoJourney(page);
    await scrollToFraction(page, 0.4);

    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    const labels = page.locator(".m-origin-label");
    const count = await labels.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const box = await labels.nth(i).boundingBox();
      if (!box) continue; // autoAlpha-hidden labels report no box; only check rendered ones
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport!.width + 1);
    }
  });

  test("text and tin never intersect at the preservation checkpoint", async ({ page }) => {
    await gotoJourney(page);
    await scrollToFraction(page, 0.73);

    const textBox = await page.locator(".m-text-tin").boundingBox();
    const tinBox = await page.locator(".m-tin").boundingBox();
    expect(textBox).not.toBeNull();
    expect(tinBox).not.toBeNull();
    if (!textBox || !tinBox) return;

    const intersects = !(
      textBox.x + textBox.width <= tinBox.x ||
      tinBox.x + tinBox.width <= textBox.x ||
      textBox.y + textBox.height <= tinBox.y ||
      tinBox.y + tinBox.height <= textBox.y
    );
    expect(intersects).toBe(false);

    // "Preserved with care" must actually be legible at this checkpoint.
    await expect(page.locator(".m-text-tin h2")).toBeVisible();
  });

  test("final shelf copy is visible near the end, and the page releases into normal content", async ({
    page,
  }) => {
    await gotoJourney(page);
    await scrollToFraction(page, 1.0);
    await expect(page.locator(".m-text-shelf h2")).toBeVisible();
    await expect(page.locator(".m-shelf")).toBeVisible();

    // Scrolling further releases the pin and reaches ordinary homepage content.
    const pin = await getPinDistance(page);
    await page.evaluate((y) => window.scrollTo(0, y), pin * 1.3);
    await page.waitForTimeout(400);
    await expect(page.getByText("Bijzondere thee")).toBeVisible();
  });

  test("scrolling back up restores an earlier stage", async ({ page }) => {
    await gotoJourney(page);
    await scrollToFraction(page, 1.0);
    await expect(page.locator(".m-text-shelf h2")).toBeVisible();

    await scrollToFraction(page, 0.4);
    await expect(page.locator(".m-text-origins")).toBeVisible();
    const label = page.locator(".m-origin-label").first();
    await expect(label).toBeVisible();

    await scrollToFraction(page, 0);
    await expect(page.locator(".m-text-intro h1")).toBeVisible();
    await expect(page.locator(".m-cup")).toBeVisible();
  });

  for (const vp of REQUIRED_OVERFLOW_VIEWPORTS) {
    test(`no horizontal overflow through the journey at ${vp.width}x${vp.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(vp);
      await gotoJourney(page);
      for (const fraction of [0, 0.25, 0.5, 0.75, 1.0]) {
        await scrollToFraction(page, fraction);
        const overflow = await page.evaluate(() => ({
          sw: document.documentElement.scrollWidth,
          cw: document.documentElement.clientWidth,
        }));
        expect(overflow.sw).toBeLessThanOrEqual(overflow.cw + 1);
      }
    });
  }
});

test.describe("reduced-motion fallback", () => {
  test.use({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });

  test("static fallback is used, complete narrative present, no pin", async ({ page }) => {
    await gotoJourney(page);
    await expect(page.locator(".journey-mobile-reduced-only")).toBeVisible();
    await expect(page.locator(".journey-mobile-animated-only")).toBeHidden();
    await expect(page.locator(".pin-spacer")).toHaveCount(0);

    // The complete narrative stays present in normal document flow. The same dictionary
    // strings also exist (hidden) in the desktop and animated trees, so scope every query to
    // the reduced-motion tree specifically rather than matching by text alone.
    const reduced = page.locator(".journey-mobile-reduced-only");
    await expect(reduced.locator("h1")).toBeVisible();
    await expect(reduced.getByText("Met zorg bewaard.")).toBeVisible();
    await expect(reduced.getByText("Darjeeling")).toBeVisible();
  });
});

test.describe("desktop journey regression", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("desktop pinned journey is present, unchanged, and not pushed off-screen", async ({
    page,
  }) => {
    await gotoJourney(page);
    await page.waitForTimeout(300);

    await expect(page.locator(".origin-journey__stage.journey-desktop-only")).toBeVisible();
    await expect(page.locator(".journey-mobile-animated-only")).toBeHidden();

    const stageBox = await page.locator(".origin-journey__stage.journey-desktop-only").boundingBox();
    expect(stageBox).not.toBeNull();
    // Regression guard for the specificity bug found this session: the desktop stage must fill
    // the pinned viewport from the top, not be pushed down by a hidden mobile tree above it.
    expect(stageBox!.y).toBeLessThan(5);

    const pin = await getPinDistance(page);
    expect(pin).toBeGreaterThan(800 * 4); // desktop's +=560% is much longer than mobile's
  });
});
