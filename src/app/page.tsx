import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { SocialLinks } from "@/components/SocialLinks";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-16 pb-12 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-start gap-5">
          <Image
            src="/profile.jpeg"
            alt="Dan Diggas"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover shrink-0"
            priority
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dan Diggas</h1>
            <p className="mt-1 text-neutral-900 dark:text-neutral-100 text-lg font-medium leading-snug">
              Backend/infra engineer at Sophos Labs building practical AI workflow
              tools for music, security, and operations.
            </p>
            <p className="mt-3 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              I work on threat-intelligence infrastructure by day. Outside work,
              I build local-first AI systems that turn messy real-world workflows
              into reliable software.
            </p>
            <div className="mt-4">
              <SocialLinks />
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-6">
          Recent Posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group block"
                >
                  <h3 className="text-lg font-semibold group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500 dark:text-neutral-400">
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
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400 leading-relaxed">
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
