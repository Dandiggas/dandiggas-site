// "Start here" on /tech: three posts, each led by the number that made me
// write it. The big number must appear in the post body (unit test).
export type Featured = { slug: string; big: number; label: string; shot?: string; shotAlt?: string };

export const FEATURED: Featured[] = [
  {
    slug: "my-agents-say-done",
    big: 62,
    label: "pieces of proof · 10 changes · 67 review findings",
    shot: "/blog/agents-show-me/changes-hq.jpg",
    shotAlt: "Changes HQ",
  },
  { slug: "i-stopped-writing-rules-for-my-ai-agents", big: 117, label: 'times I typed "I told you"' },
  { slug: "the-drawing-is-the-spec", big: 11, label: "words, the median prompt of 7,785" },
];
