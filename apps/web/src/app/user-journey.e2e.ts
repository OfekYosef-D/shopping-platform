import { test, expect } from "@playwright/test";

const TEST_EMAIL = process.env.E2E_USER_EMAIL ?? "";
const TEST_PASSWORD = process.env.E2E_USER_PASSWORD ?? "";

test.beforeEach(async ({}, testInfo) => {
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    testInfo.skip();
  }
});

test.describe("מסע משתמש: התחברות -> סל -> תשלום", () => {
  test("redirect של משתמש לא מחובר מ-/cart ל-/login", async ({ page }) => {
    await page.goto("/cart");
    await expect(page).toHaveURL(/\/login/);
  });

  test("התחברות מצליחה ומעבירה ל-/products", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("התחברות");

    await page.getByLabel("אימייל").fill(TEST_EMAIL);
    await page.getByLabel("סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "התחברות" }).click();

    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });
    await expect(page.locator("h1")).toContainText("מזרנים וכריות");
  });

  test("הוספת מוצר לסל אחרי התחברות", async ({ page }) => {
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

  test("עמוד הסל מציג פריטים או מצב ריק", async ({ page }) => {
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
    await expect(page.locator("h1")).toContainText("הסל שלך");

    const checkoutButton = page.getByRole("link", { name: /לתשלום מאובטח/i });
    const emptyMsg = page.getByText("הסל עדיין ריק", { exact: false });

    const hasCheckout = await checkoutButton.isVisible();
    const isEmpty = await emptyMsg.isVisible();

    expect(hasCheckout || isEmpty).toBe(true);

    if (hasCheckout) {
      await expect(checkoutButton).toHaveAttribute("href", "/checkout");
    }
  });

  test("התחלת תשלום מתוך /cart", async ({ page }) => {
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
    const checkoutButton = page.getByRole("link", { name: /לתשלום מאובטח/i });

    await expect(checkoutButton).toBeVisible({ timeout: 5_000 });
    await checkoutButton.click();

    await page.waitForURL(
      (url) =>
        url.hostname.includes("stripe.com") || url.pathname === "/checkout",
      { timeout: 15_000 },
    );

    if (!page.url().includes("stripe.com")) {
      await expect(page.locator("h1")).toContainText("תשלום");
    }
  });

  test("שגיאה בעמוד /checkout כשהסל ריק", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("אימייל").fill(TEST_EMAIL);
    await page.getByLabel("סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "התחברות" }).click();
    await expect(page).toHaveURL(/\/products/, { timeout: 10_000 });

    await page.goto("/checkout");

    await page.waitForURL(
      (url) =>
        url.hostname.includes("stripe.com") || url.pathname === "/checkout",
      { timeout: 15_000 },
    );

    if (!page.url().includes("stripe.com")) {
      const errorText = page.locator("p.text-destructive");
      await expect(errorText).toBeVisible();
    }
  });

  test("עמוד התחברות מציג שגיאה על פרטי התחברות שגויים", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("אימייל").fill("notarealuser@nowhere.test");
    await page.getByLabel("סיסמה").fill("wrongpassword");
    await page.getByRole("button", { name: "התחברות" }).click();

    await expect(page.locator("p.text-destructive")).toBeVisible({
      timeout: 8_000,
    });
    await expect(page).toHaveURL(/\/login/);
  });

  test("עמוד הרשמה כולל קישור התחברות", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("h1")).toContainText("פתיחת חשבון");
    const signInLink = page.getByRole("link", { name: "התחברות" });
    await expect(signInLink).toHaveAttribute("href", "/login");
  });
});
