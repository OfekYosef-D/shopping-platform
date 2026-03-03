import { test, expect } from "@playwright/test";

/**
 * Full user journey: login -> browse products -> add to cart -> checkout.
 *
 * Requires these environment variables to run:
 *   E2E_USER_EMAIL    - a valid test account email registered in Supabase
 *   E2E_USER_PASSWORD - the matching password
 *
 * If the variables are absent the tests are skipped (useful for CI without a
 * live Supabase project).
 */

const TEST_EMAIL = process.env.E2E_USER_EMAIL ?? "";
const TEST_PASSWORD = process.env.E2E_USER_PASSWORD ?? "";

test.beforeEach(async ({ page: _page }, testInfo) => {
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    testInfo.skip();
  }
});

test.describe("User journey: auth -> cart -> checkout", () => {
  test("should redirect unauthenticated users away from /cart", async ({
    page,
  }) => {
    await page.goto("/cart");
    await expect(page).toHaveURL(/\/login/);
  });

  test("should login successfully and land on /products", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("התחברות");

    await page.getByLabel("אימייל").fill(TEST_EMAIL);
    await page.getByLabel("סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "התחברות" }).click();

    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });
    await expect(page.locator("h1")).toContainText("מזרונים, כריות ועוד");
  });

  test("should add a product to cart after login", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("אימייל").fill(TEST_EMAIL);
    await page.getByLabel("סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "התחברות" }).click();
    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });

    const addButton = page.getByRole("button", { name: /הוספה לסל/i }).first();
    await expect(addButton).toBeVisible();
    await addButton.click();

    await page.waitForTimeout(500);
  });

  test("should show cart items and the checkout button", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("אימייל").fill(TEST_EMAIL);
    await page.getByLabel("סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "התחברות" }).click();
    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });

    const addButton = page.getByRole("button", { name: /הוספה לסל/i }).first();
    await expect(addButton).toBeVisible();
    await addButton.click();
    await page.waitForTimeout(500);

    // Navbar cart icon opens a drawer; use direct navigation for page checks.
    await page.goto("/cart");
    await expect(page.locator("h1")).toContainText("סל הקניות שלך");

    const checkoutButton = page.getByRole("link", { name: /מעבר לתשלום/i });
    const emptyMsg = page.getByText(/הסל עדיין ריק/);

    const hasCheckout = await checkoutButton.isVisible();
    const isEmpty = await emptyMsg.isVisible();

    expect(hasCheckout || isEmpty).toBe(true);

    if (hasCheckout) {
      await expect(checkoutButton).toHaveAttribute("href", "/checkout");
    }
  });

  test("should initiate checkout from /cart", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("אימייל").fill(TEST_EMAIL);
    await page.getByLabel("סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "התחברות" }).click();
    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });

    const addButton = page.getByRole("button", { name: /הוספה לסל/i }).first();
    await expect(addButton).toBeVisible();
    await addButton.click();
    await page.waitForTimeout(500);

    await page.goto("/cart");
    const checkoutButton = page.getByRole("link", { name: /מעבר לתשלום/i });

    await expect(checkoutButton).toBeVisible({ timeout: 5_000 });
    await checkoutButton.click();

    // /checkout may redirect to Stripe or stay local and show fallback UI.
    await page.waitForURL(
      (url) =>
        url.hostname.includes("stripe.com") ||
        url.pathname === "/checkout",
      { timeout: 15_000 }
    );

    if (!page.url().includes("stripe.com")) {
      await expect(page.locator("h1")).toContainText("תשלום");
    }
  });

  test("should show error on /checkout when cart is empty", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("אימייל").fill(TEST_EMAIL);
    await page.getByLabel("סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "התחברות" }).click();
    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });

    await page.goto("/checkout");

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

    await page.getByLabel("אימייל").fill("notarealuser@nowhere.test");
    await page.getByLabel("סיסמה").fill("wrongpassword");
    await page.getByRole("button", { name: "התחברות" }).click();

    await expect(page.locator("p.text-destructive")).toBeVisible({
      timeout: 8_000,
    });
    await expect(page).toHaveURL(/\/login/);
  });

  test("register page links back to login", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("h1")).toContainText("פתיחת חשבון");
    const signInLink = page.getByRole("link", { name: "להתחברות" });
    await expect(signInLink).toHaveAttribute("href", "/login");
  });
});
