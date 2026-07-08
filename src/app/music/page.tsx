import type { Metadata } from "next";
import Image from "next/image";
import { MusicHero } from "@/components/music/MusicHero";
import { ArtistMarquee } from "@/components/music/ArtistMarquee";
import { LiveVideos } from "@/components/music/LiveVideos";
import { PhotoGallery } from "@/components/music/PhotoGallery";
import { Releases } from "@/components/music/Releases";
import { ContactCTA } from "@/components/music/ContactCTA";
import { Reveal } from "@/components/music/Reveal";
import { instruments, releases } from "@/lib/music";

export const metadata: Metadata = {
  title: "Music — Dan Diggas",
  description:
    "Dan Diggas is a London session keyboardist. Live keys for Mahalia, Little Simz, Ella Eyre, Kamal., Marie Dahlstrøm, and more.",
  openGraph: {
    title: "Music — Dan Diggas",
    description:
      "London session keyboardist. Live keys for Mahalia, Little Simz, Ella Eyre, Kamal., Marie Dahlstrøm, and more.",
    images: ["/music/hero-crowd.jpg"],
    type: "website",
  },
};

export default function MusicPage() {
  return (
    <div className="bg-music-bg text-music-fg">
      <MusicHero />

      {/* Bio */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <Reveal className="order-2 md:order-1">
            <div className="overflow-hidden rounded-2xl border border-music-hairline">
              <Image
                src="/music/backstage-jupiter.jpg"
                alt="Dan behind his Roland Jupiter-80 and Nord Stage 3"
                width={2200}
                height={1650}
                sizes="(min-width: 768px) 40vw, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 md:order-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Keys for the room and the record
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-music-muted">
              <p>
                I&rsquo;m a keyboard player from London. Over the last decade
                I&rsquo;ve played stages and sessions, from festival main stages
                to live TV, backing artists across soul, R&amp;B, and jazz.
              </p>
              <p>
                Away from the stage I build software, backend and AI at Sophos,
                and tools for musicians like The Shed. Same instinct either way:
                make the thing that gets out of the way, so the playing can
                happen.
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {instruments.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-music-hairline bg-music-surface px-3 py-1 text-xs text-music-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Played for */}
      <section className="border-y border-music-hairline bg-music-surface/40 py-14">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight">Played for</h2>
          </Reveal>
        </div>
        <div className="mt-8">
          <ArtistMarquee />
        </div>
      </section>

      {/* Live sets */}
      <section id="live" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Live sets
          </h2>
          <p className="mt-3 max-w-xl text-music-muted">
            A run of shows and sessions. Tap to play.
          </p>
        </Reveal>
        <div className="mt-10">
          <LiveVideos />
        </div>
      </section>

      {/* From the stage */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From the stage
          </h2>
        </Reveal>
        <div className="mt-10">
          <PhotoGallery />
        </div>
      </section>

      {/* Records (renders only when releases are added) */}
      {releases.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20 sm:pb-28">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Records
            </h2>
          </Reveal>
          <div className="mt-10">
            <Releases />
          </div>
        </section>
      )}

      {/* Bookings */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <ContactCTA />
      </section>
    </div>
  );
}
