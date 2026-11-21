import { VERSION } from "@/app/brim/downloads";

export type ProjectAction = { label: string; href: string; external?: boolean };
export type Project = {
  title: string;
  description: string;
  tech: string[];
  pill?: string;
  /** Screenshot for the card. Only the four featured projects have one. */
  shot?: string;
  featured?: boolean;
  actions: ProjectAction[];
};

export const PROJECTS: Project[] = [
  {
    title: "Brim",
    featured: true,
    pill: `Shipped · ${VERSION}`,
    shot: "/brim/app.png",
    description:
      "Mac app that turns a stems delivery into a ready DAW session: every stem named, placed and playable, with a receipt showing what was imported and what was skipped. Signed and notarised.",
    tech: ["SwiftUI", "Python", "Ableton", "Logic Pro", "FL Studio", "Pro Tools"],
    actions: [
      { label: "Open Brim", href: "/brim" },
      { label: "Download ↓", href: "/brim#download" },
    ],
  },
  {
    title: "Changes HQ",
    featured: true,
    pill: "In daily use",
    shot: "/blog/agents-show-me/changes-hq.jpg",
    description:
      "One page that reads every change record my agents write, and shows the drawing, screenshots, clips, tests and the second model's review per card.",
    tech: ["Local-first", "JSON schema", "Excalidraw"],
    actions: [{ label: "Read write-up", href: "/posts/my-agents-say-done" }],
  },
  {
    title: "Agent Estate",
    featured: true,
    pill: "In daily use",
    shot: "/blog/harness-overview-light.png",
    description:
      "The observatory over my agent harness: memory graph, skills, hooks, evals and the map of what agents can reach.",
    tech: ["Memory graph", "Evals", "Hooks"],
    actions: [
      { label: "Read write-up", href: "/posts/harness-observatory" },
      { label: "The reach map", href: "/posts/what-my-ai-agents-could-reach" },
    ],
  },
  {
    title: "Usage tracker",
    featured: true,
    pill: "In daily use",
    shot: "/blog/allowance-hud.png",
    description:
      "Three AI coding tools, each with its own five-hour and weekly limits, in one panel that I checked tells the truth.",
    tech: ["Python", "Desktop HUD"],
    actions: [{ label: "Read write-up", href: "/posts/tracking-my-agents-usage-limits" }],
  },
  {
    title: "ShadowScout",
    description:
      "Autonomous compliance approval agent for shadow AI tools. Searches vendor evidence, maps it to company policy, produces scoped decisions, and monitors approved tools for drift.",
    tech: ["Python", "Streamlit", "Tavily", "Gemini", "ClickHouse"],
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
    actions: [{ label: "GitHub", href: "https://github.com/Dandiggas/MusiciansPracticeApp", external: true }],
  },
  {
    title: "AI Studio Agent",
    pill: "In progress",
    description:
      "Automated stem loading for Ableton Live. The goal: send a message from your phone and open a prepared Ableton project later.",
    tech: ["Python", "MCP", "Gmail API", "Ableton"],
    actions: [{ label: "Ableton MCP repo", href: "https://github.com/Dandiggas/ableton-mcp", external: true }],
  },
  {
    title: "Threat Intel Daily Brief",
    pill: "In progress",
    description:
      "Automated morning email with high-signal cybersecurity threat items from trusted sources. Built for engineers and analysts.",
    tech: ["Python", "LLM", "RSS", "SMTP"],
    actions: [],
  },
];
