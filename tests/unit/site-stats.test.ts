import { describe, expect, it } from "vitest";
import { getSiteStats } from "@/lib/site-stats";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { gigs } from "@/lib/music";
import { formatNumber } from "@/lib/format";

describe("site stats", () => {
  const stats = getSiteStats();

  it("has six stats, with computed counts", () => {
    expect(stats).toHaveLength(6);
    expect(stats.find((s) => s.key === "posts")!.value).toBe(getAllPosts().length);
    expect(stats.find((s) => s.key === "sets")!.value).toBe(gigs.length);
  });

  for (const s of stats.filter((x) => x.sourceSlug)) {
    it(`${s.key} (${s.value}) appears in ${s.sourceSlug}`, () => {
      const post = getPostBySlug(s.sourceSlug!);
      expect(post).not.toBeNull();
      expect(post!.content).toContain(formatNumber(s.value));
    });
  }
});
