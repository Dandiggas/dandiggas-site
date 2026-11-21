import { LINKS } from "@/lib/links";
import { GitHubIcon, LinkedInIcon, MailIcon, NowIcon, RssIcon, XIcon } from "./icons";

export type FollowKey = "rss" | "rssFeed" | "x" | "linkedin" | "github" | "now" | "email";

const ITEMS: Record<FollowKey, { href: string; label: string; icon: React.ReactNode; external?: boolean }> = {
  rss: { href: LINKS.rss, label: "RSS", icon: <RssIcon /> },
  rssFeed: { href: LINKS.rss, label: "RSS feed", icon: <RssIcon /> },
  x: { href: LINKS.x, label: LINKS.xHandle, icon: <XIcon />, external: true },
  linkedin: { href: LINKS.linkedin, label: "LinkedIn", icon: <LinkedInIcon />, external: true },
  github: { href: LINKS.github, label: "GitHub", icon: <GitHubIcon />, external: true },
  now: { href: LINKS.now, label: "Now", icon: <NowIcon /> },
  email: { href: LINKS.subscribe, label: "Email", icon: <MailIcon /> },
};

/** Quiet mono pills: one per follow path. */
export function FollowRow({ items, label }: { items: FollowKey[]; label?: string }) {
  return (
    <div className="follow">
      {label && <span className="k">{label}</span>}
      {items.map((k) => {
        const it = ITEMS[k];
        return (
          <a
            key={k}
            className="follow-a"
            href={it.href}
            {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {it.icon}
            {it.label}
          </a>
        );
      })}
    </div>
  );
}
