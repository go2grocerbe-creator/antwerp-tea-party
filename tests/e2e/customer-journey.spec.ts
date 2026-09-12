import { test, expect } from "@playwright/test";

// Required customer journey (see docs/testing-plan.md and the project brief, Phase 7).
// Runs against the seed commerce provider with preview mode enabled (see
// docs/commerce-architecture.md) so the draft placeholder teas are visible — this does not
// reflect what an ordinary visitor sees, since draft products are never public.
const PREVIEW = "e2e-preview-token";

test.describe("customer purchase journey", () => {
  test("mobile: navigate, add a tea to cart, edit quantity, remove, reach cart summary", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile viewport/drawer only");
    await page.goto("/nl");
    await expect(page.locator("h1")).toBeVisible();

    // No horizontal overflow on the homepage at this viewport.
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    // Open the mobile menu as a real drawer, not a horizontally-scrolling bar.
    const menuButton = page.getByRole("button", { name: /menu/i });
    await menuButton.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Escape closes it and returns focus to the toggle.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(menuButton).toBeFocused();

    // Go to the shop (preview mode, so the draft seed teas are visible for this test only).
    await page.goto(`/nl/shop?preview=${PREVIEW}`);
    await expect(page.getByText(/Tea 01/)).toBeVisible();

    const shopScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const shopClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(shopScrollWidth).toBeLessThanOrEqual(shopClientWidth + 1);

    // Open a product, add it to the cart.
    await page.getByRole("link", { name: /Tea 01/ }).first().click();
    await expect(page).toHaveURL(/\/shop\/tea-01/);

    await page.getByLabel(/Aantal/i).fill("2");
    await page.getByRole("button", { name: /winkelmandje/i }).click();
    await expect(page.getByText(/Toegevoegd aan winkelmandje/i)).toBeVisible();

    // Cart shows the line with the right quantity.
    await page.goto("/nl/cart");
    const cartLine = page.locator(".cart-line").first();
    await expect(cartLine).toBeVisible();
    await expect(cartLine.locator('input[name="quantity"]')).toHaveValue("2");

    // Update quantity.
    await cartLine.locator('input[name="quantity"]').fill("3");
    await cartLine.getByRole("button", { name: /Bijwerken/i }).click();
    await expect(page.locator(".cart-line").first().locator('input[name="quantity"]')).toHaveValue(
      "3",
    );

    // Checkout is not connected to a real payment provider yet — the cart must say so plainly,
    // never present a fake checkout link (see docs/commerce-architecture.md).
    await expect(page.getByText(/Afrekenen is nog niet aangesloten/i)).toBeVisible();

    // Remove the line, cart goes back to its empty state.
    await page.locator(".cart-line").first().getByRole("button", { name: /Verwijderen/i }).click();
    await expect(page.getByText(/winkelmandje is leeg/i)).toBeVisible();
  });

  test("desktop: unknown product handle returns a real not-found page", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "runs once, project-agnostic");
    const response = await page.goto("/nl/shop/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByText(/niet gevonden/i)).toBeVisible();
  });

  test("desktop: draft products never appear on the public shop without preview", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "runs once, project-agnostic");
    await page.goto("/nl/shop");
    await expect(page.getByText(/Tea 01/)).toHaveCount(0);
    const direct = await page.goto("/nl/shop/tea-01");
    expect(direct?.status()).toBe(404);
  });
});
