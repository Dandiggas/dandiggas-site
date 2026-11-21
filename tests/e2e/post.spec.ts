import { test, expect } from "@playwright/test";

const SLUG = "my-agents-say-done";

test("head: standfirst, byline, portrait, thread pill", async ({ page }) => {
  await page.goto(`/posts/${SLUG}`);
  const feed = await (await page.request.get("/feed.xml")).text();
  const preview = feed.match(new RegExp(`<link>[^<]*${SLUG}</link>[\\s\\S]*?<description>([^<]*)</description>`))![1];
  const standfirst = (await page.locator(".standfirst").textContent())!;
  expect(standfirst.replace(/'/g, "&apos;")).toBe(preview);
  await expect(page.locator(".byline")).toContainText("Daniel Adekugbe");
  await expect(page.locator(".byline img")).toHaveAttribute("alt", "Daniel Adekugbe (Dan Diggas)");
  await expect(page.locator(".crumbs .pill")).toHaveText(/\d of 5 in this thread/);
});

test("outline: one link per H2, the active one follows the reader", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "the outline is hidden under 960px by design");
  await page.goto(`/posts/${SLUG}`);
  const h2s = await page.locator(".post-body h2").count();
  expect(h2s).toBeGreaterThan(2);
  await expect(page.locator(".post-outline a")).toHaveCount(h2s);
  // Regression: a class named "outline" picked up Tailwind's outline utility and drew a box.
  const style = await page.locator(".post-outline").evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(style).toBe("none");
  const first = await page.locator('.post-outline a[aria-current="true"]').textContent();
  await page.locator(".post-body h2").nth(h2s - 1).scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 200);
  await expect.poll(() => page.locator('.post-outline a[aria-current="true"]').textContent()).not.toBe(first);
});

test("proof figures and numbers", async ({ page }) => {
  await page.goto(`/posts/${SLUG}`);
  const figs = page.locator(".post-body figure.proof");
  await expect(figs).toHaveCount(2);
  await expect(figs.first().locator("figcaption .k")).toHaveText(/^Proof · (drawing|screenshot)$/);
  await expect(page.locator(".rail .nums .stat")).toHaveCount(4);
});

test("share links", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "share is hidden under 960px by design");
  await page.goto(`/posts/${SLUG}`);
  const url = encodeURIComponent(`https://tech.dandiggas.com/posts/${SLUG}`);
  await expect(page.locator(".share a", { hasText: "LinkedIn" })).toHaveAttribute(
    "href", `https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
  await expect(page.locator(".share a", { hasText: "X" })).toHaveAttribute("href", new RegExp(`^https://x\\.com/intent/post\\?url=${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}&text=`));
  const copy = page.locator(".share button");
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await copy.click();
  await expect(copy).toHaveText("Copied");
  await expect(copy).toHaveText("Copy link", { timeout: 3000 });
});

test("next in this thread has two cards; keep-up box present", async ({ page }) => {
  await page.goto(`/posts/${SLUG}`);
  await expect(page.locator(".next-thread .card")).toHaveCount(2);
  await expect(page.locator(".keep-box")).toBeVisible();
});

test("lightbox opens on image click and closes on Escape", async ({ page }) => {
  await page.goto(`/posts/${SLUG}`);
  const img = page.locator(".post-body figure.proof img").first();
  await img.scrollIntoViewIfNeeded();
  await img.click();
  const dialog = page.getByRole("dialog", { name: "Expanded image viewer" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("img")).toHaveAttribute("alt", /before and after/i);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("metadata: article Open Graph and large twitter card", async ({ page }) => {
  await page.goto(`/posts/${SLUG}`);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /opengraph-image/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
});
