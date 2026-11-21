// Markdown to HTML, one pipeline for the post page and the RSS feed:
// remark (markdown tree) -> remark-rehype (HTML tree) -> rehype-slug (ids on
// headings) -> proofFigures (post page only) -> rehype-stringify (HTML text).
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Element, ElementContent, Root } from "hast";

export type OutlineItem = { id: string; text: string };

function isBlank(node: ElementContent) {
  return node.type === "text" && node.value.trim() === "";
}

export function proofKind(src: string): "drawing" | "screenshot" {
  const file = (src.split("?")[0].split("/").pop() || "").toLowerCase();
  if (file.endsWith(".excalidraw.png") || file.includes("drawing") || file.includes("diagram")) return "drawing";
  return "screenshot";
}

/**
 * A paragraph that holds one image and nothing else becomes a proof figure:
 * a framed image with a mono "Proof · drawing/screenshot" label and the alt
 * text as the caption. The alt moves to the caption (and data-caption, for the
 * lightbox) so a screen reader hears it once.
 */
export function proofFigures() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "p" || !parent || index === undefined) return;
      const kids = node.children.filter((c) => !isBlank(c));
      if (kids.length !== 1) return;
      const img = kids[0];
      if (img.type !== "element" || img.tagName !== "img") return;
      const src = String(img.properties?.src ?? "");
      const alt = String(img.properties?.alt ?? "");
      const figure: Element = {
        type: "element",
        tagName: "figure",
        properties: { className: ["proof"] },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["frame"] },
            children: [
              {
                type: "element",
                tagName: "img",
                properties: { src, alt: "", dataCaption: alt, loading: "lazy" },
                children: [],
              },
            ],
          },
          {
            type: "element",
            tagName: "figcaption",
            properties: {},
            children: [
              {
                type: "element",
                tagName: "span",
                properties: { className: ["k"] },
                children: [{ type: "text", value: `Proof · ${proofKind(src)}` }],
              },
              { type: "element", tagName: "span", properties: {}, children: [{ type: "text", value: alt }] },
            ],
          },
        ],
      };
      parent.children[index] = figure;
    });
  };
}

function collectOutline(into: OutlineItem[]) {
  return () => (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "h2" && node.properties?.id) {
        into.push({ id: String(node.properties.id), text: toString(node).trim() });
      }
    });
  };
}

function absoluteUrls(baseUrl: string) {
  const base = baseUrl.replace(/\/$/, "");
  return () => (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      for (const key of ["src", "href", "poster"] as const) {
        const v = node.properties?.[key];
        if (typeof v === "string" && v.startsWith("/") && !v.startsWith("//")) {
          node.properties[key] = base + v;
        }
      }
    });
  };
}

export async function renderPost(content: string): Promise<{ html: string; outline: OutlineItem[] }> {
  const outline: OutlineItem[] = [];
  const file = await remark()
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(proofFigures)
    .use(collectOutline(outline))
    .use(rehypeStringify)
    .process(content);
  return { html: String(file), outline };
}

export async function renderForFeed(content: string, baseUrl: string): Promise<string> {
  const file = await remark()
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(absoluteUrls(baseUrl))
    .use(rehypeStringify)
    .process(content);
  return String(file);
}
