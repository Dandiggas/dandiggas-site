import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/SocialLinks";
import { Tilt } from "@/components/music/Tilt";

export const metadata: Metadata = {
  title: "About — Dan Diggas",
  description:
    "Daniel Adekugbe (Dan Diggas): producer, songwriter and multi-instrumentalist, and a backend and AI engineer at Sophos. Based in London.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <div className="grid gap-8 md:grid-cols-[300px_1fr] md:gap-12">
        {/* Portrait */}
        <div className="md:sticky md:top-24 md:self-start">
          <Tilt className="relative mx-auto aspect-[4/5] w-full max-w-[300px] overflow-hidden rounded-2xl border border-neutral-200 shadow-xl shadow-black/10 dark:border-neutral-800 dark:shadow-black/40">
            <Image
              src="/about-me.jpg"
              alt="Daniel Adekugbe (Dan Diggas)"
              fill
              priority
              sizes="(min-width: 768px) 300px, 100vw"
              className="object-cover object-[center_20%]"
            />
          </Tilt>
        </div>

        {/* Bio */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-400">
            About
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Daniel Adekugbe
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            a.k.a. Dan Diggas — producer, songwriter and multi-instrumentalist,
            and an engineer. London.
          </p>

          <div className="mt-7 space-y-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
            <p>
              I&rsquo;m Daniel &mdash; Dan Diggas to most people. I make music
              and I build software, and I&rsquo;ve never been able to pick just
              one. On record I produce, write and play; by day I&rsquo;m an
              engineer. The through-line is the same instinct: to make the thing
              that gets out of the way so the real work can happen.
            </p>
            <p>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                Music.
              </span>{" "}
              I&rsquo;m a producer, songwriter and multi-instrumentalist &mdash;
              keys, bass and guitar &mdash; and I&rsquo;ve spent years making
              records with artists including Mahalia, Central Cee, SG Lewis,
              Sinéad Harnett, M Huncho and Marie Dahlstrøm. I produced Central
              Cee&rsquo;s &ldquo;Lil Bro&rdquo;, produced and co-wrote across
              Mahalia&rsquo;s <em>Love and Compromise</em>, and played keys on SG
              Lewis&rsquo;s &ldquo;Aura&rdquo;. Live, I&rsquo;ve held the keys
              chair for Little Simz, Cleo Sol, Kamal. and Ella Eyre &mdash; from
              festival main stages to national TV. I think of the job as building
              an emotive sonic image: chase the feeling first, and let the
              arrangement follow.
            </p>
            <p>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                Engineering.
              </span>{" "}
              The other half is code. I&rsquo;m a backend and AI engineer at
              Sophos, working on the infrastructure behind threat intelligence
              &mdash; the systems that quietly move and make sense of data at
              scale. Away from the day job I build local-first AI tools that turn
              messy, real-world workflows into software you can trust, across
              security, operations and music. The Shed, a practice app for
              musicians, is one of them &mdash; the two halves of my life feeding
              each other.
            </p>
            <p>Based in London.</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
            <Link
              href="/tech"
              className="text-amber-700 hover:underline dark:text-amber-400"
            >
              Explore the tech →
            </Link>
            <Link
              href="/music"
              className="text-amber-700 hover:underline dark:text-amber-400"
            >
              See the music →
            </Link>
          </div>

          <div className="mt-8 border-t border-neutral-200 pt-8 dark:border-neutral-800">
            <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
              Find me elsewhere
            </p>
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
}
