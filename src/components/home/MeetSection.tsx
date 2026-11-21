import Link from "next/link";
import Image from "next/image";
import { MEET_CARDS } from "@/content/meet";
import { Reveal } from "@/components/motion/Reveal";

/** "Where the two halves meet": one line about the seam, then the three tools that are both halves at once. */
export function MeetSection() {
  return (
    <section className="wrap meet" aria-labelledby="meet-h">
      <Reveal>
        <p className="eyebrow">Where the two halves meet</p>
        <h2 id="meet-h" className="meet-h2">
          Same instinct either way: make the thing that gets out of the way, so the real work can happen.
        </h2>
        <p className="lead">Keys for the room and the record. Software that has to show its work. The tools below are both at once.</p>
      </Reveal>
      <div className="meet-grid">
        {MEET_CARDS.map((c, i) => (
          <Reveal key={c.title} i={i} className="meet-item">
            <Link className="card" href={c.href}>
              <div className="shot">
                <Image src={c.shot} alt={c.title} fill sizes="(min-width: 720px) 370px, 100vw" />
              </div>
              <div className="card-body">
                <div className="card-row">
                  <h3 className="h3 card-title">{c.title}</h3>
                  <span className="pill">{c.pill}</span>
                </div>
                <p className="small">{c.line}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
