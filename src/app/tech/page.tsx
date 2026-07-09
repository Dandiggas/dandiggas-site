import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { SocialLinks } from "@/components/SocialLinks";
import { Reveal } from "@/components/music/Reveal";

export const metadata: Metadata = {
  title: "Tech — Dan Diggas",
  description:
    "Daniel Adekugbe — backend and AI engineer at Sophos. Writing and projects on AI agents, security, and local-first tools.",
};

const stagger = (i: number) =>
  ({ ["--stagger" as string]: i } as React.CSSProperties);

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
    <div className="bg-music-bg text-music-fg">
      {/* Hero */}
      <section className="relative flex min-h-[62vh] items-center overflow-hidden">
        <div className="tech-grid-hero pointer-events-none absolute inset-0" />
        <div className="glow-pulse pointer-events-none absolute left-1/2 top-[-6rem] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-amber-500/15 blur-[130px]" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 md:py-28">
          <p
            className="rise-in font-mono text-xs uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400"
            style={stagger(0)}
          >
            Engineer
          </p>
          <h1
            className="rise-in mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl"
            style={stagger(1)}
          >
            AI tools, and the infrastructure under them.
          </h1>
          <p
            className="rise-in mt-5 max-w-xl text-lg leading-relaxed text-music-muted"
            style={stagger(2)}
          >
            Backend and AI infrastructure at Sophos by day. Local-first tools
            for security, ops, and music the rest of the time.
          </p>
          <div className="rise-in mt-7 text-music-fg" style={stagger(3)}>
            <SocialLinks />
          </div>
        </div>
      </section>

      {/* Writing */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Writing
          </h2>
          <p className="mt-2 text-music-muted">
            Notes on AI agents, security, and building tools that last.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group flex flex-col rounded-xl border border-music-hairline bg-music-surface/40 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-amber-500/40 hover:bg-music-surface"
            >
              <div className="flex items-center gap-2 font-mono text-xs text-music-muted">
                <time>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
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
              <h3 className="mt-2 text-lg font-semibold leading-snug transition-colors group-hover:text-amber-700 dark:group-hover:text-amber-400">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-music-muted">
                {post.preview}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Projects
          </h2>
          <p className="mt-2 text-music-muted">
            Practical AI workflow tools for music, security, and operations.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              className="flex flex-col rounded-xl border border-music-hairline bg-music-surface/40 p-5 transition duration-300 hover:border-amber-500/40 hover:bg-music-surface"
            >
              <div className="flex items-start justify-between gap-3">
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
                        <span className="ml-1.5 text-sm text-music-muted">↗</span>
                      )}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                )}
                {project.status && (
                  <span className="shrink-0 rounded-full border border-music-hairline px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-music-muted">
                    {project.status}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-music-muted">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-music-bg px-2 py-0.5 font-mono text-[11px] text-music-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {project.actions && project.actions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3 border-t border-music-hairline pt-4">
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
