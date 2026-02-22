import { test, expect } from '@playwright/test';

test('homepage has title and link to products', async ({ page }) => {
  await page.goto('/');

  // Expect the main heading to contain "Premium Shopping"
  await expect(page.locator('h1')).toContainText('Premium Shopping');

  // Expect a link to products
  const productsLink = page.getByRole('link', { name: 'Browse Products' });
  await expect(productsLink).toBeVisible();
  await expect(productsLink).toHaveAttribute('href', '/products');
});
