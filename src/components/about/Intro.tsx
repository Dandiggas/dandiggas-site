import Image from "next/image";
import { Tilt } from "@/components/music/Tilt";
import { credits, gigs } from "@/lib/music";
import { getAllPosts } from "@/lib/posts";

const rise = (i: number) => ({ ["--i" as string]: i }) as React.CSSProperties;

export function Intro() {
  const facts = [
    { value: credits.length, label: "credits as producer, writer or keys" },
    { value: gigs.length, label: "live sets on film" },
    { value: getAllPosts().length, label: "posts measured on my own agents" },
    // Constant: Brim is the one Mac app shipped.
    { value: 1, label: "Mac app, signed and shipped" },
  ];
  return (
    <section className="about-intro">
      <div className="rise" style={rise(0)}>
        <Tilt className="portrait">
          <Image
            src="/about-me.jpg"
            alt="Daniel Adekugbe (Dan Diggas)"
            fill
            priority
            sizes="(min-width: 720px) 300px, 260px"
          />
        </Tilt>
      </div>
      <div>
        <p className="eyebrow rise" style={rise(1)}>About</p>
        <h1 className="rise" style={rise(2)}>Daniel Adekugbe</h1>
        <p className="lead rise" style={rise(3)}>
          Dan Diggas to most people. Producer, songwriter and multi-instrumentalist, and a backend and AI engineer. London.
        </p>
        <div className="prose-about rise" style={rise(4)}>
          <p>
            I make music and I build software, and I&rsquo;ve never been able to pick just one. On record I produce,
            write and play; by day I&rsquo;m an engineer. The through-line is the same instinct: to make the thing that
            gets out of the way so the real work can happen.
          </p>
          <p>
            The two halves feed each other. The Shed, Brim and the Keyboard Manual Assistant are all problems I had as a
            player, solved as an engineer. The proof habit I use on my agents is the same one I use on a set: it works
            when I have seen it work.
          </p>
        </div>
        <div className="facts rise" style={rise(5)}>
          {facts.map((f) => (
            <div key={f.label} className="stat">
              <b data-final={String(f.value)}>{f.value}</b>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
