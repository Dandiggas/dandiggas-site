import { test, expect, type Page } from "@playwright/test";

// Regression test for the live bug: with "reduce motion" on, section headings
// on /tech and /music stayed at opacity 0 forever. Everything must be visible
// on first load, with no scrolling, when the visitor asks for less motion.
test.use({ reducedMotion: "reduce" });

const ROUTES = ["/tech", "/music", "/", "/about", "/posts/my-agents-say-done"];

// Opacity as the reader sees it: the element's own opacity times every ancestor's.
async function hiddenHeadings(page: Page) {
  return page.evaluate(() => {
    const effective = (el: Element | null) => {
      let o = 1;
      for (let n = el; n && n instanceof HTMLElement; n = n.parentElement) {
        o *= parseFloat(getComputedStyle(n).opacity);
      }
      return o;
    };
    return Array.from(document.querySelectorAll("main h1, main h2, main h3"))
      .filter((h) => effective(h) < 0.99)
      .map((h) => (h.textContent || "").trim().slice(0, 60));
  });
}

async function hiddenMotionPieces(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".reveal, .rise, .words .w"))
      .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99)
      .map((el) => el.className + ": " + (el.textContent || "").trim().slice(0, 40)),
  );
}

for (const route of ROUTES) {
  test(`everything is visible at load with reduce motion on: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    // A short settle: anything still at 0 now is never coming back.
    await page.waitForTimeout(600);
    expect(await hiddenHeadings(page)).toEqual([]);
    expect(await hiddenMotionPieces(page)).toEqual([]);

    // Count-ups show their final number at once.
    const stats = await page.$$eval("[data-final]", (els) =>
      els.map((el) => ({ want: el.getAttribute("data-final"), got: (el.textContent || "").trim() })),
    );
    for (const s of stats) expect(s.got).toBe(s.want);

    // The live dot is a still dot.
    const live = await page.$$eval(".live", (els) => els.map((el) => getComputedStyle(el).animationName));
    for (const name of live) expect(name).toBe("none");

    // Nothing is still animating (hero drift, rise, pulse).
    const running = await page.evaluate(() =>
      document.getAnimations().filter((a) => a.playState === "running" && (a as CSSAnimation).animationName !== "marquee-x").length,
    );
    expect(running).toBe(0);
  });
}
