// "Where the two halves meet" cards on the home page.
export type MeetCard = { title: string; href: string; shot: string; pill: string; line: string };

export const MEET_CARDS: MeetCard[] = [
  {
    title: "Brim",
    href: "/brim",
    shot: "/brim/app.png",
    pill: "Shipped",
    line: "A stems delivery becomes a ready DAW session. Built because I kept doing it by hand before shows.",
  },
  {
    title: "Keyboard Manual Assistant",
    href: "/tech/keyboard-manual-assistant",
    shot: "/music/bbc-jupiter.jpg",
    pill: "RAG",
    line: "You put a keyboard on the rider and get a different one at the gig. Grounded answers from the manual, with refusals and traces.",
  },
  {
    title: "Changes HQ",
    href: "/posts/my-agents-say-done",
    shot: "/blog/agents-show-me/changes-hq.jpg",
    pill: "Proof",
    line: "Every change my agents make leaves a record with its proof. Week one: 10 changes, 62 proofs.",
  },
];
