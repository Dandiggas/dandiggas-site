import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate, readMinutes } from "@/lib/format";
import { Reveal } from "@/components/motion/Reveal";

/** One post as one hairline row: date, title and line, the number, read time. */
export function LedgerRow({ post, i }: { post: Post; i: number }) {
  return (
    <Reveal i={i} className="ledger-item">
      <Link className="ledger-row" href={`/posts/${post.slug}`}>
        <span className="date">{formatDate(post.date, "long")}</span>
        <span>
          <span className="title">{post.title}</span>
          <span className="sub">{post.line}</span>
        </span>
        <span className="num">{post.stat}</span>
        <span className="rt">
          {readMinutes(post.readTime)}
          <span className="arr" aria-hidden="true">→</span>
        </span>
      </Link>
    </Reveal>
  );
}
