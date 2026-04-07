import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { remark } from "remark";
import html from "remark-html";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Dan Diggas`,
    description: post.preview,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
      >
        ← Back to posts
      </Link>
      <article className="mt-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex items-center gap-2 mt-3 text-sm text-neutral-500 dark:text-neutral-400">
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
        </header>
        <div
          className="prose text-neutral-800 dark:text-neutral-200"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
    </div>
  );
}
