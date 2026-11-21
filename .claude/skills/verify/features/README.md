# dandiggas site verification map

This folder is the maintained source for verifying what a reader of tech.dandiggas.com sees. Read this index before driving the site, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.claude/skills/verify/scripts/verify.sh launch`. It serves the production build on `http://localhost:3466`.
- The build has no newsletter username, so every email form is in the coming-soon state.
- Content is the 28 posts in `src/content/posts/` and the Now feed in `src/content/now`. There is no seed step and no data to reset.
- Run `.claude/skills/verify/scripts/verify.sh doctor` and require `DOCTOR OK`.
- Never drive an instance this run did not start. The e2e servers on 3456 and 3457 belong to `npm run test:e2e`.

## Driving conventions

- Run journeys with `node .claude/skills/verify/scripts/drive.mjs <feature>`.
- Prefer routes, ARIA roles and accessible names, and data attributes over CSS position.
- Every journey runs at 1440 and 390 wide. Pages with motion run with motion on and with reduce motion on.
- Requests to any host other than localhost are aborted and logged.

## Proof and skip reporting

- Capture the reader's action and the resulting state, not only the final screen.
- UI proof is a screenshot in `.agent/proof/verify/` plus the matching `ok` lines in `drive-log.txt`.
- Record the feature ID and the entry point with every artifact. The file name carries feature, width and motion.
- An outside page (X, LinkedIn, Buttondown) is never loaded. Report those as "link address and new tab proved, outside page not seen".
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the reader-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every reader entry point.
3. `Driving it with drive.mjs` starts with `Preconditions:` and pairs each reader action with the exact command and the observable result.
4. `Gotchas` lists traps that can waste or invalidate a run.

## Features

- [Home](./home.md) covers the split hero, the seam bar on mobile, the now strip and the meet cards.
- [About](./about.md) covers the facts, the two tracks and the onward buttons.
- [Tech index](./tech-index.md) covers the /tech ledger, Start here and the Proof filter chip.
- [Post page](./post.md) covers opening a post from the ledger and the post record.
- [Follow paths](./follow-paths.md) covers RSS, X @Dandiggastech, LinkedIn and the /now "what I have been up to" feed.
- [Email form](./email-form.md) covers the Buttondown form in its coming-soon placeholder state.
