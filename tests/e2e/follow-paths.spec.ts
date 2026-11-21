import { test, expect } from "@playwright/test";

const LINKEDIN = "https://www.linkedin.com/in/daniel-adekugbe-11a71859/";
const NEEDED = ["/feed.xml", "https://x.com/Dandiggastech", LINKEDIN, "/now"];

for (const route of ["/tech", "/posts/my-agents-say-done", "/now"]) {
  test(`follow links in the page body: ${route}`, async ({ page }) => {
    await page.goto(route);
    for (const href of NEEDED.filter((h) => !(route === "/now" && h === "/now"))) {
      await expect(page.locator(`main a[href="${href}"]`).first(), href).toBeAttached();
    }
  });
}

test("footer on /about carries every follow path", async ({ page }) => {
  await page.goto("/about");
  for (const href of NEEDED) await expect(page.locator(`footer a[href="${href}"]`)).toHaveCount(1);
});

test("feed, redirect and head link", async ({ page, request }) => {
  const res = await request.get("/feed.xml");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/rss+xml");
  const r = await request.get("/rss.xml", { maxRedirects: 0 });
  expect([301, 308]).toContain(r.status());
  expect(r.headers()["location"]).toMatch(/\/feed\.xml$/);
  await page.goto("/tech");
  await expect(page.locator('head link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute("href", /\/feed\.xml$/);
});
