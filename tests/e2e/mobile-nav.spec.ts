import { test, expect } from "@playwright/test";

// Regression: open the mobile menu, rotate the phone past 720px, and the menu
// stayed visible beside the desktop nav with its close button hidden.
test("an open mobile menu closes when the phone rotates past 720px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/tech");
  const menuButton = page.locator(".site-header .menu-btn");
  await menuButton.click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile" });
  await expect(mobileNav).toBeVisible();

  // Rotate: landscape on a large phone.
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(mobileNav).toBeHidden();
  await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Tech" })).toBeVisible();
  await expect(menuButton).toBeHidden();

  // Rotate back: the menu stays shut, ready to open again.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(mobileNav).toHaveCount(0);
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(menuButton).toHaveAttribute("aria-label", "Open menu");
});
