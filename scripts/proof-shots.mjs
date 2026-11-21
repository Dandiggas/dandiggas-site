// Proof screenshots and clips for the redesign, from a headless browser
// against the built site. Needs both servers running:
//   npm run build && npm run start -- -p 3456
//   NEXT_DIST_DIR=.next-ready NEXT_PUBLIC_BUTTONDOWN_USERNAME=example npm run build && NEXT_DIST_DIR=.next-ready npm run start -- -p 3457
// Output: .agent/proof/{page}-{width}-{scheme}-{motion}.png, crops, clips.
import { chromium } from "@playwright/test";
import { mkdirSync, renameSync } from "fs";
import path from "path";

const BASE = "http://localhost:3456";
const READY = "http://localhost:3457";
const OUT = path.join(process.cwd(), ".agent/proof");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function open({ width, scheme = "light", motion = "no-preference", base = BASE, video } = {}) {
  const ctx = await browser.newContext({
    viewport: { width, height: width >= 1000 ? 900 : 844 },
    deviceScaleFactor: width >= 1000 ? 1 : 2,
    colorScheme: scheme,
    reducedMotion: motion,
    isMobile: width < 1000,
    hasTouch: width < 1000,
    ...(video ? { recordVideo: { dir: OUT, size: { width, height: 900 } } } : {}),
  });
  const page = await ctx.newPage();
  return { ctx, page, base };
}

// Scroll the whole page once so every reveal has fired and lazy images load.
async function warm(page) {
  await page.evaluate(async () => {
    const step = 500;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(1600);
}

const name = (p) => (p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "-"));

async function full(route, opts) {
  const { ctx, page, base } = await open(opts);
  await page.goto(base + route, { waitUntil: "networkidle" });
  if (opts.motion !== "reduce") await warm(page);
  else await page.waitForTimeout(400); // reduce motion: no scrolling at all
  const motion = opts.motion === "reduce" ? "reduce" : "motion";
  const file = `${name(route)}-${opts.width}-${opts.scheme ?? "light"}-${motion}.png`;
  await page.screenshot({ path: path.join(OUT, file), fullPage: true });
  await ctx.close();
  console.log(file);
}

async function crop(route, selector, file, opts) {
  const { ctx, page, base } = await open(opts);
  await page.goto(base + route, { waitUntil: "networkidle" });
  await warm(page);
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  if (opts.before) await opts.before(page);
  await el.screenshot({ path: path.join(OUT, file) });
  await ctx.close();
  console.log(file);
}

const pages = ["/", "/tech", "/posts/my-agents-say-done", "/about"];
for (const p of pages) {
  await full(p, { width: 1440 });
  await full(p, { width: 1440, scheme: "dark" });
  await full(p, { width: 390 });
  await full(p, { width: 1440, motion: "reduce" });
}
await full("/tech", { width: 390, motion: "reduce" });
await full("/now", { width: 1440 });
await full("/now", { width: 390 });
await full("/music", { width: 1440, motion: "reduce" });
await full("/brim", { width: 1440 });

// Follow paths
for (const w of [1440, 390]) {
  await crop("/tech", ".now-card", `follow-tech-now-card-${w}.png`, { width: w });
  await crop("/tech", "#subscribe", `follow-tech-keep-up-${w}.png`, { width: w });
  await crop("/about", "footer.site-footer", `follow-footer-${w}.png`, { width: w });
  await crop("/posts/my-agents-say-done", ".keep-box", `follow-post-keep-up-${w}.png`, { width: w });
}

// Email form: coming soon (default build), ready (build with a username), invalid
for (const w of [1440, 390]) {
  await crop("/tech", "#subscribe", `email-coming-soon-${w}.png`, { width: w });
  await crop("/tech", "#subscribe", `email-ready-${w}.png`, { width: w, base: READY });
}
await crop("/tech", "#subscribe", "email-invalid-1440.png", {
  width: 1440,
  base: READY,
  before: async (page) => {
    await page.locator('#subscribe input[name="email"]').fill("not-an-email");
    await page.locator("#subscribe button").click();
    await page.waitForTimeout(300);
  },
});

// Clips: record the browser page only.
async function clip(file, run) {
  const { ctx, page } = await open({ width: 1440, video: true });
  await run(page);
  const v = page.video();
  await ctx.close();
  renameSync(await v.path(), path.join(OUT, file));
  console.log(file);
}

await clip("motion-tech.webm", async (page) => {
  await page.goto(BASE + "/tech", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const ledgerTop = await page.locator("#ledger").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  for (let y = 600; y < ledgerTop; y += 600) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "smooth" }), y);
    await page.waitForTimeout(700);
  }
  await page.locator("#ledger").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.locator("#ledger a.ledger-row").nth(1).hover();
  await page.waitForTimeout(900);
  await page.getByRole("button", { name: "Proof", exact: true }).click();
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(900);
  await page.locator(".start .card").first().hover();
  await page.waitForTimeout(1200);
});

await clip("motion-post.webm", async (page) => {
  await page.goto(BASE + "/posts/my-agents-say-done", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  for (let i = 0; i < 14; i++) {
    await page.mouse.wheel(0, 650);
    await page.waitForTimeout(650);
  }
});

await browser.close();
