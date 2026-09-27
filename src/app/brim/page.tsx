import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brim: stems in, session out",
  description:
    "A Mac app that turns a delivery of stems into a session in your DAW, ready to play. Your originals never move.",
};

// The notarised disk image, shared from Dropbox. Null until Dan has opened
// it on a second Mac (MUS-139); until then the buttons say
// "Coming soon".
const RELEASE: { version: string; url: string | null } = {
  version: "0.1.1",
  url: null,
};

const REQUIREMENTS = "Apple silicon Mac · macOS 13 or later · Free";

const does = [
  [
    "Drop in the delivery",
    "A folder, a ZIP, or a Dropbox or Google Drive link. Type the tempo.",
  ],
  [
    "Get a session",
    "Every stem named, on its own track, lined up from bar one, at your tempo.",
  ],
  [
    "Nothing gets lost",
    "Anything Brim is unsure about goes in Unsorted, and a receipt lists every file.",
  ],
  [
    "Your originals stay put",
    "Brim works on copies. Nothing you were sent is moved or changed.",
  ],
];

const daws = ["Ableton Live", "Logic Pro", "FL Studio", "Pro Tools"];

function Download({ className = "" }: { className?: string }) {
  return RELEASE.url ? (
    <a href={RELEASE.url} download className={`brim-cta ${className}`}>
      Download for Mac
      <span aria-hidden="true">↓</span>
    </a>
  ) : (
    <span className={`brim-cta brim-cta-idle ${className}`}>Coming soon</span>
  );
}

export default function BrimPage() {
  return (
    <div className="brim-root">
      {/* Hero: what it is, the download, and the app itself */}
      <section className="relative overflow-hidden">
        <div className="brim-glow pointer-events-none absolute inset-x-0 top-0 h-[560px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-16 sm:pt-24 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <h1 className="brim-wordmark text-7xl sm:text-8xl">Brim.</h1>
            <p className="mt-8 text-3xl leading-tight sm:text-5xl">
              Stems in.
              <br />
              Session out.
            </p>
            <p className="brim-muted mt-6 max-w-md text-lg leading-relaxed">
              Drop in the stems you were sent. Brim builds the session in your
              DAW, ready to play.
            </p>
            <div className="mt-9">
              <Download />
              <p className="brim-muted mt-4 text-sm">
                Version {RELEASE.version} · {REQUIREMENTS}
              </p>
            </div>
          </div>

          <Image
            src="/brim/app.png"
            alt="The Brim app after preparing a delivery called Night Bus for Ableton Live at 92 BPM: Prepared, 7 tracks, with buttons to open it in Ableton or show it in Finder."
            width={1606}
            height={2152}
            priority
            sizes="(max-width: 1024px) 100vw, 560px"
            className="brim-window mx-auto h-auto w-full max-w-[560px]"
          />
        </div>
      </section>

      {/* The result */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="brim-shot">
          <Image
            src="/brim/session-ableton.png"
            alt="The Night Bus session in Ableton Live: Kick, Snare, Hats, Bass, Keys, Lead Vox and Backing Vox, each on its own named track, all starting at bar one."
            width={1438}
            height={1374}
            sizes="(max-width: 768px) 100vw, 720px"
            className="h-auto w-full"
          />
        </div>
        <p className="brim-muted mx-auto mt-5 max-w-md text-center">
          The session Brim built, opened in Ableton Live.
        </p>
      </section>

      {/* What it does */}
      <section className="brim-band">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl sm:text-4xl">What it does</h2>
          <div className="mt-10 grid gap-x-12 gap-y-9 sm:grid-cols-2">
            {does.map(([title, body], i) => (
              <div key={title}>
                <span className="brim-num">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{title}</h3>
                <p className="brim-muted mt-2 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works with */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl sm:text-4xl">Works with</h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {daws.map((daw) => (
            <li key={daw} className="brim-chip">
              {daw}
            </li>
          ))}
        </ul>
      </section>

      {/* Close */}
      <section className="brim-band">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 py-20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-2xl font-semibold sm:text-3xl">
              Your next delivery, ready to play.
            </p>
            <p className="brim-muted mt-2 text-sm">{REQUIREMENTS}</p>
          </div>
          <Download />
        </div>
        <p className="brim-muted mx-auto max-w-6xl px-6 pb-10 text-sm">
          Made by{" "}
          <Link href="/about" className="brim-link">
            Dan Diggas
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
