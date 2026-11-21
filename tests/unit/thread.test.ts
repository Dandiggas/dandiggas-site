import { describe, expect, it } from "vitest";
import { nextInThread, threadPosition } from "@/lib/thread";

const posts = [
  { slug: "p1", date: "2026-01-01", theme: "proof" },
  { slug: "p2", date: "2026-02-01", theme: "proof" },
  { slug: "p3", date: "2026-03-01", theme: "proof" },
  { slug: "m1", date: "2026-02-15", theme: "memory" },
  { slug: "m2", date: "2026-04-01", theme: "memory" },
  { slug: "s1", date: "2026-05-01", theme: "solo" },
];
const by = (s: string) => posts.find((p) => p.slug === s)!;

describe("thread", () => {
  it("position is oldest first, 1-based, over the theme size", () => {
    expect(threadPosition(by("p1"), posts)).toEqual({ index: 1, total: 3 });
    expect(threadPosition(by("p3"), posts)).toEqual({ index: 3, total: 3 });
    expect(threadPosition(by("m2"), posts)).toEqual({ index: 2, total: 2 });
  });

  it("card 1 is the next newer post in the theme; card 2 the newest post not shown", () => {
    expect(nextInThread(by("p1"), posts).map((p) => p.slug)).toEqual(["p2", "s1"]);
  });

  it("newest in its theme: card 1 falls back to the newest other post in the theme", () => {
    expect(nextInThread(by("p3"), posts).map((p) => p.slug)).toEqual(["p2", "s1"]);
  });

  it("card 2 skips the post itself and card 1", () => {
    expect(nextInThread(by("m1"), posts).map((p) => p.slug)).toEqual(["m2", "s1"]);
    expect(nextInThread(by("s1"), posts).map((p) => p.slug)).toEqual(["m2"]);
  });
});
