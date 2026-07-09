import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("home page renders hero, search panel, and featured listings", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("proxima casa");
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator("[class*='grid'] a[href*='/propiedades/']").first()).toBeVisible();
  });

  test("search navigates to /comprar with query params", async ({ page }) => {
    await page.goto("/");
    await page.fill("input[name='q']", "Miami");
    await page.selectOption("select[name='budget']", "500k");
    await page.click("button[type='submit']");
    await page.waitForURL(/\/comprar\?/);
    expect(page.url()).toContain("q=Miami");
    expect(page.url()).toContain("budget=500k");
  });

  test("/comprar renders sale listings with heading", async ({ page }) => {
    await page.goto("/comprar");
    await expect(page.locator("h1")).toContainText("Propiedades en venta");
  });

  test("/rentar renders rental listings with heading", async ({ page }) => {
    await page.goto("/rentar");
    await expect(page.locator("h1")).toContainText("renta");
  });

  test("search with no results shows empty message", async ({ page }) => {
    await page.goto("/comprar?q=zzzznonexistent");
    await expect(page.getByText("No hay propiedades")).toBeVisible();
  });

  test("property detail page renders listing info", async ({ page }) => {
    await page.goto("/comprar");
    const firstCard = page.locator("a[href*='/propiedades/']").first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();
    await page.waitForURL(/\/propiedades\//);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByText("$")).toBeVisible();
  });

  test("i18n toggle switches language", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("proxima casa");
    const switcher = page.getByRole("button", { name: /english|español/i });
    await switcher.click();
    await expect(page.locator("h1")).not.toContainText("proxima casa");
  });

  test("search operation toggle switches between buy and rent routes", async ({ page }) => {
    await page.goto("/");
    await page.selectOption("select[name='operacion']", "rent");
    await page.click("button[type='submit']");
    await page.waitForURL(/\/rentar/);
  });
});
