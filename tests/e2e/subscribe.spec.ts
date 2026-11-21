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

  test("valid address: posts the exact form to Buttondown, nothing leaves the machine", async ({ page, context }) => {
    // Block every request that is not to this local test server, so nothing
    // is ever delivered to the real service or anyone else.
    const escaped: string[] = [];
    await context.route(
      (url) => url.hostname !== "localhost" && url.hostname !== "127.0.0.1",
      (route) => {
        escaped.push(route.request().url());
        return route.abort();
      },
    );
    // Registered last, so it wins for Buttondown: record the submit and
    // answer it locally instead of letting it go out.
    const submits: { url: string; method: string; body: string | null; contentType: string | undefined }[] = [];
    await context.route("https://buttondown.com/**", (route) => {
      const req = route.request();
      submits.push({ url: req.url(), method: req.method(), body: req.postData(), contentType: req.headers()["content-type"] });
      return route.fulfill({ status: 200, contentType: "text/html", body: "<title>stub</title>stub" });
    });

    await page.goto("/tech#subscribe");
    await page.locator('#subscribe input[name="email"]').fill("reader@example.com");
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      page.locator("#subscribe").getByRole("button", { name: "Get the next post" }).click(),
    ]);
    await expect.poll(() => submits.length).toBe(1);
    await popup.waitForLoadState();

    const [submit] = submits;
    expect(submit.url).toBe(ACTION);
    expect(submit.method).toBe("POST");
    expect(submit.contentType).toContain("application/x-www-form-urlencoded");
    const fields = new URLSearchParams(submit.body ?? "");
    expect(fields.get("email")).toBe("reader@example.com");
    expect(fields.get("tag")).toBe("tech-site");
    expect([...fields.keys()].sort()).toEqual(["email", "tag"]);

    // The new tab landed on the exact action URL (our stub), not an error page.
    expect(popup.url()).toBe(ACTION);
    expect(await popup.title()).toBe("stub");
    expect(escaped.filter((u) => u.startsWith("https://buttondown.com"))).toEqual([]);
    await expect(page.locator("#subscribe .note")).toContainText("Opened Buttondown in a new tab.");
  });
});
