import type { CSSProperties } from "react";

// Fixed month names: ICU's en-GB short month for September is "Sept" on some
// runtimes and "Sep" on others. One table keeps server and client identical.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-12" -> "12 Nov" (short) or "12 Nov 2026" (long). Read as UTC. */
export function formatDate(iso: string, style: "short" | "long" | "month" = "long"): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = d.getUTCDate();
  const mon = MONTHS[d.getUTCMonth()];
  if (style === "month") return mon;
  return style === "short" ? `${day} ${mon}` : `${day} ${mon} ${d.getUTCFullYear()}`;
}

/** "6 min read" -> "6 min". */
export function readMinutes(readTime: string): string {
  return readTime.replace(/\s*read\s*$/i, "").trim();
}

/** "1" -> "1st", "28" -> "28th". */
export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Inline style for the CSS stagger index (`--i`). */
export function stagger(i: number): CSSProperties {
  return { ["--i" as string]: i } as CSSProperties;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-GB");
}
