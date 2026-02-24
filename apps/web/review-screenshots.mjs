// Design review screenshot script — run as a Playwright test
// npx playwright test review-screenshots.mjs --config=playwright.review.config.ts
import { test, chromium } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "playwright-screenshots");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGES = [
  { name: "01-home", url: "/" },
  { name: "02-products", url: "/products" },
  { name: "03-cart-empty", url: "/cart" },
  { name: "04-login", url: "/login" },
  { name: "05-register", url: "/register" },
];

test("capture design screenshots", async () => {
  const browser = await chromium.launch({ headless: true });

  for (const { name, url } of PAGES) {
    // Desktop dark
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`http://localhost:3000${url}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(OUT_DIR, `${name}-dark.png`), fullPage: true });

    // Desktop light
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT_DIR, `${name}-light.png`), fullPage: true });
    await page.close();

    // Mobile dark
    const mob = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mob.goto(`http://localhost:3000${url}`, { waitUntil: "networkidle" });
    await mob.waitForTimeout(600);
    await mob.screenshot({ path: path.join(OUT_DIR, `${name}-mobile.png`), fullPage: true });
    await mob.close();
    console.log(`✓ ${name}`);
  }

  await browser.close();
  console.log(`\nScreenshots saved to: ${OUT_DIR}`);
});
