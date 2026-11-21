import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/posts";
import { themeByKey } from "@/content/themes";
import { formatDate } from "@/lib/format";

export function PostHead({ post, position }: { post: Post; position: { index: number; total: number } }) {
  const theme = themeByKey(post.theme);
  return (
    <header className="post-head">
      <div className="crumbs">
        <Link href="/tech">← Writing</Link>
        {theme && (
          <>
            <span aria-hidden="true">·</span>
            <span>{theme.label}</span>
            <span className="pill">
              {position.index} of {position.total} in this thread
            </span>
          </>
        )}
      </div>
      <h1 className="rise">{post.title}</h1>
      <p className="standfirst rise" style={{ ["--i" as string]: 1 }}>{post.preview}</p>
      <div className="byline rise" style={{ ["--i" as string]: 2 }}>
        <Image src="/about-me.jpg" alt="Daniel Adekugbe (Dan Diggas)" width={40} height={40} />
        <div className="who">
          <b>Daniel Adekugbe</b> <span>· engineer, and keys player for Mahalia and Little Simz. London.</span>
        </div>
        <div className="meta">
          <time dateTime={post.date}>{formatDate(post.date, "long")}</time> · {post.readTime}
        </div>
      </div>
    </header>
  );
}
