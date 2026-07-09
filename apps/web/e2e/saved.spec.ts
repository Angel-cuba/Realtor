import { test, expect } from "@playwright/test";

test.describe("Saved listings", () => {
  test("/saved page loads for authenticated user", async ({ page }) => {
    await page.goto("/saved");
    await expect(page.locator("h1")).toContainText(/marcado|saved/i);
  });

  test("heart button toggles saved state", async ({ page }) => {
    await page.goto("/comprar");
    const heartBtn = page.locator("button[aria-label*='uardar'], button[aria-label*='ave']").first();
    await expect(heartBtn).toBeVisible();

    const wasSaved = await heartBtn.getAttribute("aria-pressed");
    await heartBtn.click();
    await page.waitForTimeout(500);

    const isNowSaved = await heartBtn.getAttribute("aria-pressed");
    expect(isNowSaved).not.toBe(wasSaved);

    await heartBtn.click();
    await page.waitForTimeout(500);
    const restoredState = await heartBtn.getAttribute("aria-pressed");
    expect(restoredState).toBe(wasSaved);
  });

  test("saved listing appears on /saved page", async ({ page }) => {
    await page.goto("/comprar");

    const unsavedHeart = page.locator("button[aria-pressed='false'][aria-label*='uardar'], button[aria-pressed='false'][aria-label*='ave']").first();
    if (await unsavedHeart.isVisible()) {
      await unsavedHeart.click();
      await page.waitForTimeout(1000);
    }

    await page.goto("/saved");
    const listings = page.locator("a[href*='/propiedades/']");
    await expect(listings.first()).toBeVisible({ timeout: 5000 });
  });
});
