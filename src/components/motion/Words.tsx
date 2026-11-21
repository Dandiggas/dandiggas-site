import { Fragment, type CSSProperties } from "react";
import { Reveal } from "./Reveal";

/**
 * A headline that rises one word at a time. The server renders every word as
 * its own span with a plain space between them, so copy-paste and screen
 * readers get the sentence. The motion is CSS (`html.js .words .w`), started
 * when Reveal adds `in`; under reduce motion the words are simply there.
 */
export function Words({
  text,
  as = "h1",
  className,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
}) {
  const words = text.trim().split(/\s+/);
  return (
    <Reveal as={as} className={["words", className].filter(Boolean).join(" ")}>
      {words.map((w, j) => (
        <Fragment key={j}>
          <span className="w" style={{ ["--j" as string]: j } as CSSProperties}>
            {w}
          </span>
          {j < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Reveal>
  );
}
