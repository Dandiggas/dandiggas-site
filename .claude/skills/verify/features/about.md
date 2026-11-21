# About

The About page at `/about` shows four facts, two career tracks side by side (stage and systems), a bridge line, and two onward buttons.

## Sub-features

- `about-facts` shows four facts.
- `about-tracks` shows 10 stage entries and 8 systems entries.
- `about-onward` shows the buttons `Explore the tech →` and `See the music →`.
- `about-reduce` shows every heading at load with reduce motion on.

## How to get to it (user POV)

- Choose `About` in the header.
- Open `http://localhost:3466/about`.

## Driving it with drive.mjs

Preconditions:

- `verify.sh doctor` prints `DOCTOR OK`.

- **Facts.** Run `node .claude/skills/verify/scripts/drive.mjs about`. `.facts .stat` count is 4.
- **Tracks.** `[data-track="stage"] .entry` count is 10 and `[data-track="systems"] .entry` count is 8.
- **Onward.** `.elsewhere .btn` texts are `Explore the tech →` and `See the music →`.
- **Reduce motion.** Nothing is invisible at load with reduce motion on.
- **Proof.** `about-{1440,390}-{motion,reduce}.png`.

## Gotchas

- On mobile the systems column gets its own eyebrow (`.col-eyebrow`). It is hidden at desktop by design.
- The social icon row is not in the main content; it lives in the footer.
