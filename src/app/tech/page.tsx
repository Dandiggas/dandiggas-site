import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { SocialLinks } from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "Tech — Dan Diggas",
  description:
    "Daniel Adekugbe — backend and AI engineer at Sophos. Writing and projects on AI agents, security, and local-first tools.",
};

type ProjectAction = { label: string; href: string; external?: boolean };
type Project = {
  title: string;
  description: string;
  tech: string[];
  href?: string;
  actions?: ProjectAction[];
  status?: string;
};

const projects: Project[] = [
  {
    title: "ShadowScout",
    description:
      "Autonomous compliance approval agent for shadow AI tools. Searches vendor evidence, maps it to company policy, produces scoped decisions, and monitors approved tools for drift.",
    tech: ["Python", "Streamlit", "Tavily", "Gemini", "ClickHouse"],
    href: "https://github.com/Dandiggas/shadow-ai-scout",
    actions: [
      { label: "Read write-up", href: "/posts/shadowscout-compliance-approval-agent" },
      { label: "Watch demo", href: "https://www.loom.com/share/50c79eb38158418e94ad1d94564655e4", external: true },
      { label: "GitHub", href: "https://github.com/Dandiggas/shadow-ai-scout", external: true },
    ],
  },
  {
    title: "Recruiter Risk Triage",
    description:
      "Local-first dashboard for checking recruiter outreach across legitimacy, security risk, original JD clues, opportunity fit, and safe reply strategy.",
    tech: ["Python", "Agent Graph", "DNS/RDAP", "Companies House", "Local UI"],
    href: "https://github.com/Dandiggas/recruiter-risk-triage-v1",
    actions: [
      { label: "Read write-up", href: "/posts/recruiter-risk-triage" },
      { label: "GitHub", href: "https://github.com/Dandiggas/recruiter-risk-triage-v1", external: true },
    ],
  },
  {
    title: "Keyboard Manual Assistant",
    description:
      "A grounded RAG system that answers questions about keyboard manuals using retrieved evidence, refusals, evals, and Langfuse tracing.",
    tech: ["FastAPI", "Qdrant", "LocalAI", "Langfuse"],
    href: "/tech/keyboard-manual-assistant",
    actions: [
      { label: "Project page", href: "/tech/keyboard-manual-assistant" },
      { label: "Read write-up", href: "/posts/building-keyboard-manual-rag" },
      { label: "Watch demo", href: "https://www.loom.com/share/d0b6df37b0514febab2706f1488a3a84", external: true },
      { label: "GitHub", href: "https://github.com/Dandiggas/keyboard-manual-assistant", external: true },
    ],
  },
  {
    title: "The Shed",
    description:
      "Practice app for musicians who can already play. Timer, YouTube player, metronome, tuner, sheet music, AI recommendations.",
    tech: ["Django", "Next.js", "PostgreSQL", "Railway"],
    href: "https://github.com/Dandiggas/MusiciansPracticeApp",
    actions: [
      { label: "GitHub", href: "https://github.com/Dandiggas/MusiciansPracticeApp", external: true },
    ],
  },
  {
    title: "AI Studio Agent",
    description:
      "Automated stem loading for Ableton Live. The goal: send a message from your phone and open a prepared Ableton project later.",
    tech: ["Python", "MCP", "Gmail API", "Ableton"],
    status: "In progress",
    actions: [
      { label: "Ableton MCP repo", href: "https://github.com/Dandiggas/ableton-mcp", external: true },
    ],
  },
  {
    title: "Threat Intel Daily Brief",
    description:
      "Automated morning email with high-signal cybersecurity threat items from trusted sources. Built for engineers and analysts.",
    tech: ["Python", "LLM", "RSS", "SMTP"],
    status: "In progress",
  },
];

export default function TechPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Intro */}
      <section className="border-b border-neutral-200 pb-10 dark:border-neutral-800">
        <h1 className="text-2xl font-bold tracking-tight">Engineering</h1>
        <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-400">
          Backend and AI infrastructure at Sophos. Outside work I build
          local-first AI tools that turn messy real-world workflows into
          reliable software, across security, operations and music.
        </p>
        <div className="mt-4">
          <SocialLinks />
        </div>
      </section>

      {/* Writing */}
      <section className="py-12">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Writing
        </h2>
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/posts/${post.slug}`} className="group block">
                <h3 className="text-lg font-semibold transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">
                  {post.title}
                </h3>
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
      </section>

      {/* Projects */}
      <section className="border-t border-neutral-200 py-12 dark:border-neutral-800">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Projects
        </h2>
        <div className="grid gap-6">
          {projects.map((project) => (
            <article
              key={project.title}
              className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800"
            >
              <div>
                {project.href ? (
                  <Link
                    href={project.href}
                    target={project.href.startsWith("http") ? "_blank" : undefined}
                    rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group"
                  >
                    <h3 className="text-lg font-semibold transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">
                      {project.title}
                      {project.href.startsWith("http") && (
                        <span className="ml-1.5 text-sm text-neutral-400">↗</span>
                      )}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                )}
                {project.status && (
                  <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {project.status}
                  </p>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {project.actions && project.actions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {project.actions.map((action) => (
                    <Link
                      key={action.href + action.label}
                      href={action.href}
                      target={action.external ? "_blank" : undefined}
                      rel={action.external ? "noopener noreferrer" : undefined}
                      className="text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
                    >
                      {action.label}
                      {action.external && <span className="ml-1">↗</span>}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
