import Link from "next/link";
import Image from "next/image";
import { Code, MusicNotes, ArrowRight } from "@phosphor-icons/react/dist/ssr";

const stagger = (i: number) =>
  ({ ["--stagger" as string]: i } as React.CSSProperties);

const arrowMotion =
  "transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0";

export function SplitLanding() {
  return (
    <div className="split-panels relative flex min-h-[calc(100dvh-4.375rem)] flex-col md:flex-row">
      {/* Engineer */}
      <section
        className="split-panel rise-in group relative flex min-h-[46dvh] items-center overflow-hidden bg-music-bg md:min-h-0"
        style={stagger(0)}
      >
        <div className="tech-grid pointer-events-none absolute inset-0" />
        <Link
          href="/tech"
          aria-label="Enter the tech"
          className="absolute inset-0 z-10"
        />
        <div className="pointer-events-none relative z-0 mx-auto w-full max-w-xl px-8 py-16 md:px-14">
          <Code weight="duotone" size={40} className="text-amber-500" />
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-music-fg sm:text-5xl">
            Engineer
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-music-muted">
            Backend and AI infrastructure at Sophos, plus local-first tools I
            build for security, ops, and music.
          </p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
            Enter the tech
            <ArrowRight weight="bold" className={arrowMotion} />
          </span>
        </div>
      </section>

      {/* Musician */}
      <section
        className="split-panel rise-in group relative flex min-h-[46dvh] items-center overflow-hidden bg-black md:min-h-0"
        style={stagger(1)}
      >
        <Image
          src="/music/keys-warm.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/40 md:bg-gradient-to-r md:from-black/50 md:via-black/40 md:to-black/75" />
        <Link
          href="/music"
          aria-label="Enter the music"
          className="absolute inset-0 z-10"
        />
        <div className="pointer-events-none relative z-0 mx-auto w-full max-w-xl px-8 py-16 md:px-14">
          <MusicNotes weight="duotone" size={40} className="text-amber-300" />
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Musician
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
            Producer, songwriter and multi-instrumentalist. Records with
            Mahalia and Central Cee, live for Little Simz, Cleo Sol, and more.
          </p>
          <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-300">
            Enter the music
            <ArrowRight weight="bold" className={arrowMotion} />
          </span>
        </div>
      </section>

      {/* Seam wordmark (desktop) */}
      <div
        className="rise-in pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        style={stagger(2)}
      >
        <span className="rounded-full border border-white/20 bg-neutral-900/75 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
          Dan Diggas
        </span>
      </div>
    </div>
  );
}
