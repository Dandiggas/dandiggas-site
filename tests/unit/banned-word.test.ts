import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

// The banned word is built from pieces so this file does not contain it.
const BANNED = new RegExp(["kr", "ak", "en"].join(""), "i");
const ROOT = process.cwd();

const SKIP_DIRS = new Set(["node_modules", ".next", ".next-ready", ".git", ".agent", "test-results", "playwright-report"]);
const TEXT_EXT = /\.(ts|tsx|js|mjs|cjs|mts|json|md|css|txt|svg|html|xml|yml|yaml)$/i;

export type Hit = { file: string; where: "name" | "content" };

// Pure scanner: takes (path, read-content) pairs so it can be tested on a fixture.
export function scan(entries: { file: string; content?: string }[]): Hit[] {
  const hits: Hit[] = [];
  for (const e of entries) {
    if (BANNED.test(e.file)) hits.push({ file: e.file, where: "name" });
    if (e.content !== undefined && BANNED.test(e.content)) hits.push({ file: e.file, where: "content" });
  }
  return hits;
}

function walk(dir: string, readContent: boolean, out: { file: string; content?: string }[]) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const rel = path.relative(ROOT, full);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      out.push({ file: rel });
      walk(full, readContent, out);
    } else {
      out.push({ file: rel, content: readContent && TEXT_EXT.test(name) ? fs.readFileSync(full, "utf8") : undefined });
    }
  }
}

function siteEntries() {
  const out: { file: string; content?: string }[] = [];
  walk(path.join(ROOT, "src"), true, out);
  walk(path.join(ROOT, "public"), true, out);
  walk(path.join(ROOT, "tests"), true, out);
  walk(path.join(ROOT, "scripts"), true, out);
  for (const f of ["next.config.ts", "package.json", "README.md", "STATE.md", "playwright.config.ts", "vitest.config.mts", ".env.example"]) {
    const full = path.join(ROOT, f);
    if (fs.existsSync(full)) out.push({ file: f, content: fs.readFileSync(full, "utf8") });
  }
  return out;
}

describe("banned word", () => {
  it("the scanner catches the word in a name and in content (fixture)", () => {
    const word = ["Kr", "ak", "en"].join("");
    const hits = scan([
      { file: `public/${word.toLowerCase()}-logo.png` },
      { file: "src/a.ts", content: `// joining ${word} soon` },
      { file: "src/clean.ts", content: "nothing here" },
    ]);
    expect(hits).toEqual([
      { file: `public/${word.toLowerCase()}-logo.png`, where: "name" },
      { file: "src/a.ts", where: "content" },
    ]);
  });

  it("does not appear anywhere in the site source, assets, tests, scripts or config", () => {
    const entries = siteEntries();
    expect(entries.length).toBeGreaterThan(50); // the walk really read the tree
    expect(scan(entries)).toEqual([]);
  });
});
