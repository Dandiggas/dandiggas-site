# Site state

## Published, 20 October 2026

Blog: https://tech.dandiggas.com/posts/i-stopped-writing-rules-for-my-ai-agents

Site commit `e30196e` (`src/content/posts/i-stopped-writing-rules-for-my-ai-agents.md`) pushed to `origin/main` and verified live (HTTP 200, title `<title>I Typed &#x27;I Told You&#x27; 117 Times. Then I Stopped Writing Rules for My AI Agents. — Dan Diggas</title>`). LinkedIn companion draft at `~/Desktop/Inbox/2026-10-20-linkedin-post-code-guards.md` opened for Dan to post manually.

## Brim trial link, 17 October 2026

/brim now carries "No key yet? Start a free 7 day trial" under both Buy buttons. It goes through /brim/trial?from=hero|close (noindex pass-through, same GoToCheckout component as /brim/buy, now taking url/event/heading props) so a trial click is a counted pageview; `track("trial_click")` also fires for a future Pro plan. TRIAL_CHECKOUT_URL in src/app/brim/checkout.ts points at the LIVE Brim Trial product 1447910 since 35e96e1 (17 Oct 07:00, live: /brim/trial redirects to .../buy/884a537d...; the checkout shows "Brim Trial, FREE" with no test banner). Commit 9d30a93, pushed, deployed. PROVEN: live HTML carries the link; a Safari visit landed on the "Brim Trial, FREE" checkout; Vercel API reports /brim/trial 1 pageview.

## Brim page tracking, 16 October 2026

Vercel Web Analytics is on: `<Analytics />` in src/app/layout.tsx (site wide), and Web Analytics enabled on the Vercel project by CLI (`vercel project web-analytics dandiggas-site`; the project record showed an id before but the query API said "not enabled" until this). Team is on the Hobby plan: pageviews and referrers only, no custom events, no UTM breakdown. So both Buy buttons go through /brim/buy?from=hero|close (a pass-through page, noindex, hands over to Lemon Squeezy after 250 ms), and a Buy click is the pageview count of that path. `track("buy_click")` is also called and starts counting if the team ever moves to Pro. Checkout URL now lives in src/app/brim/checkout.ts. Commits 71f4e8f and 94ad1d0 (the pass-through waits for the analytics script to run before handing over), both deployed READY. PROVEN 16 Oct 23:40: the API reports /brim 2 pageviews and /brim/buy 1 pageview after a Safari visit. Gotcha: a DevTools-driven Chrome has navigator.webdriver = true and Vercel's script drops it, so automated clicks never count; test with a normal browser. Read counts with the REST API: `GET /v1/query/web-analytics/visits/aggregate?by=requestPath` with the CLI token (team_alPLvtRPHdLJsv8Sqrav7FhX, prj_Rcg42bU9iVLn2vBwj23M36yFIEMC). Ad plan: ~/Desktop/Inbox/2026-10-16-brim-ad-run-plan.md, Linear MUS-256.

## Published, 12 October 2026

Blog: https://tech.dandiggas.com/posts/what-my-ai-agents-could-reach
LinkedIn: https://www.linkedin.com/feed/update/urn:li:activity:7515450058922831872/

Dan approved publication of both pieces. The LinkedIn post includes the private-data route screenshot and the blog link. Read back the published post in Dia and visually inspected it. Fetched the live blog, checked the article text, matched all three image hashes, and visually inspected its rendered page. Site commit: `8c4286b`, pushed to `main`.

## Brim downloads live, 13 October 2026

/brim now offers Brim 0.1.4 as two notarised installers: Apple silicon and Intel, both macOS 12 Monterey or later. Files are served from public/brim/download (36 MB and 43 MB, committed to the repo). Commit d536cfb, pushed to main. Proof: both DMGs downloaded from https://tech.dandiggas.com/brim/download/ with SHA-256 matching brim/releases/0.1.4/SHA256SUMS.txt; live page screenshot inspected. Not verified: install on a physical Intel Mac or on macOS 12 (see brim/releases/README.md). Next release: replace both files and the VERSION/BUILDS constants in src/app/brim/page.tsx. If the repo size becomes a problem, move installers to Dropbox links.

## Brim buy link live, 16 October 2026

/brim keeps both free 0.1.5 downloads and adds "If Brim saves you time, you can buy it for £29." under the hero downloads and in the closing section. Link = Lemon Squeezy LIVE checkout https://brim.lemonsqueezy.com/checkout/buy/24e2a8d2-b617-4aa1-b6bb-413f439a774b (product 1444195, variant 2254617). Commit 40a0691, pushed to main. Proof: live page HTML carries the link; live page screenshot inspected; clicking the link opened the checkout (Brim, £29.00, card + PayPal, no test-mode banner), screenshot inspected. No real purchase made (Lemon Squeezy warns against own-card tests). Not verified: payouts (bank + 2FA on the Setup page).

## Brim paid only, 16 October 2026

Dan: "it's now a paid thing, take all the free stuff off". /brim now shows "Buy Brim · £29" (hero + close) and no download buttons or Free labels. Both 0.1.5 DMGs deleted from public/ (commit 2ce3b73, pushed); old URLs return 404. Installers attached to the live Lemon Squeezy product (files 781242 Apple silicon, 781243 Intel, published, read back via API) and delivered after payment with a licence key. Live page screenshots inspected in Dia. Caveat: the DMGs remain in git history and with past testers; the app does not check the licence key yet (option B).

## 2026-10-16 evening: free installers scrubbed from GitHub (option B)
- History rewritten with git filter-repo (no .dmg anywhere), force-pushed; main = 8109001.
- Repo deleted and recreated (new GitHub repo id 1422553659) so old commit links stop serving DMGs. Old raw/commit links (0b16fcc, d536cfb) now 404.
- Vercel reconnected via `vercel git connect` (link.repoId 1422553659, prod branch main). Production deploy dpl_68N5Z4zJtRQ383Z5ChbDegAihrSB from main READY; /brim checked live.
- Also c06206b: licence-key wording removed from the buy note.
- Backup of pre-scrub history: ~/Desktop/Archive/dandiggas-site-pre-scrub-2026-10-16.bundle
