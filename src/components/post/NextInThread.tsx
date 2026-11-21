import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate, readMinutes } from "@/lib/format";
import { Reveal } from "@/components/motion/Reveal";

export function NextInThread({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section className="next-thread" aria-label="Next in this thread">
      <p className="eyebrow">Next in this thread</p>
      <div className="next">
        {posts.map((p, i) => (
          <Reveal key={p.slug} i={i} className="next-item">
            <Link className="card" href={`/posts/${p.slug}`}>
              <div className="card-body">
                <span className="tiny mono">
                  {formatDate(p.date, "long")} · {readMinutes(p.readTime)}
                </span>
                <p className="card-title">{p.title}</p>
                <p className="small">{p.line}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
