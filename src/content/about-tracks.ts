// The two tracks on /about, copied from the about mockup (idea-4-about).
// Covers are files under public/music/credits (a unit test checks they exist).
export type TrackEntry = { when: string; title: string; line: string; covers?: string[] };

const c = (name: string) => `/music/credits/${name}.jpg`;

export const STAGE_TRACK: TrackEntry[] = [
  { when: "2025", title: "Afraid, Pt. 2 · Xavier Omär & Xenia Manasseh", line: "Producer. Also Pomiędzy with Vito Bambino, Def Jam World Tour: London.", covers: [c("afraid-pt-2")] },
  { when: "2024", title: "Nothing On You · Marie Dahlstrøm feat. Odeal", line: "Producer. Plus Chase The Sunrise (Goya Gumbani) and Take Me In (M24).", covers: [c("nothing-on-you"), c("chase-the-sunrise"), c("take-me-in")] },
  { when: "2023", title: "Kamal., Seoul Jazz Festival", line: 'Keys. "little pieces" and "homebody", live in Korea.' },
  { when: "2022", title: "Lil Bro · Central Cee", line: "Producer. Same year: keys for Mahalia at Lowlands and Wireless, and Letter To Ur N(ex)t.", covers: [c("lil-bro"), c("letter-to-ur-next")] },
  { when: "2021", title: "Hold Me Back · Shakka, VIBE (Interlude) · M Huncho", line: "Producer. Mahalia at YouTube Space and 1Xtra Live Lounge. Own releases Grow, 4inARow, Need You Pt. 2.", covers: [c("hold-me-back"), c("vibe-interlude")] },
  { when: "2019", title: "Square 1 and Karma · Mahalia", line: "Producer and co-writer across Love and Compromise.", covers: [c("square-1")] },
  { when: "2018", title: "Aura · SG Lewis feat. J Warner", line: "Keys.", covers: [c("aura")] },
  { when: "2017", title: "Ella Eyre, The One Show, BBC", line: "Keys on national TV. Will Heard at Boardmasters." },
  { when: "2014", title: "Little Simz, Roundhouse Rising", line: "Keys, full headline set." },
  { when: "2011", title: "Cleo Sol, HMV Forum", line: "Keys. The first set on film." },
];

export const SYSTEMS_TRACK: TrackEntry[] = [
  { when: "Nov 26", title: "Changes HQ", line: "Every change my agents make leaves a record with five kinds of proof and a second model's review. Week one: 10 changes, 62 proofs, 67 findings." },
  { when: "Oct 26", title: "Brim 0.1 shipped", line: "Signed, notarised Mac app. Stems in, session out, for five DAWs. Free download." },
  { when: "Oct 26", title: "Code guards instead of text rules", line: '1,754 sessions and 4,701 prompts audited. 117 "I told you"s. Rules moved out of markdown into hooks and mods.' },
  { when: "Jul 26", title: "Agent Estate", line: "An observatory over the harness: memory graph, skills, hooks, evals, and the map of what the agents can reach." },
  { when: "Jun 26", title: "ShadowScout and Recruiter Risk Triage", line: "Two security agents: one approves shadow AI tools against policy, one checks recruiter outreach before you reply." },
  { when: "May 26", title: "A memory layer for my agent", line: "Sessions load relevant history and persist decisions. Then the cost: 30–40K tokens before a word, and four fixes." },
  { when: "Apr 26", title: "Keyboard Manual Assistant", line: "Grounded RAG for a 15-year-old problem: the keyboard on the rider is never the one at the gig." },
  { when: "Day job", title: "Backend and AI infrastructure", line: "The systems that quietly move and make sense of data at scale, behind threat intelligence." },
];

export const BRIDGE = {
  label: "Where they meet",
  title: "Brim · The Shed · Keyboard Manual Assistant · AI Studio Agent",
  line: "Every one of these started as something I did by hand before a show. The engineer fixed what the keys player kept running into.",
};
