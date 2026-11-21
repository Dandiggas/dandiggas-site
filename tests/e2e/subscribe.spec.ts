import { test, expect } from "@playwright/test";
import { READY_URL } from "../../playwright.config";

const ACTION = "https://buttondown.com/api/emails/embed-subscribe/example";

for (const route of ["/tech#subscribe", "/posts/my-agents-say-done", "/now"]) {
  test(`coming soon state (no username): ${route}`, async ({ page }) => {
    await page.goto(route);
    const box = page.locator('.subscribe[data-state="coming-soon"]').last();
    await expect(box.locator('input[type="email"]')).toBeDisabled();
    await expect(box.getByRole("button", { name: "Get the next post" })).toBeDisabled();
    await expect(box.getByRole("link", { name: "RSS feed" })).toHaveAttribute("href", "/feed.xml");
  });
}

test.describe("ready state (build with NEXT_PUBLIC_BUTTONDOWN_USERNAME=example)", () => {
  test.use({ baseURL: READY_URL });

  test("form posts to Buttondown in a new tab", async ({ page }) => {
    await page.goto("/tech#subscribe");
    const form = page.locator("#subscribe form");
    await expect(form).toHaveAttribute("action", ACTION);
    await expect(form).toHaveAttribute("method", "post");
    await expect(form).toHaveAttribute("target", "_blank");
    await expect(form.locator('input[name="email"]')).toBeEnabled();
    await expect(form.locator('input[name="tag"]')).toHaveValue("tech-site");
  });

  test("invalid address: native validation, no new tab", async ({ page }) => {
    await page.goto("/tech#subscribe");
    const input = page.locator('#subscribe input[name="email"]');
    await input.fill("not-an-email");
    let popped = false;
    page.context().on("page", () => (popped = true));
    await page.locator("#subscribe").getByRole("button", { name: "Get the next post" }).click();
    expect(await input.evaluate((el: HTMLInputElement) => el.matches(":invalid"))).toBe(true);
    await page.waitForTimeout(500);
    expect(popped).toBe(false);
  });

  test("valid address: opens Buttondown in a new page (not waited for)", async ({ page, context }) => {
    // Never touch the real service: abort the request at the network layer.
    await context.route("https://buttondown.com/**", (route) => route.abort());
    await page.goto("/tech#subscribe");
    await page.locator('#subscribe input[name="email"]').fill("reader@example.com");
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      page.locator("#subscribe").getByRole("button", { name: "Get the next post" }).click(),
    ]);
    await expect.poll(() => popup.url()).not.toBe("about:blank");
    expect(popup.url().startsWith(ACTION) || popup.url().startsWith("chrome-error://")).toBe(true);
    await expect(page.locator("#subscribe .note")).toContainText("Opened Buttondown in a new tab.");
  });
});
