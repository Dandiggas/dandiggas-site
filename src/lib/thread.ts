// Thread = the posts that share a theme. Pure functions so they can be tested
// on a small fixture.
import { byNewest } from "./posts";

type P = { slug: string; date: string; theme: string };

/** 1-based position of the post in its theme, oldest first, over the theme size. */
export function threadPosition<T extends P>(post: T, posts: T[]): { index: number; total: number } {
  const group = posts.filter((p) => p.theme === post.theme).sort((a, b) => byNewest(b, a));
  return { index: group.findIndex((p) => p.slug === post.slug) + 1, total: group.length };
}

/**
 * Two cards after a post:
 * 1. the next newer post in the same theme; if none, the newest other post in the theme;
 * 2. the newest post on the site not already shown (and not this post).
 */
export function nextInThread<T extends P>(post: T, posts: T[]): T[] {
  const newestFirst = [...posts].sort(byNewest);
  const sameTheme = newestFirst.filter((p) => p.theme === post.theme && p.slug !== post.slug);
  const newer = sameTheme.filter((p) => byNewest(p, post) < 0); // p is newer than post
  const first = newer.length ? newer[newer.length - 1] : sameTheme[0];
  const shown = new Set([post.slug, first?.slug]);
  const second = newestFirst.find((p) => !shown.has(p.slug));
  return [first, second].filter((p): p is T => Boolean(p));
}
