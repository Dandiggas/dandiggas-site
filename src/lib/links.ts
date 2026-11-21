// Every outside link and every follow path, in one place. The header, footer,
// follow rows and SocialLinks all read from here.
export const LINKS = {
  github: "https://github.com/Dandiggas",
  linkedin: "https://www.linkedin.com/in/daniel-adekugbe-11a71859/",
  x: "https://x.com/Dandiggastech",
  xHandle: "@Dandiggastech",
  tiktok: "https://tiktok.com/@dandiggas",
  instagram: "https://instagram.com/dandiggas",
  rss: "/feed.xml",
  now: "/now",
  subscribe: "/tech#subscribe",
} as const;

export const SITE_URL = "https://tech.dandiggas.com";

// The RSS discovery link. Next.js replaces `alternates` as a whole when a page
// sets its own, so every page that sets a canonical URL must spread this back in.
export const FEED_ALTERNATES = {
  "application/rss+xml": [{ url: LINKS.rss, title: "Dan Diggas: writing" }],
};
