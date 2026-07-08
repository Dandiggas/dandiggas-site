// Live / session performance credits. Every entry is a real, public video of
// Dan playing keys for that artist, so the whole page is provable. These are
// PERFORMANCE credits, not recording/album credits. Do not add studio credits
// here without confirming them first.

export type Gig = {
  artist: string;
  title: string;
  venue: string;
  id: string; // YouTube video id
  year: number;
  featured?: boolean;
};

export const gigs: Gig[] = [
  { artist: "Mahalia", title: "Live at Lowlands", venue: "Lowlands Festival", id: "aMIYajikaPU", year: 2022, featured: true },
  { artist: "Kamal.", title: "little pieces, live in Korea", venue: "Seoul Jazz Festival", id: "7MNJKH043Pk", year: 2023, featured: true },
  { artist: "Little Simz", title: "Headline set (full concert)", venue: "Roundhouse Rising", id: "CI1fnm5_ALU", year: 2014, featured: true },
  { artist: "Mahalia", title: "Wish I Missed My Ex", venue: "Wireless Festival", id: "eB0LsA_UuQM", year: 2022 },
  { artist: "Q", title: "Live at Lowlands", venue: "Lowlands Festival", id: "1ByCFNVCVTU", year: 2022 },
  { artist: "Kamal.", title: "homebody, live in Korea", venue: "Seoul Jazz Festival", id: "vTAeTHCpWO8", year: 2023 },
  { artist: "Mahalia", title: "Karma", venue: "YouTube Space, London", id: "QbtNtsyNfEk", year: 2021 },
  { artist: "Mahalia", title: "Consistency", venue: "YouTube Space, London", id: "bFLo4B-w7U4", year: 2021 },
  { artist: "Ella Eyre", title: "Ego", venue: "The One Show, BBC", id: "jgSdKWL7gRE", year: 2017 },
  { artist: "Will Heard", title: "Live set", venue: "Boardmasters", id: "_0uhQED3h6E", year: 2017 },
  { artist: "Mahalia", title: "Winans and J Cole mash up", venue: "1Xtra Live Lounge, BBC", id: "tPvmFuyw0yI", year: 2021 },
  { artist: "Will Heard", title: "I Better Love You, ft. Ms Banks", venue: "Live Session", id: "4HFrLYTUwqA", year: 2020 },
  { artist: "Mahalia", title: "Wish I Missed My Ex", venue: "Capital XTRA Live Session", id: "NziTUW61IvQ", year: 2021 },
  { artist: "Aisling Iris", title: "Live session", venue: "Jazz FM", id: "1_gDCxsfytc", year: 2021 },
];

// Artists Dan has played keys for live. Marie Dahlstrom is verified from stage
// photography (name on the festival screen), the rest from the videos above.
export const artists: string[] = [
  "Mahalia",
  "Little Simz",
  "Ella Eyre",
  "Kamal.",
  "Marie Dahlstrøm",
  "Q",
  "Will Heard",
  "Aisling Iris",
];

export const instruments: string[] = [
  "Roland Jupiter-80",
  "Nord Stage 3",
  "Yamaha",
];

export type Photo = {
  src: string;
  alt: string;
  w: number;
  h: number;
};

export const photos: Photo[] = [
  { src: "/music/hero-crowd.jpg", alt: "Dan silhouetted at his keyboards, facing a festival crowd at sunset", w: 2048, h: 1536 },
  { src: "/music/festival-marie.jpg", alt: "Dan on keys under stage lights during a Marie Dahlstrøm set", w: 1065, h: 1600 },
  { src: "/music/keys-warm.jpg", alt: "Dan playing his Nord Stage 3 in warm stage light", w: 2200, h: 1467 },
  { src: "/music/bbc-jupiter.jpg", alt: "Dan on the Roland Jupiter-80 and Nord Stage 3 against a purple LED wall", w: 2200, h: 1215 },
  { src: "/music/backstage-jupiter.jpg", alt: "Dan behind the Roland Jupiter-80 and Nord Stage 3 before a show", w: 2200, h: 1650 },
  { src: "/music/portrait.jpg", alt: "Portrait of Dan Diggas", w: 900, h: 1200 },
];

// Album / single artwork Dan is credited on. Empty by default so the site never
// implies a credit that has not been confirmed. To populate: drop cover images
// in public/music/covers/ and add entries here. The Records section only renders
// when this array has entries.
export type Release = {
  title: string;
  artist: string;
  role: string; // e.g. "Keys", "Keys and production"
  year: number;
  cover: string; // /music/covers/<file>
  url?: string; // optional listen link
};

export const releases: Release[] = [];
