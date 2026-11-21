// The counts on the tech hero. Every number either is computed, or names the
// post it comes from (a unit test checks the number appears in that post).
import { getAllPosts } from "./posts";
import { gigs } from "./music";

export type SiteStat = { key: string; value: number; label: string; sourceSlug?: string };

export function getSiteStats(): SiteStat[] {
  return [
    { key: "posts", value: getAllPosts().length, label: "posts since April" },
    { key: "prompts", value: 7785, label: "prompts measured", sourceSlug: "the-drawing-is-the-spec" },
    { key: "sessions", value: 1754, label: "sessions audited", sourceSlug: "i-stopped-writing-rules-for-my-ai-agents" },
    { key: "proofs", value: 62, label: "proofs, week one", sourceSlug: "my-agents-say-done" },
    // Constant: Brim is the one Mac app shipped (see /brim).
    { key: "apps", value: 1, label: "Mac app shipped" },
    { key: "sets", value: gigs.length, label: "live sets on film" },
  ];
}
