import { describe, expect, it } from "vitest";
import { GET } from "@/app/feed.xml/route";
import { getAllPosts } from "@/lib/posts";

const BANNED = new RegExp(["kr", "ak", "en"].join(""), "i");

describe("/feed.xml", () => {
  it("is valid RSS with one item per post, newest first, absolute links", async () => {
    const res = await GET();
    expect(res.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8");
    const xml = await res.text();
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    expect(doc.getElementsByTagName("parsererror")).toHaveLength(0);

    const posts = getAllPosts();
    const items = Array.from(doc.getElementsByTagName("item"));
    expect(items).toHaveLength(posts.length);
    expect(items[0].getElementsByTagName("link")[0].textContent).toBe(
      `https://tech.dandiggas.com/posts/${posts[0].slug}`,
    );
    for (const it of items) {
      const link = it.getElementsByTagName("link")[0].textContent!;
      expect(link.startsWith("https://tech.dandiggas.com/posts/")).toBe(true);
      const html = it.getElementsByTagName("content:encoded")[0]?.textContent ?? "";
      expect(html.length).toBeGreaterThan(100);
      // Every src/href inside the post body is absolute.
      expect(html).not.toMatch(/(src|href)="\/(?!\/)/);
    }
    expect(BANNED.test(xml)).toBe(false);
  });
});
