// Small helpers for the RSS feed (src/app/feed.xml/route.ts).

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** "2026-11-12" -> RFC 822 at 09:00 UTC. */
export function rfc822(iso: string): string {
  return new Date(`${iso}T09:00:00Z`).toUTCString();
}
