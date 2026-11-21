import { describe, expect, it } from "vitest";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { FEATURED } from "@/content/featured";
import { formatNumber } from "@/lib/format";

describe("numbers come from the post body", () => {
  const withNumbers = getAllPosts().filter((p) => p.numbers.length > 0);

  it("the three Start-here posts carry numbers", () => {
    expect(withNumbers.map((p) => p.slug).sort()).toEqual(
      ["i-stopped-writing-rules-for-my-ai-agents", "my-agents-say-done", "the-drawing-is-the-spec"],
    );
  });

  for (const p of withNumbers) {
    for (const n of p.numbers) {
      it(`${p.slug}: "${n.value}" appears in the body`, () => {
        expect(p.content).toContain(n.value);
      });
    }
  }

  for (const f of FEATURED) {
    it(`featured ${f.slug}: big number ${f.big} appears in the body`, () => {
      const post = getPostBySlug(f.slug);
      expect(post).not.toBeNull();
      expect(post!.content).toContain(formatNumber(f.big));
    });
  }

  it("the check catches an invented number (fixture)", () => {
    const body = "We shipped 10 changes.";
    expect(body.includes("999")).toBe(false);
  });
});
