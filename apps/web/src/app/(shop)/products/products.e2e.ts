import { test, expect } from '@playwright/test';

test('products page has title and displays products or empty state', async ({ page }) => {
  await page.goto('/products');

  // Expect the main heading to contain "Our Collection"
  await expect(page.locator('h1')).toContainText('Our Collection');

  // Check if there are products or the empty state message
  const emptyState = page.getByText('No products yet.', { exact: false });
  const productItems = page.locator('[data-testid="product-card"]');

  // Wait for either the empty state or at least one product to be visible
  await expect(emptyState.or(productItems.first())).toBeVisible();
});
