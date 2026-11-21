import type { Post } from "@/lib/posts";
import type { OutlineItem } from "@/lib/markdown";
import { Outline } from "./Outline";
import { ShareLinks } from "./ShareLinks";

export function PostRail({ post, outline, url }: { post: Post; outline: OutlineItem[]; url: string }) {
  return (
    <aside className="rail">
      {post.numbers.length > 0 && (
        <div>
          <h4>The numbers in this post</h4>
          <div className="nums">
            {post.numbers.map((n) => (
              <div key={n.value + n.label} className="stat">
                <b>{n.value}</b>
                <span>{n.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <Outline items={outline} />
      <ShareLinks url={url} title={post.title} />
    </aside>
  );
}
