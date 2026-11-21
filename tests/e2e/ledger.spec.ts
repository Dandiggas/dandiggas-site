import { test, expect } from "@playwright/test";

test("28 rows; the Proof chip narrows to 5; All restores", async ({ page }) => {
  await page.goto("/tech");
  const rows = page.locator("#ledger a.ledger-row");
  await expect(rows).toHaveCount(28);
  await page.getByRole("button", { name: "Proof", exact: true }).click();
  await expect(page.getByRole("button", { name: "Proof", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#ledger a.ledger-row:visible")).toHaveCount(5);
  await expect(page.locator('#ledger .theme-block[data-theme="memory"]')).toBeHidden();
  await page.getByRole("button", { name: /^All 28$/ }).click();
  await expect(page.locator("#ledger a.ledger-row:visible")).toHaveCount(28);
});

test("theme labels are sticky at desktop", async ({ page }, info) => {
  test.skip(info.project.name === "mobile", "labels are static on mobile by design");
  await page.goto("/tech");
  const pos = await page.locator("#ledger .theme-block .label").first().evaluate((el) => getComputedStyle(el).position);
  expect(pos).toBe("sticky");
});

test("start here has three cards and the projects section has four shots", async ({ page }) => {
  await page.goto("/tech");
  await expect(page.locator(".start .card")).toHaveCount(3);
  await expect(page.locator("#projects .built .card")).toHaveCount(4);
  await expect(page.locator("#projects .more-row")).toHaveCount(6);
});
