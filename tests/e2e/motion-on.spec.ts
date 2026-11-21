import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

test("a reveal below the fold is hidden until it scrolls into view", async ({ page }) => {
  await page.goto("/tech");
  const target = page.locator("#projects .section-head");
  await expect.poll(() => target.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
  await target.scrollIntoViewIfNeeded();
  await expect.poll(() => target.evaluate((el) => getComputedStyle(el).opacity), { timeout: 4000 }).toBe("1");
});

test("a count-up ends on the final number", async ({ page }) => {
  await page.goto("/tech");
  const stat = page.locator(".counts [data-final]").nth(1);
  const final = await stat.getAttribute("data-final");
  expect(final).toBe("7,785");
  await expect(stat).toHaveText(final!, { timeout: 4000 });
});

test("the reading progress bar grows as you scroll a post", async ({ page }) => {
  await page.goto("/posts/my-agents-say-done");
  const bar = page.locator(".progress");
  const w0 = await bar.evaluate((el) => el.getBoundingClientRect().width);
  await page.mouse.wheel(0, 2500);
  await expect.poll(() => bar.evaluate((el) => el.getBoundingClientRect().width)).toBeGreaterThan(w0 + 50);
});
