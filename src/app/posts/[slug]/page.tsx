import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { renderPost } from "@/lib/markdown";
import { nextInThread, threadPosition } from "@/lib/thread";
import { SITE_URL } from "@/lib/links";
import BlogContent from "@/components/BlogContent";
import { ProgressBar } from "@/components/motion/ProgressBar";
import { PostHead } from "@/components/post/PostHead";
import { PostRail } from "@/components/post/PostRail";
import { NextInThread } from "@/components/post/NextInThread";
import { KeepUp } from "@/components/post/KeepUp";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `${SITE_URL}/posts/${slug}`;
  return {
    title: `${post.title} — Dan Diggas`,
    description: post.preview,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.preview,
      url,
      publishedTime: post.date,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Dan Diggas, engineer and musician" }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.preview,
      images: ["/twitter-image.png"],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const { html, outline } = await renderPost(post.content);
  const url = `${SITE_URL}/posts/${slug}`;

  return (
    <>
      <ProgressBar />
      <div className="wrap post-page">
        <PostHead post={post} position={threadPosition(post, all)} />
        <div className="post-grid">
          <PostRail post={post} outline={outline} url={url} />
          <article className="post-article">
            {post.video && (
              <figure className="proof">
                <div className="frame">
                  <video controls preload="metadata" playsInline poster={post.videoPoster}>
                    <source src={post.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                {post.videoCaption && (
                  <figcaption>
                    <span className="k">Proof · clip</span>
                    <span>{post.videoCaption}</span>
                  </figcaption>
                )}
              </figure>
            )}
            <BlogContent html={html} />
            <NextInThread posts={nextInThread(post, all)} />
            <KeepUp />
          </article>
        </div>
      </div>
    </>
  );
}
