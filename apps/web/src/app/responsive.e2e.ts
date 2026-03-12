import { test, expect } from "@playwright/test";

test.describe("Responsive behavior", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("home page has no horizontal overflow on mobile", async ({ page }) => {
    await page.goto("/");

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
    await expect(
      page.getByRole("button", { name: /פתיחת תפריט/i }),
    ).toBeVisible();
  });

  test("products page keeps key controls visible on mobile", async ({
    page,
  }) => {
    await page.goto("/products");

    await expect(page.locator("h1")).toContainText("מזרנים וכריות");
    await expect(page.getByTestId("search-input")).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });
});
