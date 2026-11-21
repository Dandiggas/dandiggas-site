import { describe, expect, it } from "vitest";
import { renderForFeed, renderPost, proofKind } from "@/lib/markdown";

describe("markdown pipeline", () => {
  const md = [
    "Intro paragraph.",
    "",
    "## What counts as proof",
    "",
    "![The attachment fix, before and after](/blog/agents-show-me/attachment-fix-drawing.png)",
    "",
    "## Where it lands",
    "",
    "![Changes HQ board](/blog/agents-show-me/changes-hq.jpg)",
    "",
    "Text with an inline ![icon](/x.png) image and a [link](/posts/a).",
  ].join("\n");

  it("wraps a lone image in a proof figure, moves alt to the caption, labels the kind", async () => {
    const { html } = await renderPost(md);
    expect(html).toContain('<figure class="proof"><div class="frame"><img src="/blog/agents-show-me/attachment-fix-drawing.png" alt="" data-caption="The attachment fix, before and after"');
    expect(html).toContain('<span class="k">Proof · drawing</span><span>The attachment fix, before and after</span>');
    expect(html).toContain('<span class="k">Proof · screenshot</span><span>Changes HQ board</span>');
    // An image inside a sentence is left alone.
    expect(html).toContain('<img src="/x.png" alt="icon">');
    expect((html.match(/<figure/g) || []).length).toBe(2);
  });

  it("gives H2s ids and returns the outline", async () => {
    const { html, outline } = await renderPost(md);
    expect(html).toContain('<h2 id="what-counts-as-proof">');
    expect(outline).toEqual([
      { id: "what-counts-as-proof", text: "What counts as proof" },
      { id: "where-it-lands", text: "Where it lands" },
    ]);
  });

  it("kind rule: drawing, diagram, .excalidraw.png are drawings", () => {
    expect(proofKind("/a/attachment-fix-drawing.png")).toBe("drawing");
    expect(proofKind("/a/flow-diagram.jpg")).toBe("drawing");
    expect(proofKind("/a/change.excalidraw.png")).toBe("drawing");
    expect(proofKind("/a/changes-hq.jpg")).toBe("screenshot");
  });

  it("feed: absolute URLs, alt kept, no figure wrapper", async () => {
    const html = await renderForFeed(md, "https://tech.dandiggas.com");
    expect(html).toContain('src="https://tech.dandiggas.com/blog/agents-show-me/changes-hq.jpg" alt="Changes HQ board"');
    expect(html).toContain('href="https://tech.dandiggas.com/posts/a"');
    expect(html).not.toContain("<figure");
  });
});
