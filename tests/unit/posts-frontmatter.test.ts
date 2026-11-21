import { describe, expect, it } from "vitest";
import { getAllPosts } from "@/lib/posts";
import { THEMES } from "@/content/themes";

describe("post front matter", () => {
  const posts = getAllPosts();
  const keys = THEMES.map((t) => t.key);

  it("has 28 posts", () => expect(posts.length).toBe(28));

  it.each(posts.map((p) => [p.slug, p]))("%s has a known theme, a stat and a line", (_slug, p) => {
    expect(keys).toContain(p.theme);
    expect(p.stat.trim()).not.toBe("");
    expect(p.line.trim()).not.toBe("");
  });

  it("theme counts match the plan (5/4/9/4/2/4)", () => {
    const counts = Object.fromEntries(keys.map((k) => [k, posts.filter((p) => p.theme === k).length]));
    expect(counts).toEqual({ proof: 5, guardrails: 4, memory: 9, security: 4, music: 2, platforms: 4 });
  });

  it("new front matter copy has no em dashes", () => {
    for (const p of posts) {
      expect(p.stat + p.line + p.numbers.map((n) => n.label).join("")).not.toMatch(/—/);
    }
  });
});
