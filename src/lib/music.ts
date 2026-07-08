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
  { artist: "Cleo Sol", title: "High / Too Experienced", venue: "HMV Forum, Kentish Town", id: "flNnmCTH17o", year: 2011 },
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
  "Cleo Sol",
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

// Releases where "Dan Diggas" is a credited artist on the release itself (per
// Apple Music / iTunes), not an unverifiable session credit. Billing strings
// match how each release is credited.
export const releases: Release[] = [
  { title: "No Drama", artist: "Dan Diggas, Marie Dahlstrøm & J Warner", role: "Single", year: 2020, cover: "/music/covers/no-drama.jpg", url: "https://music.apple.com/album/1527138503" },
  { title: "Grow", artist: "Dan Diggas & Geneva White", role: "Single", year: 2021, cover: "/music/covers/grow.jpg", url: "https://music.apple.com/album/1587784964" },
  { title: "4inARow", artist: "Marie Dahlstrøm, Dan Diggas & Aligo", role: "EP", year: 2021, cover: "/music/covers/4inarow.jpg", url: "https://music.apple.com/album/1545620730" },
  { title: "Need You, Pt. 2", artist: "Marie Dahlstrøm, Dan Diggas & Dayne Jordan", role: "Single", year: 2021, cover: "/music/covers/need-you-pt2.jpg", url: "https://music.apple.com/album/1585127930" },
  { title: "Pomiędzy", artist: "Vito Bambino, feat. Dan Diggas", role: "Def Jam World Tour: London", year: 2025, cover: "/music/covers/pomiedzy.jpg", url: "https://music.apple.com/album/1798470482" },
];

// Production, songwriting and keys credits for other artists. Roles and titles
// verified against Apple Music / Deezer / press. See the two-per-role note in
// the design if adding more. Ordered so repeated album covers are not adjacent.
export type Credit = {
  title: string;
  artist: string;
  role: "Producer" | "Writer" | "Keys";
  year: number;
  cover: string;
  url?: string;
};

export const credits: Credit[] = [
  { title: "Lil Bro", artist: "Central Cee", role: "Producer", year: 2022, cover: "/music/credits/lil-bro.jpg", url: "https://music.apple.com/us/search?term=Central%20Cee%20Lil%20Bro" },
  { title: "Square 1", artist: "Mahalia", role: "Producer", year: 2019, cover: "/music/credits/square-1.jpg", url: "https://music.apple.com/us/search?term=Mahalia%20Square%201" },
  { title: "Aura", artist: "SG Lewis, feat. J Warner", role: "Keys", year: 2018, cover: "/music/credits/aura.jpg", url: "https://music.apple.com/us/search?term=SG%20Lewis%20Aura" },
  { title: "Nothing On You", artist: "Marie Dahlstrøm, feat. Odeal", role: "Producer", year: 2024, cover: "/music/credits/nothing-on-you.jpg", url: "https://music.apple.com/us/search?term=Marie%20Dahlstrom%20Nothing%20On%20You" },
  { title: "I Wish I Missed My Ex", artist: "Mahalia", role: "Writer", year: 2019, cover: "/music/credits/i-wish.jpg", url: "https://music.apple.com/us/search?term=Mahalia%20I%20Wish%20I%20Missed%20My%20Ex" },
  { title: "Walking Away", artist: "Sinéad Harnett", role: "Writer", year: 2019, cover: "/music/credits/walking-away.jpg", url: "https://music.apple.com/us/search?term=Sinead%20Harnett%20Walking%20Away" },
  { title: "VIBE (Interlude)", artist: "M Huncho", role: "Producer", year: 2021, cover: "/music/credits/vibe-interlude.jpg", url: "https://music.apple.com/us/search?term=M%20Huncho%20VIBE%20Interlude" },
  { title: "Regular People", artist: "Mahalia, feat. Hamzaa & Lucky Daye", role: "Writer", year: 2019, cover: "/music/credits/regular-people.jpg", url: "https://music.apple.com/us/search?term=Mahalia%20Regular%20People" },
  { title: "Little Love", artist: "Blinkie, feat. Grace Tither", role: "Writer", year: 2019, cover: "/music/credits/little-love.jpg", url: "https://music.apple.com/us/search?term=Blinkie%20Little%20Love" },
  { title: "New Every Morning", artist: "Ryan Ofei", role: "Producer", year: 2023, cover: "/music/credits/new-every-morning.jpg", url: "https://music.apple.com/us/search?term=Ryan%20Ofei%20New%20Every%20Morning" },
];
