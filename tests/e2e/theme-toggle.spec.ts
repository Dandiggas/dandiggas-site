import { test, expect } from "@playwright/test";

test("toggling dark mode adds .dark and turns the page warm black", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/tech");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: "Toggle dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(22, 19, 15)"); // #16130f
});
