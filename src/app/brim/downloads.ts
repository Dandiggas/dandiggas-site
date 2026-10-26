// Brim is free (26 Oct 2026, until the MUS-71 traction number).
// The two notarised installers are served from public/brim/download.
// Source of truth for builds and minimum macOS: brim/docs/releasing.md.
export const VERSION = "0.1.12";

export type Build = { id: string; name: string; url: string };

export const BUILDS: Build[] = [
  {
    id: "apple-silicon",
    name: "Apple silicon",
    url: `/brim/download/Brim-${VERSION}-Apple-Silicon.dmg`,
  },
  {
    id: "intel",
    name: "Intel",
    url: `/brim/download/Brim-${VERSION}-Intel.dmg`,
  },
];

// Every download button goes through /brim/get first, so each click is
// counted as a pageview of that path (the Hobby plan has no custom events).
export function getPath(build: Build, from: string) {
  return `/brim/get?build=${build.id}&from=${encodeURIComponent(from)}`;
}
