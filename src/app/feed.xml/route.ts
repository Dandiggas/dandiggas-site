// RSS 2.0 feed of every post, newest first, with the full post in
// content:encoded. Buttondown will read this later to send each new post.
import { getAllPosts } from "@/lib/posts";
import { renderForFeed } from "@/lib/markdown";
import { SITE_URL } from "@/lib/links";
import { escapeXml, rfc822 } from "@/lib/feed";

export const dynamic = "force-static";

// "]]>" cannot appear inside CDATA; split it across two sections.
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

export async function GET() {
  const posts = getAllPosts();
  const items = await Promise.all(
    posts.map(async (p) => {
      const link = `${SITE_URL}/posts/${p.slug}`;
      const html = await renderForFeed(p.content, SITE_URL);
      return [
        "    <item>",
        `      <title>${escapeXml(p.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink="true">${link}</guid>`,
        `      <pubDate>${rfc822(p.date)}</pubDate>`,
        `      <description>${escapeXml(p.preview)}</description>`,
        `      <content:encoded>${cdata(html)}</content:encoded>`,
        "    </item>",
      ].join("\n");
    }),
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>Dan Diggas: writing</title>",
    `    <link>${SITE_URL}/tech</link>`,
    "    <description>Posts measured on my own AI agents, plus tools for musicians.</description>",
    "    <language>en-GB</language>",
    `    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>`,
    posts[0] ? `    <lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>` : "",
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
