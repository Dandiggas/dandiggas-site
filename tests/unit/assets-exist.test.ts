import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { PROJECTS } from "@/content/projects";
import { FEATURED } from "@/content/featured";
import { STAGE_TRACK } from "@/content/about-tracks";
import { MEET_CARDS } from "@/content/meet";

const pub = (p: string) => path.join(process.cwd(), "public", p);

const paths: string[] = [
  ...PROJECTS.flatMap((p) => (p.shot ? [p.shot] : [])),
  ...FEATURED.flatMap((f) => (f.shot ? [f.shot] : [])),
  ...STAGE_TRACK.flatMap((t) => t.covers ?? []),
  ...MEET_CARDS.map((m) => m.shot),
  "/about-me.jpg",
  "/tech/engineer-2.jpg",
  "/music/keys-warm.jpg",
];

describe("every image path resolves to a file", () => {
  it.each(paths)("%s", (p) => {
    expect(fs.existsSync(pub(p))).toBe(true);
  });

  it("the Open Graph images exist in src/app", () => {
    for (const f of ["opengraph-image.png", "twitter-image.png", "opengraph-image.alt.txt"]) {
      expect(fs.existsSync(path.join(process.cwd(), "src/app", f))).toBe(true);
    }
  });

  it("the check fails on a missing file (fixture)", () => {
    expect(fs.existsSync(pub("/blog/does-not-exist.png"))).toBe(false);
  });
});
