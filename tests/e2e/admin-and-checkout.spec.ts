import { test, expect } from "@playwright/test";

// Admin (Supabase) and checkout (Stripe) fallback coverage. Neither backend has credentials in
// this environment, so these tests exercise the real "not configured" paths rather than mocking
// anything — see docs/commerce-architecture.md and docs/testing-plan.md.

test.describe("Supabase admin fallback", () => {
  test("desktop: /admin redirects to login, login shows the not-configured notice", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "runs once, project-agnostic");

    const response = await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
    expect(response?.status()).toBe(200); // final response after the redirect

    await expect(page.getByText(/Supabase is not configured yet/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeDisabled();
  });
});

test.describe("Stripe checkout fallback", () => {
  test("desktop: empty cart redirects away from /checkout", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "runs once, project-agnostic");
    await page.goto("/nl/checkout");
    await expect(page).toHaveURL(/\/nl\/cart$/);
  });

  test("desktop: cart shows the honest checkout-unavailable state, never a fake checkout button", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "runs once, project-agnostic");

    await page.goto("/nl/shop/english-breakfast");
    await page.getByRole("button", { name: /winkelmandje/i }).click();
    await expect(page.getByText(/Toegevoegd aan winkelmandje/i)).toBeVisible();

    await page.goto("/nl/cart");
    await expect(page.getByText(/Afrekenen is nog niet aangesloten/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Afrekenen/i })).toHaveCount(0);

    // Clean up so this test doesn't leak a cart line into other tests sharing the dev server.
    await page.locator(".cart-line").first().getByRole("button", { name: /Verwijderen/i }).click();
    await expect(page.getByText(/winkelmandje is leeg/i)).toBeVisible();
  });

  test("desktop: webhook endpoint rejects a request with no Stripe signature", async ({ request }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "runs once, project-agnostic");
    const response = await request.post("/api/webhooks/stripe", { data: {} });
    // 503 here (not configured) rather than 400 is correct too - either way it must never
    // silently accept an unverified event.
    expect([400, 503]).toContain(response.status());
  });
});
