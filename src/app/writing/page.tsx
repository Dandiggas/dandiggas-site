import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing — Dan Diggas",
  description:
    "Notes on backend engineering, AI agents, security, and building tools for music.",
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Writing</h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        Notes on backend engineering, AI agents, security, and building tools
        for music.
      </p>

      <section className="mt-10">
        {posts.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug}>
                <Link href={`/posts/${post.slug}`} className="group block">
                  <h2 className="text-lg font-semibold transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">
                    {post.title}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <time>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    {post.readTime && (
                      <>
                        <span>·</span>
                        <span>{post.readTime}</span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {post.preview}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
