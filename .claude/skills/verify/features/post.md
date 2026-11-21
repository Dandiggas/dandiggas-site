# Post page

A post page at `/posts/<slug>` reads as a record: title, standfirst, byline, numbers rail, outline, proof figures, next in thread, and a keep-up box. The seeded journey uses `/posts/my-agents-say-done`.

## Sub-features

- `post-open` opens the post from its ledger row on `/tech`.
- `post-record` shows one h1, a standfirst, a byline naming Daniel Adekugbe, and 2 proof figures.
- `post-keep-up` shows the keep-up box.
- `post-rss-head` advertises `/feed.xml` in the head.
- `post-reduce` shows every heading at load with reduce motion on.

## How to get to it (user POV)

- On `/tech`, choose the ledger row for the post, or a Start here card.
- Open `/posts/my-agents-say-done` directly.
- From the RSS feed, follow an item link.

## Driving it with drive.mjs

Preconditions:

- `verify.sh doctor` prints `DOCTOR OK`.
- `src/content/posts/my-agents-say-done.md` exists.

- **Open from ledger.** Run `node .claude/skills/verify/scripts/drive.mjs post`. It clicks `#ledger a.ledger-row[href="/posts/my-agents-say-done"]` and the URL ends with the slug.
- **Record.** One `main h1`, a `.standfirst` longer than 20 characters, a `.byline` naming Daniel Adekugbe, and 2 `.post-body figure.proof`.
- **Keep up.** One `.keep-box`.
- **Feed in head.** `head link[rel="alternate"][type="application/rss+xml"]` points at `/feed.xml`.
- **Proof.** `post-my-agents-say-done-{1440,390}-{motion,reduce}.png`.

## Gotchas

- The outline and the share links are hidden under 960 px by design.
- On a full-page screenshot with motion on, the page must be scrolled first or the lower sections stay faded.
