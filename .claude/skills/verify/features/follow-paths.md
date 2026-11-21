# Follow paths

A reader can follow the site four ways: the RSS feed, X (@Dandiggastech), LinkedIn, and the Now page ("what I have been up to"). The paths appear in the Now card on `/tech`, the keep-up box on each post, and the footer Follow column on every page.

## Sub-features

- `follow-rss` the RSS pill opens `/feed.xml`, served as `application/rss+xml` with 28 items.
- `follow-x` the `@Dandiggastech` pill opens a new tab aimed at `https://x.com/Dandiggastech`.
- `follow-linkedin` the `LinkedIn` pill opens a new tab aimed at the LinkedIn profile.
- `follow-now` the `Everything on the Now page →` link opens `/now`, headed "What I have been up to.".
- `follow-footer` the footer Follow column carries RSS, X, LinkedIn and Now.
- `follow-keep-up` the post keep-up box carries RSS, X, LinkedIn and Now.

## How to get to it (user POV)

- On `/tech`, use the Now card in the hero.
- At the end of any post, use the keep-up box.
- On any page, use the footer Follow column.
- Open `/feed.xml` or `/rss.xml` (redirects) in a feed reader.

## Driving it with drive.mjs

Preconditions:

- `verify.sh doctor` prints `DOCTOR OK`.

- **Pills.** Run `node .claude/skills/verify/scripts/drive.mjs follow`. In `.now-card`, the `a.follow-a` pills `RSS`, `@Dandiggastech` and `LinkedIn` carry the right `href`; X and LinkedIn carry `target="_blank"`.
- **X and LinkedIn click.** Hover, then click each pill. A new tab opens and its request goes to the expected address. The request is aborted locally.
- **RSS click.** Click the RSS pill. The response is `application/rss+xml` with 28 `<item>`s.
- **Now.** On `/tech`, choose `Everything on the Now page →`. The URL ends `/now` and the h1 reads `What I have been up to.`.
- **Footer and keep-up.** `footer .follow-list a` and `.keep-box a.follow-a` include `/feed.xml`, the X URL, the LinkedIn URL and `/now`.
- **Proof.** `follow-tech-now-card-*`, `follow-x-pill-hover-*`, `follow-linkedin-pill-hover-*`, `follow-rss-feed-*`, `follow-now-page-*-{motion,reduce}`, `follow-footer-*`, `follow-post-keep-up-*`.

## Gotchas

- `x.com` renders blank to a headless browser. The proof is the address and the new tab, not the X page.
- The outside pages are never loaded. Report them as not seen.
- `/rss.xml` redirects to `/feed.xml` (308). The e2e suite checks the redirect.
