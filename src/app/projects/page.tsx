import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Dan Diggas",
  description: "Things I've built for musicians and engineers.",
};

const projects = [
  {
    title: "Keyboard Manual Assistant",
    description:
      "RAG-powered chatbot that answers questions about your keyboard using the official manual. Grounded answers with citations.",
    tech: ["Python", "Docker", "Qdrant", "LocalAI"],
    link: "#",
  },
  {
    title: "The Shed",
    description:
      "Practice app for musicians who can already play. Timer, YouTube player, metronome, tuner, sheet music, AI recommendations.",
    tech: ["Django", "Next.js", "PostgreSQL", "Railway"],
    link: "https://github.com/Dandiggas/MusiciansPracticeApp",
  },
  {
    title: "AI Studio Agent",
    description:
      "Automated stem loading for Ableton Live. Send a message from your phone. By the time you open Ableton, everything is loaded and named.",
    tech: ["Python", "MCP", "OSC", "Gmail API"],
    link: "#",
  },
  {
    title: "Threat Intel Daily Brief",
    description:
      "Automated morning email with high-signal cybersecurity threat items from trusted sources. Built for engineers and analysts.",
    tech: ["Python", "LLM", "RSS", "SMTP"],
    link: "#",
  },
];

export default function ProjectsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Projects</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-10">
        Things I&apos;ve built for musicians and engineers.
      </p>
      <div className="grid gap-6">
        {projects.map((project) => (
          <a
            key={project.title}
            href={project.link}
            target={project.link !== "#" ? "_blank" : undefined}
            rel={project.link !== "#" ? "noopener noreferrer" : undefined}
            className="group block p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-amber-400 dark:hover:border-amber-500 transition-colors"
          >
            <h2 className="text-lg font-semibold group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {project.title}
              {project.link !== "#" && (
                <span className="ml-1.5 text-neutral-400 text-sm">↗</span>
              )}
            </h2>
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
          </a>
        ))}
      </div>
    </div>
  );
}
