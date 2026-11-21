// The six themes on the ledger, in display order. Every post's `theme` front
// matter must be one of these keys (a unit test checks it).
export type Theme = { key: string; label: string; chip: string; description: string };

export const THEMES: Theme[] = [
  { key: "proof", label: "Proof and verification", chip: "Proof", description: "Making agents show their work instead of describing it." },
  { key: "guardrails", label: "Guardrails and limits", chip: "Guardrails", description: "What actually stops an agent: code, not text." },
  { key: "memory", label: "Memory and context", chip: "Memory", description: "Giving agents a memory, then finding out what it cost." },
  { key: "security", label: "Security", chip: "Security", description: "Agents, recruiters and the keys they hold." },
  { key: "music", label: "Music tools", chip: "Music tools", description: "Where the keys player and the engineer are the same person." },
  { key: "platforms", label: "Platforms and career", chip: "Platforms", description: "Infrastructure nobody sees, and the logs a career should keep." },
];

export function themeByKey(key: string): Theme | undefined {
  return THEMES.find((t) => t.key === key);
}
