import Image from "next/image";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";

const stagger = (i: number) =>
  ({ ["--stagger" as string]: i } as React.CSSProperties);

export function MusicHero() {
  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden bg-black">
      <Image
        src="/music/hero-crowd.jpg"
        alt="Dan performing to a festival crowd at sunset"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 sm:pb-24">
        <p
          className="rise-in font-mono text-xs uppercase tracking-[0.25em] text-amber-400"
          style={stagger(0)}
        >
          Producer, songwriter, multi-instrumentalist
        </p>
        <h1
          className="rise-in mt-4 text-5xl font-bold tracking-tight text-white sm:text-7xl"
          style={stagger(1)}
        >
          Dan Diggas
        </h1>
        <p
          className="rise-in mt-5 max-w-xl text-lg leading-relaxed text-white/80"
          style={stagger(2)}
        >
          Studio and stage work with Mahalia, Central Cee, SG Lewis, Little
          Simz, and more. Based in London.
        </p>
        <a
          href="#live"
          className="rise-in mt-8 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-300"
          style={stagger(3)}
        >
          Watch live sets
          <ArrowDown weight="bold" />
        </a>
      </div>
    </section>
  );
}
