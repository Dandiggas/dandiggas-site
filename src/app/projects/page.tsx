import Link from "next/link";
import type { Metadata } from "next";

type ProjectAction = {
  label: string;
  href: string;
  external?: boolean;
};

type Project = {
  title: string;
  description: string;
  tech: string[];
  href?: string;
  actions?: ProjectAction[];
  status?: string;
};

export const metadata: Metadata = {
  title: "Projects — Dan Diggas",
  description: "Practical AI workflow tools for music, security, and operations.",
};

const projects: Project[] = [
  {
    title: "Keyboard Manual Assistant",
    description:
      "A grounded RAG system that answers questions about keyboard manuals using retrieved evidence, refusals, evals, and Langfuse tracing.",
    tech: ["FastAPI", "Qdrant", "LocalAI", "Langfuse"],
    href: "/projects/keyboard-manual-assistant",
    actions: [
      { label: "Project page", href: "/projects/keyboard-manual-assistant" },
      { label: "Read write-up", href: "/posts/building-keyboard-manual-rag" },
      {
        label: "Watch demo",
        href: "https://www.loom.com/share/d0b6df37b0514febab2706f1488a3a84",
        external: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/Dandiggas/keyboard-manual-assistant",
        external: true,
      },
    ],
  },
  {
    title: "The Shed",
    description:
      "Practice app for musicians who can already play. Timer, YouTube player, metronome, tuner, sheet music, AI recommendations.",
    tech: ["Django", "Next.js", "PostgreSQL", "Railway"],
    href: "https://github.com/Dandiggas/MusiciansPracticeApp",
    actions: [
      {
        label: "GitHub",
        href: "https://github.com/Dandiggas/MusiciansPracticeApp",
        external: true,
      },
    ],
  },
  {
    title: "AI Studio Agent",
    description:
      "Automated stem loading for Ableton Live. The goal: send a message from your phone and open a prepared Ableton project later.",
    tech: ["Python", "MCP", "Gmail API", "Ableton"],
    status: "In progress",
    actions: [
      {
        label: "Ableton MCP repo",
        href: "https://github.com/Dandiggas/ableton-mcp",
        external: true,
      },
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

export default function ProjectsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Projects</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-10">
        Practical AI workflow tools for music, security, and operations.
      </p>
      <div className="grid gap-6">
        {projects.map((project) => (
          <article
            key={project.title}
            className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                {project.href ? (
                  <Link
                    href={project.href}
                    target={project.href.startsWith("http") ? "_blank" : undefined}
                    rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group"
                  >
                    <h2 className="text-lg font-semibold group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {project.title}
                      {project.href.startsWith("http") && (
                        <span className="ml-1.5 text-neutral-400 text-sm">↗</span>
                      )}
                    </h2>
                  </Link>
                ) : (
                  <h2 className="text-lg font-semibold">{project.title}</h2>
                )}
                {project.status && (
                  <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {project.status}
                  </p>
                )}
              </div>
            </div>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              {project.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
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
                    className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline"
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
    </div>
  );
}
