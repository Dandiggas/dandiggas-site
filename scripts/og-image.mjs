// Renders scripts/og-image.html to the site-wide Open Graph and Twitter images
// (1200x630) with a headless browser. Run: node scripts/og-image.mjs
import { chromium } from "@playwright/test";
import { copyFileSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";

const root = process.cwd();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(path.join(root, "scripts/og-image.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const out = path.join(root, "src/app/opengraph-image.png");
await page.screenshot({ path: out });
copyFileSync(out, path.join(root, "src/app/twitter-image.png"));
await browser.close();
console.log("wrote", out);
