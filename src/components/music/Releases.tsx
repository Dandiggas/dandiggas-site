import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { releases } from "@/lib/music";

// Renders nothing until releases has confirmed entries (see src/lib/music.ts).
export function Releases() {
  if (releases.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {releases.map((release) => {
        const external = Boolean(release.url);
        return (
          <a
            key={release.cover}
            href={release.url ?? "#"}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="group block"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg border border-music-hairline">
              <Image
                src={release.cover}
                alt={`${release.title} cover art`}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
            </div>
            <p className="mt-2 flex items-center gap-1 text-sm font-medium text-music-fg">
              <span className="truncate">{release.title}</span>
              <ArrowUpRight
                weight="bold"
                size={13}
                className="shrink-0 text-music-muted opacity-0 transition-opacity group-hover:opacity-100"
              />
            </p>
            <p className="truncate text-xs text-music-muted" title={release.artist}>
              {release.artist}
            </p>
            <p className="text-xs text-music-muted/80">
              {release.year} · {release.role}
            </p>
          </a>
        );
      })}
    </div>
  );
}
