import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Auth guards (unauthenticated)", () => {
  test("/dashboard redirects to sign-in when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("/saved redirects to sign-in when not authenticated", async ({ page }) => {
    await page.goto("/saved");
    await expect(page).toHaveURL(/sign-in/);
  });

  test("PATCH /api/leads returns 401 without auth", async ({ request }) => {
    const res = await request.patch("/api/leads/00000000-0000-0000-0000-000000000000", {
      data: { status: "contacted" },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/saved returns 401 without auth", async ({ request }) => {
    const res = await request.post("/api/saved", {
      data: { listingId: "00000000-0000-0000-0000-000000000000" },
    });
    expect(res.status()).toBe(401);
  });

  test("DELETE /api/media returns 401 without auth", async ({ request }) => {
    const res = await request.delete("/api/media/00000000-0000-0000-0000-000000000000");
    expect(res.status()).toBe(401);
  });

  test("public pages remain accessible without auth", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();

    await page.goto("/comprar");
    await expect(page.locator("h1")).toBeVisible();

    await page.goto("/rentar");
    await expect(page.locator("h1")).toBeVisible();
  });
});
