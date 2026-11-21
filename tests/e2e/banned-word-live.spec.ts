import { test, expect } from "@playwright/test";

const BANNED = new RegExp(["kr", "ak", "en"].join(""), "i");
const ROUTES = [
  "/", "/tech", "/posts/my-agents-say-done", "/about", "/now", "/feed.xml", "/music", "/brim",
  "/tech/keyboard-manual-assistant", "/workflows/hired", "/eshu/bank-callback",
];

test("no banned word in any route's HTML or the feed", async ({ request }) => {
  for (const r of ROUTES) {
    const res = await request.get(r);
    expect(res.status(), r).toBe(200);
    expect(BANNED.test(await res.text()), r).toBe(false);
  }
});

test("no banned word in any post page", async ({ request }) => {
  const xml = await (await request.get("/feed.xml")).text();
  const slugs = [...xml.matchAll(/<link>https:\/\/tech\.dandiggas\.com\/posts\/([^<]+)<\/link>/g)].map((m) => m[1]);
  expect(slugs.length).toBe(28);
  for (const s of slugs) {
    const html = await (await request.get(`/posts/${s}`)).text();
    expect(BANNED.test(html), s).toBe(false);
  }
});
