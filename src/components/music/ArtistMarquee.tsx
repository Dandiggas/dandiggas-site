import { Asterisk } from "@phosphor-icons/react/dist/ssr";
import { artists } from "@/lib/music";

export function ArtistMarquee() {
  const loop = [...artists, ...artists];
  return (
    <div className="marquee relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
      <div className="marquee-track flex w-max items-center gap-10 pr-10">
        {loop.map((name, i) => (
          <span key={`${name}-${i}`} className="flex shrink-0 items-center gap-10">
            <span className="whitespace-nowrap text-3xl font-medium tracking-tight text-music-muted transition-colors duration-300 hover:text-music-fg sm:text-4xl md:text-5xl">
              {name}
            </span>
            <Asterisk weight="bold" size={18} className="shrink-0 text-amber-500/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
