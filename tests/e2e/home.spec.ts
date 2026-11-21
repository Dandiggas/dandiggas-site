import { test, expect } from "@playwright/test";

test("seam bar on mobile, seam pill on desktop", async ({ page }, info) => {
  await page.goto("/");
  const bar = page.getByTestId("seam-bar");
  if (info.project.name === "mobile") {
    await expect(bar).toBeVisible();
    await expect(bar).toContainText("Dan Diggas");
    await expect(bar).toContainText("Keys open doors");
    // Between the two panels (after the panels' rise-in has settled).
    await page.evaluate(() =>
      Promise.all(
        document.getAnimations()
          .filter((x) => (x as CSSAnimation).animationName === "rise-in")
          .map((x) => x.finished),
      ),
    );
    const panels = page.locator(".split-panel");
    const a = await panels.nth(0).boundingBox();
    const b = await bar.boundingBox();
    const c = await panels.nth(1).boundingBox();
    expect(b!.y).toBeGreaterThanOrEqual(a!.y + a!.height - 1);
    expect(c!.y).toBeGreaterThanOrEqual(b!.y + b!.height - 1);
  } else {
    await expect(bar).toBeHidden();
    await expect(page.locator(".split-panels >> text=Keys open doors").last()).toBeVisible();
  }
});

test("now strip has three links and the meet section three cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".now-strip a.cell")).toHaveCount(3);
  await expect(page.locator(".now-strip")).toContainText("Brim · 0.1.12");
  await expect(page.locator(".meet .card")).toHaveCount(3);
});
