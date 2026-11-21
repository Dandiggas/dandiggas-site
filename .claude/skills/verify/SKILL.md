---
name: verify
description: Drive the dandiggas site (tech.dandiggas.com, a Next.js web UI) like a reader and prove it works. Builds the production site, serves it on localhost:3466 with the newsletter in its "coming soon" state, runs Playwright journeys for home, About, the /tech blog index, a post page, the follow paths (RSS, X @Dandiggastech, LinkedIn, /now) and the Buttondown email form, and saves screenshots at 1440 and 390 wide with motion on and off. Use before calling any UI change on this site done.
---

# Verify the dandiggas site

The surface is a web UI: a Next.js 16 site, built with `next build` and served with `next start`. There is no database, login or seed data. Content is Markdown in `src/content/posts/` (28 posts) and the Now feed in `src/content/now`. The other surfaces are the RSS feed (`/feed.xml`, an HTTP endpoint) and the Vitest unit suite; this skill drives the browser and checks the feed over HTTP.

All commands run from the repo root. The harness is the repo's own `@playwright/test` (Chromium, already installed).

## Launch

```bash
.claude/skills/verify/scripts/verify.sh launch
```

- It runs `npm run build` into `.next` with `NEXT_PUBLIC_BUTTONDOWN_USERNAME=` (empty), then `next start -p 3466` in the background.
- Ready means the line `READY http://localhost:3466` printed after `/tech` answered 200. The build takes about 60 s.
- The build log is `.agent/verify-run/build.log`; the server log is `.agent/verify-run/server.log`.
- It refuses when port 3466 is taken, or when port 3456 is serving. The e2e suite (`npm run test:e2e`) serves the same `.next` folder on 3456, and a rebuild would change it under that run.
- Use another port with `VERIFY_PORT=3470 .claude/skills/verify/scripts/verify.sh launch`. Pass the same `VERIFY_PORT` to doctor, drive and stop.

## Doctor

```bash
.claude/skills/verify/scripts/verify.sh doctor
```

Read-only. Run it after launch and whenever anything looks off. It must print `DOCTOR OK`. It checks: the launcher pid is alive, port 3466 is owned by that pid or its child, the build was made at the current `HEAD`, no tracked file changed since the build, `/` returns 200, the served page carries `.next/BUILD_ID`, `/tech` has `data-state="coming-soon"`, and the evidence folder exists. A failure on "build sha" or "tracked changes" means stop, then launch again.

## Drive

```bash
node .claude/skills/verify/scripts/drive.mjs                # every feature
node .claude/skills/verify/scripts/drive.mjs follow email   # only some
```

Features: `home about tech post follow email`. Each one is a recipe in `features/`. Read the matching file before you change a journey. The driver:

- opens a fresh Chromium context per width (1440x900, and 390x844 with touch) and per motion setting (`no-preference` and `reduce`);
- aborts and logs every request to a host other than localhost, so X, LinkedIn and Buttondown are never contacted;
- with reduce motion on, first fails if any heading or `.rise`/`.reveal` piece is below opacity 0.99 at load, before any scroll;
- then scrolls the whole page once, the way a reader does, so reveals fire and lazy images load, and fails if any `main img` did not load;
- uses stable handles: routes, `getByRole` names (`Proof`, `Get the next post`, `RSS feed`, `Everything on the Now page →`), and data attributes (`data-state`, `data-track`, `data-testid="seam-bar"`).

It exits 1 if any check fails. The last line is `DRIVE OK: n/n checks, m shots` or `DRIVE FAILED: ...`.

## Evidence

Everything goes to `.agent/proof/verify/` (override with `VERIFY_OUT`):

- `<feature>-<what>-<width>-<motion>.png` screenshots, full page for pages and element crops for follow paths and the form;
- `drive-log.txt`, one line per check and per shot, appended per run with a timestamp header;
- `drive-summary.json`, the last run's checks, failures and shot paths.

Proof standards:

- Reach things the reader's way. Open the post by clicking its ledger row on `/tech`. Open `/now` by clicking the Now card link. Open the feed by clicking the RSS pill.
- Capture the action and the result. A follow link is proved by its `href` and `target`, and by the new tab that the click opens aimed at that address. The request is aborted locally, so the outside page itself is never seen. Say so when you report.
- Check side effects. The email form in coming-soon state must send nothing: the driver force-clicks the disabled button and asserts no request to Buttondown and no navigation.
- Never test the "ready" form against the real Buttondown, and never create an account or subscribe. The ready state is covered by `npm run test:e2e` (build with `NEXT_PUBLIC_BUTTONDOWN_USERNAME=example`, submit stubbed locally).
- Read the screenshots. A passed check with a blank or broken screenshot is a failure.

Other checks that go with a full proof: `npm test` (Vitest), `npx tsc --noEmit`, `npm run test:e2e` (needs ports 3456 and 3457 free, so run it after `stop`).

## Cleanup

```bash
.claude/skills/verify/scripts/verify.sh stop
```

It kills only the launcher pid in `.agent/verify-run/server.pid` and its children, never by process name. It prints `STOPPED` and the count of files kept in `.agent/proof/verify/`. It never deletes evidence. It leaves `.next` in place (the normal build folder, ignored by git). Run stop after every failed attempt too.

## Helpers

- `.claude/skills/verify/scripts/verify.sh launch|doctor|stop`: the instance lifecycle above.
- `.claude/skills/verify/scripts/drive.mjs [feature...]`: the journeys and screenshots.

## Gotchas

- `x.com` renders blank to a headless browser, so the driver proves the X link by address, not by the X page.
- The banned-word rule: the employer word checked by `tests/unit/banned-word.test.ts` must never appear in copy, comments, file names, logs or fixtures. Build it from pieces if a check needs it.
- `npm run proof` (`scripts/proof-shots.mjs`) is the older proof script. It writes to `.agent/proof/` and needs both e2e servers on 3456 and 3457. This skill does not use it.
- A full-page screenshot taken without scrolling shows lazy images (`loading="lazy"`) as empty boxes. That is the capture, not the site. The driver scrolls before every full-page shot for this reason.
