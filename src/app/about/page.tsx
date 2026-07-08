import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SocialLinks } from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "About — Dan Diggas",
  description:
    "Daniel Adekugbe (Dan Diggas): producer, songwriter and keyboard player, and a backend and AI engineer at Sophos. Based in London.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">About</h1>

      <div className="mb-8 flex items-start gap-6">
        <Image
          src="/profile.jpeg"
          alt="Daniel Adekugbe"
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-full object-cover"
          priority
        />
        <div>
          <h2 className="text-xl font-semibold">Daniel Adekugbe</h2>
          <p className="mt-1 text-neutral-500 dark:text-neutral-400">
            a.k.a. Dan Diggas
          </p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Producer, songwriter, keyboard player. Engineer. London.
          </p>
        </div>
      </div>

      <div className="space-y-4 leading-relaxed text-neutral-700 dark:text-neutral-300">
        <p>
          I work across two things that don&rsquo;t usually share a CV: music
          and software. I make records and play keys, and I build backend and AI
          systems. Both come down to the same instinct, which is to make the
          thing that gets out of the way so the work can happen.
        </p>
        <p>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Music.
          </span>{" "}
          As a producer, songwriter and keyboard player I&rsquo;ve worked with
          Mahalia, Central Cee, SG Lewis, Sinéad Harnett, M Huncho and Marie
          Dahlstrøm, among others. I produced Central Cee&rsquo;s
          &ldquo;Lil Bro&rdquo;, produced and wrote across Mahalia&rsquo;s{" "}
          <em>Love and Compromise</em>, and play keys live for artists including
          Little Simz, Cleo Sol, Kamal. and Ella Eyre, from festival main stages
          to live TV.
        </p>
        <p>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Engineering.
          </span>{" "}
          By day I&rsquo;m a backend and AI engineer at Sophos, working on
          threat-intelligence infrastructure. Outside work I build local-first
          AI tools that turn messy real-world workflows into reliable software,
          across security, operations and music. The Shed, a practice app for
          musicians, is one of them.
        </p>
        <p>Based in London.</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
        <Link
          href="/music"
          className="text-amber-700 hover:underline dark:text-amber-400"
        >
          See the music →
        </Link>
        <Link
          href="/writing"
          className="text-amber-700 hover:underline dark:text-amber-400"
        >
          Read the writing →
        </Link>
        <Link
          href="/projects"
          className="text-amber-700 hover:underline dark:text-amber-400"
        >
          Browse projects →
        </Link>
      </div>

      <div className="mt-8 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
          Find me elsewhere
        </p>
        <SocialLinks />
      </div>
    </div>
  );
}
