import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { credits } from "@/lib/music";
import { Tilt } from "@/components/music/Tilt";

export function Credits() {
  if (credits.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {credits.map((credit) => {
        const external = Boolean(credit.url);
        return (
          <a
            key={credit.cover + credit.title}
            href={credit.url ?? "#"}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="group block"
          >
            <Tilt className="relative aspect-square overflow-hidden rounded-lg border border-music-hairline">
              <Image
                src={credit.cover}
                alt={`${credit.title} by ${credit.artist}`}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-2 top-2 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-sm">
                {credit.role}
              </span>
            </Tilt>
            <p className="mt-2 flex items-center gap-1 text-sm font-medium text-music-fg">
              <span className="truncate">{credit.title}</span>
              <ArrowUpRight
                weight="bold"
                size={13}
                className="shrink-0 text-music-muted opacity-0 transition-opacity group-hover:opacity-100"
              />
            </p>
            <p className="truncate text-xs text-music-muted" title={credit.artist}>
              {credit.artist}
            </p>
            <p className="text-xs text-music-muted/80">{credit.year}</p>
          </a>
        );
      })}
    </div>
  );
}
