import type { Metadata } from "next";
import Link from "next/link";
import { Intro } from "@/components/about/Intro";
import { Tracks } from "@/components/about/Tracks";

export const metadata: Metadata = {
  title: "About — Dan Diggas",
  description:
    "Daniel Adekugbe (Dan Diggas): producer, songwriter and multi-instrumentalist, and a backend and AI engineer. Based in London.",
};

export default function AboutPage() {
  return (
    <div className="wrap about-page">
      <Intro />
      <Tracks />
      <div className="elsewhere">
        <div>
          <p className="eyebrow muted">Find me elsewhere</p>
          <p className="small">For live dates, sessions, or to talk about agent systems.</p>
        </div>
        <div className="buttons">
          <Link className="btn ghost" href="/tech">Explore the tech →</Link>
          <Link className="btn" href="/music">See the music →</Link>
        </div>
      </div>
    </div>
  );
}
