import { test, expect } from "@playwright/test";

test.describe("Lead submission", () => {
  test("property detail shows lead form for signed-in user", async ({ page }) => {
    await page.goto("/comprar");
    const firstCard = page.locator("a[href*='/propiedades/']").first();
    await firstCard.click();
    await page.waitForURL(/\/propiedades\//);
    await expect(page.locator("form input[name='name']")).toBeVisible();
    await expect(page.locator("form input[name='email']")).toBeVisible();
    await expect(page.locator("form textarea[name='message']")).toBeVisible();
  });

  test("submit lead form shows success state", async ({ page }) => {
    await page.goto("/comprar");
    const firstCard = page.locator("a[href*='/propiedades/']").first();
    await firstCard.click();
    await page.waitForURL(/\/propiedades\//);

    await page.fill("input[name='name']", "E2E Test User");
    await page.fill("input[name='email']", "e2e-test@example.com");
    await page.fill("textarea[name='message']", "Automated E2E test lead submission");
    await page.click("form button[type='submit']");

    await expect(page.getByText(/gracias|thank/i)).toBeVisible({ timeout: 10_000 });
  });

  test("lead form validates required fields", async ({ page }) => {
    await page.goto("/comprar");
    const firstCard = page.locator("a[href*='/propiedades/']").first();
    await firstCard.click();
    await page.waitForURL(/\/propiedades\//);

    await page.click("form button[type='submit']");
    const nameInput = page.locator("input[name='name']");
    await expect(nameInput).toHaveAttribute("required", "");
  });

  test("API rate-limits lead creation at 10 requests", async ({ request }) => {
    const payload = {
      name: "Rate Limit Test",
      email: "ratelimit@example.com",
      message: "Testing rate limit",
      intent: "buy",
    };

    let rateLimited = false;
    for (let i = 0; i < 12; i++) {
      const res = await request.post("/api/leads", { data: payload });
      if (res.status() === 429) {
        rateLimited = true;
        break;
      }
    }
    expect(rateLimited).toBe(true);
  });
});
