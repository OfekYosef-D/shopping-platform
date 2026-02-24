import { test, expect } from '@playwright/test';

test('homepage has title and link to products', async ({ page }) => {
  await page.goto('/');

  // Expect the main heading to contain the brand name
  await expect(page.locator('h1')).toContainText('Mizronim');

  // Expect a "Shop Now" link to products
  const productsLink = page.getByRole('link', { name: 'Shop Now' }).first();
  await expect(productsLink).toBeVisible();
  await expect(productsLink).toHaveAttribute('href', '/products');
});
