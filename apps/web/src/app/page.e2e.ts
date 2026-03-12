import { test, expect } from "@playwright/test";

test("homepage has title and link to products", async ({ page }) => {
  await page.goto("/");

  // Expect the main heading to contain the brand name
  await expect(page.locator("h1")).toContainText("שינה ישירה");

  // Expect a products call-to-action link
  const productsLink = page
    .getByRole("link", { name: "לצפייה במוצרים" })
    .first();
  await expect(productsLink).toBeVisible();
  await expect(productsLink).toHaveAttribute("href", "/products");
});
