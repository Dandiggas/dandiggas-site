import { test, expect } from "@playwright/test";

test("header tag line shows at desktop, hides at mobile", async ({ page }, info) => {
  await page.goto("/tech");
  const tag = page.locator(".site-header .brand .tag");
  if (info.project.name === "mobile") await expect(tag).toBeHidden();
  else await expect(tag).toHaveText("Engineer · Musician");
});

test("footer has five columns and the bottom line", async ({ page }) => {
  await page.goto("/tech");
  const footer = page.locator("footer.site-footer");
  await expect(footer.locator("h4")).toHaveText(["Tech", "Music", "Follow", "Elsewhere"]);
  await expect(footer.locator(".cols > div")).toHaveCount(5);
  await expect(footer).toContainText("Keys open doors");
  await expect(footer).toContainText("Keys for the room and the record.");
});

test("header background is not pure white on /tech", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/tech");
  const bg = await page.locator(".site-header").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe("rgb(255, 255, 255)");
  expect(bg).not.toBe("rgba(255, 255, 255, 0.8)");
});

test("/brim footer links use Brim's ink colour", async ({ page }) => {
  await page.goto("/brim");
  const colour = await page.locator("footer.site-footer ul a").first().evaluate((el) => getComputedStyle(el).color);
  expect(colour).toBe("rgb(236, 238, 231)");
  const h4 = await page.locator("footer.site-footer h4").first().evaluate((el) => getComputedStyle(el).color);
  expect(h4).toBe("rgb(236, 238, 231)");
});

test("music anchors exist for the footer links", async ({ page }) => {
  await page.goto("/music");
  for (const id of ["credits", "live", "bookings"]) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await page.goto("/brim");
  await expect(page.locator("#download")).toHaveCount(1);
});

// Regression: an unlayered `h1, h2, h3 { color }` rule beat Tailwind's
// text-white, so the headings on the dark photos went dark.
test("headings on dark photos stay white (home split, music hero)", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Engineer", "Musician"]) {
    const c = await page.getByRole("heading", { name, exact: true }).evaluate((el) => getComputedStyle(el).color);
    expect(c, name).toBe("rgb(255, 255, 255)");
  }
  await page.goto("/music");
  const h1 = await page.locator("main h1").first().evaluate((el) => getComputedStyle(el).color);
  expect(h1).toBe("rgb(255, 255, 255)");
});
