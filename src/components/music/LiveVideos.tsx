"use client";

import { useState } from "react";
import { Play } from "@phosphor-icons/react";
import { gigs, type Gig } from "@/lib/music";

function VideoCard({
  gig,
  active,
  onPlay,
}: {
  gig: Gig;
  active: boolean;
  onPlay: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-music-hairline bg-black">
      <div className="relative aspect-video w-full">
        {active ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${gig.id}?autoplay=1&rel=0`}
            title={`${gig.artist}, ${gig.title}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            onClick={onPlay}
            aria-label={`Play ${gig.artist}, ${gig.title}, ${gig.venue}`}
            className="absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://i.ytimg.com/vi/${gig.id}/hqdefault.jpg`}
              alt=""
              aria-hidden
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-400/95 text-neutral-950 shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play weight="fill" size={22} />
            </span>
            <span className="absolute inset-x-0 bottom-0 p-4 text-left">
              <span className="block text-sm font-semibold text-white">
                {gig.artist}
              </span>
              <span className="block truncate text-xs text-white/70">
                {gig.title} · {gig.venue}
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export function LiveVideos() {
  const [active, setActive] = useState<string | null>(null);
  const [featured, ...rest] = gigs;

  return (
    <div className="space-y-4">
      <VideoCard
        gig={featured}
        active={active === featured.id}
        onPlay={() => setActive(featured.id)}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((gig) => (
          <VideoCard
            key={gig.id}
            gig={gig}
            active={active === gig.id}
            onPlay={() => setActive(gig.id)}
          />
        ))}
      </div>
    </div>
  );
}
