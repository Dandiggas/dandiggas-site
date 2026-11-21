import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import { getNowFeed } from "@/content/now";
import { NowFeed } from "@/components/site/NowFeed";
import { KeepUpBand } from "@/components/site/KeepUpBand";

export const metadata: Metadata = {
  title: "Now · Dan Diggas",
  description: "What I have been up to: posts, releases and tools, newest first.",
};

export default function NowPage() {
  const feed = getNowFeed(getAllPosts());
  return (
    <>
      <section className="wrap-narrow now-page">
        <p className="eyebrow rise"><span className="live" aria-hidden="true" />Now</p>
        <h1 className="rise" style={{ ["--i" as string]: 1 }}>What I have been up to.</h1>
        <p className="lead rise" style={{ ["--i" as string]: 2 }}>
          Posts, releases and tools, newest first. The same list feeds the card on the tech page.
        </p>
        <NowFeed items={feed} />
      </section>
      <KeepUpBand />
    </>
  );
}
