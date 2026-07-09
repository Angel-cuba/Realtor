import { test, expect } from "@playwright/test";

test.describe("Agent dashboard", () => {
  test("dashboard loads with leads table", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator("table, [role='table']").first()).toBeVisible({ timeout: 10_000 });
  });

  test("leads filter controls are visible", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("select, input[type='search'], input[name='q']").first()).toBeVisible({ timeout: 10_000 });
  });

  test("clicking a lead shows detail view", async ({ page }) => {
    await page.goto("/dashboard");
    const leadRow = page.locator("table a, [role='table'] a, table tr[class*='cursor']").first();
    if (await leadRow.isVisible({ timeout: 5000 })) {
      await leadRow.click();
      await page.waitForURL(/\/dashboard\/leads\//);
      await expect(page.locator("main")).toBeVisible();
    }
  });

  test("listings management link is accessible", async ({ page }) => {
    await page.goto("/dashboard");
    const listingsLink = page.getByRole("link", { name: /listing|propiedades|inmuebles/i });
    if (await listingsLink.isVisible({ timeout: 3000 })) {
      await listingsLink.click();
      await expect(page).toHaveURL(/\/dashboard\/listings/);
    }
  });
});
