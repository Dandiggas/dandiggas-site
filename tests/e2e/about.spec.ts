import { test, expect } from "@playwright/test";

test("about: facts, two tracks, bridge, two buttons, no icon row", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator(".facts .stat")).toHaveCount(4);
  await expect(page.locator(".facts b")).toHaveText(["30", "15", /^\d+$/, "1"]);
  const left = page.locator('[data-track="stage"] .entry');
  await expect(left).toHaveCount(10);
  await expect(left.locator(".yr").first()).toHaveText("2025");
  await expect(left.locator(".yr").last()).toHaveText("2011");
  await expect(page.locator('[data-track="systems"] .entry')).toHaveCount(8);
  await expect(page.locator(".bridge")).toContainText("Brim · The Shed · Keyboard Manual Assistant · AI Studio Agent");
  await expect(page.locator(".elsewhere .btn")).toHaveText(["Explore the tech →", "See the music →"]);
  // The social icon row is gone from the main content (it lives in the footer).
  await expect(page.locator('main a[aria-label="GitHub"], main a[aria-label="Instagram"]')).toHaveCount(0);
});

test("mobile: the right column gets its own Systems eyebrow", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/about");
  await expect(page.locator(".col-eyebrow")).toBeVisible();
});
