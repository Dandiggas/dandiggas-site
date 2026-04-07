import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/content/posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  preview: string;
  readTime: string;
  content: string;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        preview: data.preview || "",
        readTime: data.readTime || "",
        content,
      };
    });
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    preview: data.preview || "",
    readTime: data.readTime || "",
    content,
  };
}
