// The "Now" feed: what I have been up to, newest first. Posts add themselves
// ("Wrote"); the rest is this hand-kept list. The /tech card, the /now page
// and the home strip all read getNowFeed().
import { VERSION } from "@/app/brim/downloads";
import { byNewest } from "@/lib/posts";

export type NowItem = {
  /** ISO date, used for order. */
  date: string;
  /** "day" shows "4 Nov", "month" shows "Oct" (when only the month is sure). */
  precision: "day" | "month";
  kind: "Wrote" | "Open-sourced" | "Shipped";
  title: string;
  note?: string;
  href: string;
  key: string;
};

export const NOW_EVENTS: NowItem[] = [
  {
    key: "event:recruiter-due-diligence",
    date: "2026-11-04",
    precision: "day",
    kind: "Open-sourced",
    title: "Recruiter due diligence",
    note: ", with the part that reads a take-home without running it.",
    href: "https://github.com/Dandiggas/recruiter-due-diligence",
  },
  {
    key: "event:brim-release",
    date: "2026-10-26",
    precision: "month",
    kind: "Shipped",
    title: `Brim ${VERSION}`,
    note: ", signed and notarised, for five DAWs.",
    href: "/brim",
  },
];

export function getNowFeed(posts: { slug: string; title: string; date: string }[]): NowItem[] {
  const seen = new Set<string>();
  const wrote: NowItem[] = [];
  for (const p of [...posts].sort(byNewest)) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    wrote.push({ key: `post:${p.slug}`, date: p.date, precision: "day", kind: "Wrote", title: p.title, href: `/posts/${p.slug}` });
  }
  return [...wrote, ...NOW_EVENTS].sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));
}
