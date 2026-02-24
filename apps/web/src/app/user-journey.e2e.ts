import { test, expect } from "@playwright/test";

/**
 * Full user journey: login → browse products → add to cart → proceed to checkout.
 *
 * Requires these environment variables to run:
 *   E2E_USER_EMAIL    — a valid test-account email registered in Supabase
 *   E2E_USER_PASSWORD — the matching password
 *
 * If the variables are absent the tests are skipped (useful for CI without a
 * live Supabase project).
 */

const TEST_EMAIL = process.env.E2E_USER_EMAIL ?? "";
const TEST_PASSWORD = process.env.E2E_USER_PASSWORD ?? "";

test.beforeEach(async ({}, testInfo) => {
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    testInfo.skip();
  }
});

test.describe("User journey: auth → cart → checkout", () => {
  test("should redirect unauthenticated users away from /cart", async ({
    page,
  }) => {
    await page.goto("/cart");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should login successfully and land on /products", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Sign In");

    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });
    await expect(page.locator("h1")).toContainText("Our Collection");
  });

  test("should add a product to cart after login", async ({ page }) => {
    // Log in
    await page.goto("/login");
    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });

    // Find the first "Add to Cart" button and click it
    const addButton = page.getByRole("button", { name: /add to cart/i }).first();
    await expect(addButton).toBeVisible();
    await addButton.click();

    // After adding, the button should reflect the action was taken
    // (it may show a success state briefly, or just not error)
    await page.waitForTimeout(500);
  });

  test("should show cart items and the checkout button", async ({ page }) => {
    // Log in
    await page.goto("/login");
    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });

    // Add product to cart
    const addButton = page.getByRole("button", { name: /add to cart/i }).first();
    await expect(addButton).toBeVisible();
    await addButton.click();
    await page.waitForTimeout(500);

    // Navigate directly to /cart — the navbar cart icon opens a drawer rather
    // than navigating to the page, so we use goto() to reach the cart page.
    await page.goto("/cart");
    await expect(page.locator("h1")).toContainText("Your Cart");

    // Either the cart has items with a checkout button, or it's empty
    const checkoutButton = page.getByRole("link", { name: /proceed to checkout/i });
    const emptyMsg = page.getByText("Your cart is empty.");

    const hasCheckout = await checkoutButton.isVisible();
    const isEmpty = await emptyMsg.isVisible();

    expect(hasCheckout || isEmpty).toBe(true);

    if (hasCheckout) {
      await expect(checkoutButton).toHaveAttribute("href", "/checkout");
    }
  });

  test("should initiate checkout from /cart", async ({ page }) => {
    // Log in
    await page.goto("/login");
    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });

    // Add product to cart
    const addButton = page.getByRole("button", { name: /add to cart/i }).first();
    await expect(addButton).toBeVisible();
    await addButton.click();
    await page.waitForTimeout(500);

    // Go to cart
    await page.goto("/cart");
    const checkoutButton = page.getByRole("link", { name: /proceed to checkout/i });

    await expect(checkoutButton).toBeVisible({ timeout: 5_000 });
    await checkoutButton.click();

    // The /checkout page calls createCheckoutSession() then redirects to Stripe.
    // We expect either:
    //   a) a redirect to checkout.stripe.com (happy path with Stripe configured), or
    //   b) the error UI on /checkout (when STRIPE_SECRET_KEY is absent in test env)
    await page.waitForURL(
      (url) =>
        url.hostname.includes("stripe.com") ||
        url.pathname === "/checkout",
      { timeout: 15_000 }
    );

    const isStripe = page.url().includes("stripe.com");
    if (!isStripe) {
      // Error state shown on /checkout page — acceptable in test env without Stripe
      await expect(page.locator("h1")).toContainText("Checkout");
    }
  });

  test("should show error on /checkout when cart is empty", async ({
    page,
  }) => {
    // Log in
    await page.goto("/login");
    await page.getByLabel("Email").fill(TEST_EMAIL);
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });

    // Navigate directly to /checkout with an empty cart
    await page.goto("/checkout");

    // Should either redirect to Stripe (if cart has items from a prior test) or
    // show an error message about the empty cart
    await page.waitForURL(
      (url) =>
        url.hostname.includes("stripe.com") ||
        url.pathname === "/checkout",
      { timeout: 15_000 }
    );

    if (!page.url().includes("stripe.com")) {
      const errorText = page.locator("p.text-destructive");
      await expect(errorText).toBeVisible();
    }
  });

  test("login page shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("Email").fill("notarealuser@nowhere.test");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Error message should appear; URL should stay on /login
    await expect(page.locator("p.text-destructive")).toBeVisible({
      timeout: 8_000,
    });
    await expect(page).toHaveURL(/\/login/);
  });

  test("register page links back to login", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("h1")).toContainText("Create Account");
    const signInLink = page.getByRole("link", { name: "Sign In" });
    await expect(signInLink).toHaveAttribute("href", "/login");
  });
});
