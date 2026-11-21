import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getSiteStats } from "@/lib/site-stats";
import { formatDate, readMinutes } from "@/lib/format";
import { THEMES, themeByKey } from "@/content/themes";
import { FEATURED } from "@/content/featured";
import { PROJECTS } from "@/content/projects";
import { getNowFeed } from "@/content/now";
import { Reveal } from "@/components/motion/Reveal";
import { Words } from "@/components/motion/Words";
import { CountUp } from "@/components/motion/CountUp";
import { Stat } from "@/components/site/Stat";
import { NowFeed } from "@/components/site/NowFeed";
import { FollowRow } from "@/components/site/FollowRow";
import { Subscribe } from "@/components/site/Subscribe";
import { LedgerRow } from "@/components/site/LedgerRow";
import { ThemeFilter } from "@/components/site/ThemeFilter";
import { KeepUpBand } from "@/components/site/KeepUpBand";

export const metadata: Metadata = {
  title: "Tech — Dan Diggas",
  description:
    "Daniel Adekugbe: backend and AI engineer. Every post measured on my own AI agents, every project shipped with its proof.",
};

const ext = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});

export default function TechPage() {
  const posts = getAllPosts();
  const feed = getNowFeed(posts);
  const stats = getSiteStats();
  const featured = FEATURED.map((f) => ({ ...f, post: getPostBySlug(f.slug)! }));
  const shotProjects = PROJECTS.filter((p) => p.featured);
  const rowProjects = PROJECTS.filter((p) => !p.featured);

  return (
    <div className="tech-page">
      {/* Hero: the words, the counts, and the Now card */}
      <section className="wrap tech-hero">
        <div>
          <p className="eyebrow rise" style={{ ["--i" as string]: 0 }}>Engineer · Writing and projects</p>
          <Words text="I run AI coding agents all day and write down what actually happened." className="tech-h1" />
          <p className="lead rise" style={{ ["--i" as string]: 3 }}>
            Backend and AI infrastructure by day. Local-first tools for security, ops and music the rest of the time.
            Every post here is measured on my own sessions, and every project ships with its proof.
          </p>
          <div className="counts rise" style={{ ["--i" as string]: 4 }}>
            {stats.map((s) => (
              <Stat key={s.key} value={s.value} label={s.label} />
            ))}
          </div>
        </div>

        <aside className="now-card rise" style={{ ["--i" as string]: 2 }} aria-label="Now: what I have been doing, and how to follow">
          <div className="head">
            <p className="eyebrow"><span className="live" aria-hidden="true" />Now</p>
            <span className="tiny mono">updated {formatDate(feed[0].date, "short")}</span>
          </div>
          <NowFeed items={feed} limit={5} />
          <FollowRow label="Follow" items={["rss", "x", "linkedin"]} />
          <Subscribe note="One email per post, most weeks. Nothing else, ever." />
        </aside>
      </section>

      {/* Start here */}
      <section className="wrap section">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">Start here</p>
            <h2 className="h2">Three posts, each with the number that made me write it.</h2>
          </div>
          <a className="link" href="#ledger">All {posts.length} posts ↓</a>
        </Reveal>
        <div className="start">
          {featured.map((f, i) => (
            <Reveal key={f.slug} i={i} className="start-item">
              <Link className="card" href={`/posts/${f.slug}`}>
                {f.shot && (
                  <div className="shot">
                    <Image src={f.shot} alt={f.shotAlt ?? ""} fill sizes="(min-width: 960px) 460px, 100vw" />
                  </div>
                )}
                <div className="card-body">
                  <div className="big">
                    <CountUp value={f.big} />
                    <small>{f.label}</small>
                  </div>
                  <p className="card-title">{f.post.title}</p>
                  <p className="small">{f.post.line}</p>
                  <div className="meta">
                    <span className="pill">{themeByKey(f.post.theme)?.chip}</span>
                    <span className="tiny mono">
                      {formatDate(f.post.date, "long")} · {readMinutes(f.post.readTime)}
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The ledger */}
      <section className="wrap section" id="ledger">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">The ledger</p>
            <h2 className="h2">Every post, grouped by what it proves.</h2>
            <p className="small">Date, title, the number, read time. Newest first inside each group. Pick a theme to narrow it.</p>
          </div>
          <ThemeFilter themes={THEMES.map((t) => ({ key: t.key, chip: t.chip }))} total={posts.length} />
        </Reveal>

        {THEMES.map((t) => {
          const group = posts.filter((p) => p.theme === t.key);
          return (
            <div key={t.key} className="theme-block" data-theme={t.key}>
              <Reveal className="label" variant="from-left">
                <h3>{t.label}</h3>
                <p>{t.description}</p>
                <p className="n">{group.length} posts</p>
              </Reveal>
              <div className="ledger">
                {group.map((p, i) => (
                  <LedgerRow key={p.slug} post={p} i={i} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Built and shown */}
      <section className="wrap section" id="projects">
        <Reveal className="section-head">
          <div>
            <p className="eyebrow">Built and shown</p>
            <h2 className="h2">Projects with the screenshot, not just the stack.</h2>
            <p className="small">Each one links to the post where it was measured.</p>
          </div>
        </Reveal>
        <div className="built">
          {shotProjects.map((p, i) => (
            <Reveal key={p.title} i={i} as="article" className="card">
              <div className="shot">
                <Image src={p.shot!} alt={p.title} fill sizes="(min-width: 720px) 560px, 100vw" />
              </div>
              <div className="card-body">
                <div className="card-row">
                  <h3 className="h3">{p.title}</h3>
                  {p.pill && <span className="pill">{p.pill}</span>}
                </div>
                <p className="small">{p.description}</p>
                <div className="chips">
                  {p.tech.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
                <div className="actions">
                  {p.actions.map((a) => (
                    <Link key={a.label} className="link" href={a.href} {...ext(a.href)}>
                      {a.label}
                      {a.external && " ↗"}
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="more">
          {rowProjects.map((p, i) => (
            <Reveal key={p.title} i={i} className="more-row">
              <span>
                <span className="title">{p.title}</span>
                <span className="sub">{p.description}</span>
              </span>
              <span className="sub">{p.tech.join(" · ")}</span>
              <span className="acts">
                {p.pill && <span className="pill">{p.pill}</span>}
                {p.actions.map((a) => (
                  <Link key={a.label} className="link" href={a.href} {...ext(a.href)}>
                    {a.label}
                    {a.external && " ↗"}
                  </Link>
                ))}
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      <KeepUpBand />
    </div>
  );
}
