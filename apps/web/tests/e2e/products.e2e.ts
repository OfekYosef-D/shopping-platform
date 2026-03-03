import { test, expect } from '@playwright/test';

test('products page has title and displays products or empty state', async ({ page }) => {
  await page.goto('/products');

  // Expect the localized products heading
  await expect(page.locator('h1')).toContainText('מזרונים, כריות ועוד');

  // Check if there are products or the empty state message
  const emptyState = page.getByText(/אין כרגע מוצרים במלאי|כרגע אין מוצרים להצגה/, { exact: false });
  const productItems = page.locator('[data-testid="product-card"]');

  // Wait for either the empty state or at least one product to be visible
  await expect(emptyState.or(productItems.first())).toBeVisible();
});
