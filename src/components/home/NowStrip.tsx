import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { artists, gigs } from "@/lib/music";
import { VERSION } from "@/app/brim/downloads";
import { formatDate, ordinal } from "@/lib/format";
import { Reveal } from "@/components/motion/Reveal";

/** One row under the split: newest post, Brim, and who I have played for. */
export function NowStrip() {
  const posts = getAllPosts();
  const latest = posts[0];
  return (
    <Reveal as="section" className="now-strip" aria-label="What is new">
      <div className="wrap">
        <Link className="cell" href={`/posts/${latest.slug}`}>
          <span className="k">Latest writing · {formatDate(latest.date, "short")}</span>
          <span className="v">{latest.title}</span>
          <span className="s">
            {latest.readTime} · the {ordinal(posts.length)} post since April
          </span>
        </Link>
        <Link className="cell" href="/brim">
          <span className="k">Brim · {VERSION}</span>
          <span className="v">Stems in. Session out. Free Mac app.</span>
          <span className="s">Ableton, Logic, FL Studio, Pro Tools, Studio One</span>
        </Link>
        <Link className="cell" href="/music">
          <span className="k">Played for</span>
          <span className="v">{artists.slice(0, 5).join(" · ")}</span>
          <span className="s">{gigs.length} live sets on film, from Lowlands to the One Show</span>
        </Link>
      </div>
    </Reveal>
  );
}
