import Image from "next/image";
import { releases } from "@/lib/music";

// Renders nothing until releases has confirmed entries (see src/lib/music.ts).
export function Releases() {
  if (releases.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
                alt={`${release.title} by ${release.artist}`}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-music-fg">
              {release.title}
            </p>
            <p className="text-xs text-music-muted">
              {release.artist} · {release.role}
            </p>
          </a>
        );
      })}
    </div>
  );
}
