import { test, expect } from '@playwright/test';

test('products page has title and displays products or empty state', async ({ page }) => {
  await page.goto('/products');

  // Expect the main heading to contain "Products"
  await expect(page.locator('h1')).toContainText('Products');

  // Check if there are products or the empty state message
  const emptyState = page.getByText('No products yet.');
  const productItems = page.locator('.group');

  // Wait for either the empty state or at least one product to be visible
  await Promise.race([
    expect(emptyState).toBeVisible(),
    expect(productItems.first()).toBeVisible()
  ]);
});
