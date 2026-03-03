import { test, expect } from '@playwright/test';

test('homepage has title and link to products', async ({ page }) => {
  await page.goto('/');

  // Expect the main heading to contain the brand name
  await expect(page.locator('h1')).toContainText('בית השינה');

  // Expect a primary link to products
  const productsLink = page.getByRole('link', { name: 'מעבר לחנות' }).first();
  await expect(productsLink).toBeVisible();
  await expect(productsLink).toHaveAttribute('href', '/products');
});
