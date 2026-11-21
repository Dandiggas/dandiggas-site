import { test, expect, type Locator, type Page } from "@playwright/test";

// Regression: with "reduce motion" on, hovers still moved things (cards lifted,
// the theme toggle rotated, ledger rows shifted); CSS only shortened the
// transition. And turning reduce motion on after load still let off-screen
// counters count up when reached.

async function movement(target: Locator) {
  return target.evaluate((el) => {
    const s = getComputedStyle(el);
    return { transform: s.transform, paddingLeft: s.paddingLeft };
  });
}

async function hoverAndRead(page: Page, target: Locator, probe: Locator = target) {
  await target.scrollIntoViewIfNeeded();
  await target.hover();
  await page.waitForTimeout(700); // longer than any hover transition
  return movement(probe);
}

test.describe("reduce motion on", () => {
  test.use({ reducedMotion: "reduce" });

  test("hovering moves nothing", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "hover needs a mouse");
    await page.goto("/tech");
    const toggle = page.getByRole("button", { name: "Toggle dark mode" });
    expect((await hoverAndRead(page, toggle)).transform).toBe("none");

    const card = page.locator(".start .card").first();
    expect((await hoverAndRead(page, card)).transform).toBe("none");

    const row = page.locator("#ledger a.ledger-row").first();
    const r = await hoverAndRead(page, row);
    expect(r.paddingLeft).toBe("0px");
    expect((await movement(row.locator(".arr"))).transform).toBe("none");

    const shot = page.locator("#projects .built .card").first();
    expect((await hoverAndRead(page, shot, shot.locator(".shot img"))).transform).toBe("none");
  });
});

test.describe("motion allowed", () => {
  test.use({ reducedMotion: "no-preference" });

  // The control: the same hovers do move with motion on, so the test above
  // is measuring something real.
  test("hovering moves the toggle, card and row", async ({ page }, info) => {
    test.skip(info.project.name === "mobile", "hover needs a mouse");
    await page.goto("/tech");
    const toggle = page.getByRole("button", { name: "Toggle dark mode" });
    expect((await hoverAndRead(page, toggle)).transform).not.toBe("none");
    const card = page.locator(".start .card").first();
    expect((await hoverAndRead(page, card)).transform).not.toBe("none");
    const row = page.locator("#ledger a.ledger-row").first();
    expect((await hoverAndRead(page, row)).paddingLeft).toBe("8px");
  });

  test("reduce motion turned on after load: off-screen counters never count", async ({ page }) => {
    await page.goto("/tech");
    const counter = page.locator("[data-final]").last();
    const below = await counter.evaluate((el) => el.getBoundingClientRect().top > window.innerHeight);
    expect(below, "the counter starts off-screen").toBe(true);

    await page.emulateMedia({ reducedMotion: "reduce" });
    const want = await counter.getAttribute("data-final");
    // Watch every frame from before the scroll until well after a count would end.
    await counter.evaluate((el) => {
      const seen: string[] = [];
      (window as unknown as { __seen: string[] }).__seen = seen;
      const start = performance.now();
      const tick = () => {
        seen.push((el.textContent || "").trim());
        if (performance.now() - start < 2500) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await counter.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2700);
    const seen = await page.evaluate(() => (window as unknown as { __seen: string[] }).__seen);
    expect(seen.length).toBeGreaterThan(10);
    expect(new Set(seen)).toEqual(new Set([want]));
  });
});
