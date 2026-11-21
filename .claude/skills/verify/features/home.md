# Home

The home page at `/` splits the site into its two halves (tech and music), shows a "now" strip of three current links, and a "where the two halves meet" section of three cards.

## Sub-features

- `home-load` renders `/` with the site name in the title.
- `home-seam` shows the seam bar between the panels on mobile and hides it on desktop.
- `home-now-strip` shows three now-strip links.
- `home-meet` shows three meet cards.
- `home-reduce` shows every heading at load with reduce motion on.

## How to get to it (user POV)

- Open `http://localhost:3466/`.
- Choose the `Dan Diggas` brand link in the header or footer from any page.

## Driving it with drive.mjs

Preconditions:

- `verify.sh doctor` prints `DOCTOR OK`.

- **Load.** Run `node .claude/skills/verify/scripts/drive.mjs home`. `/` returns 200 and the title contains `Dan Diggas`.
- **Now strip.** The same run counts `.now-strip a.cell`. The count is 3.
- **Meet.** The same run counts `.meet .card`. The count is 3.
- **Seam.** `getByTestId("seam-bar")` is visible at 390 and hidden at 1440.
- **Reduce motion.** At load, with no scroll, no `main h1/h2/h3`, `.rise` or `.reveal` is below opacity 0.99.
- **Proof.** `home-1440-motion.png`, `home-1440-reduce.png`, `home-390-motion.png`, `home-390-reduce.png` in `.agent/proof/verify/`.

## Gotchas

- The panels rise in. Assert positions only after the `rise-in` animations finish.
- The now strip text includes the current Brim version. A Brim release changes it.
