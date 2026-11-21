import Image from "next/image";
import { BRIDGE, STAGE_TRACK, SYSTEMS_TRACK, type TrackEntry } from "@/content/about-tracks";
import { Reveal } from "@/components/motion/Reveal";

function Entry({ e, i }: { e: TrackEntry; i: number }) {
  return (
    <Reveal i={i} className="entry">
      <span className="yr">{e.when}</span>
      <div>
        <p className="t">{e.title}</p>
        <p className="s">{e.line}</p>
        {e.covers && (
          <div className="art">
            {e.covers.map((src) => (
              <Image key={src} src={src} alt="" width={44} height={44} />
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export function Tracks() {
  return (
    <section className="tracks" aria-label="Two tracks: stage and studio, and systems">
      <div className="tracks-head">
        <p className="eyebrow">Stage and studio</p>
        <p className="eyebrow">Systems</p>
      </div>
      <div className="track-row">
        <div className="col-left" data-track="stage">
          {STAGE_TRACK.map((e, i) => (
            <Entry key={e.when + e.title} e={e} i={i} />
          ))}
        </div>
        <div className="col-right" data-track="systems">
          <p className="eyebrow col-eyebrow">Systems</p>
          {SYSTEMS_TRACK.map((e, i) => (
            <Entry key={e.when + e.title} e={e} i={i} />
          ))}
        </div>
        <Reveal className="bridge">
          <span className="k">{BRIDGE.label}</span>
          <div>
            <p className="t">{BRIDGE.title}</p>
            <p className="s">{BRIDGE.line}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
