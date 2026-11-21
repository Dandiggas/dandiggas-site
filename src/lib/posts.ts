import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export type PostNumber = { value: string; label: string };

export interface Post {
  slug: string;
  title: string;
  date: string;
  preview: string;
  readTime: string;
  /** Theme key from src/content/themes.ts. Groups the post on the ledger. */
  theme: string;
  /** The number column on the ledger. */
  stat: string;
  /** The one-liner under the title on the ledger. */
  line: string;
  /** Optional: the "numbers in this post" rail. Each value must appear in the body. */
  numbers: PostNumber[];
  video?: string;
  videoPoster?: string;
  videoCaption?: string;
  content: string;
}

function parse(slug: string, fileContents: string): Post {
  const { data, content } = matter(fileContents);
  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    preview: data.preview || "",
    readTime: data.readTime || "",
    theme: data.theme || "",
    stat: data.stat || "",
    line: data.line || "",
    numbers: Array.isArray(data.numbers)
      ? data.numbers.map((n: { value: unknown; label: unknown }) => ({ value: String(n.value), label: String(n.label) }))
      : [],
    video: data.video || undefined,
    videoPoster: data.videoPoster || undefined,
    videoCaption: data.videoCaption || undefined,
    content,
  };
}

/** Newest first. Same-day posts fall back to slug order so the list is stable. */
export function byNewest(a: { date: string; slug: string }, b: { date: string; slug: string }) {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  return a.slug < b.slug ? -1 : 1;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => parse(fileName.replace(/\.md$/, ""), fs.readFileSync(path.join(postsDirectory, fileName), "utf8")))
    .sort(byNewest);
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  return parse(slug, fs.readFileSync(fullPath, "utf8"));
}
