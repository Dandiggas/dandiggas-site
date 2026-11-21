import Link from "next/link";
import type { NowItem } from "@/content/now";
import { formatDate } from "@/lib/format";

/** Dated rows of what has been happening. The top row carries the live dot. */
export function NowFeed({ items, limit }: { items: NowItem[]; limit?: number }) {
  const rows = limit ? items.slice(0, limit) : items;
  return (
    <ul className="now-feed">
      {rows.map((it, n) => {
        const external = it.href.startsWith("http");
        const body = (
          <>
            <span className="k">{it.kind}</span>
            <b>{it.title}</b>
            {it.note}
          </>
        );
        return (
          <li key={it.key}>
            <span className="d">
              {n === 0 && <span className="live" aria-hidden="true" />}
              {formatDate(it.date, it.precision === "month" ? "month" : "short")}
            </span>
            {external ? (
              <a className="w" href={it.href} target="_blank" rel="noopener noreferrer">{body}</a>
            ) : (
              <Link className="w" href={it.href}>{body}</Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
