// Drive the running verification instance like a reader, assert what the reader
// sees, and save screenshots as evidence.
//
// Usage (after verify.sh launch and verify.sh doctor):
//   node .claude/skills/verify/scripts/drive.mjs                 # every feature
//   node .claude/skills/verify/scripts/drive.mjs home follow     # some features
//   VERIFY_PORT=3466 VERIFY_OUT=.agent/proof/verify node ...     # defaults shown
// Features: home about tech post follow email
// Each journey runs at 1440 and 390 wide, with motion on and with reduce motion
// on where the page has motion. Every request that leaves localhost is aborted
// and logged, so X, LinkedIn and Buttondown are never contacted.
// Output: <out>/<feature>-<what>-<width>-<motion>.png, <out>/drive-log.txt,
// <out>/drive-summary.json. Exit code 1 if any check failed.
import { chromium } from "@playwright/test";
import { appendFileSync, mkdirSync, writeFileSync } from "fs";
import path from "path";

const PORT = process.env.VERIFY_PORT || "3466";
const BASE = `http://localhost:${PORT}`;
const OUT = path.resolve(process.env.VERIFY_OUT || ".agent/proof/verify");
const POST = "/posts/my-agents-say-done";
const X = "https://x.com/Dandiggastech";
const LINKEDIN = "https://www.linkedin.com/in/daniel-adekugbe-11a71859/";
mkdirSync(OUT, { recursive: true });

const results = [];
const shots = [];
const log = (line) => {
  console.log(line);
  appendFileSync(path.join(OUT, "drive-log.txt"), line + "\n");
};
appendFileSync(path.join(OUT, "drive-log.txt"), `\n=== drive ${new Date().toISOString()} ${BASE}\n`);

function check(feature, name, cond, detail = "") {
  results.push({ feature, name, ok: !!cond, detail });
  log(`${cond ? "ok  " : "FAIL"} [${feature}] ${name}${detail ? " :: " + detail : ""}`);
}

const browser = await chromium.launch();

async function open(width, motion) {
  const mobile = width < 1000;
  const ctx = await browser.newContext({
    viewport: { width, height: mobile ? 844 : 900 },
    deviceScaleFactor: mobile ? 2 : 1,
    reducedMotion: motion === "reduce" ? "reduce" : "no-preference",
    isMobile: mobile,
    hasTouch: mobile,
  });
  const outside = [];
  await ctx.route((u) => u.hostname !== "localhost" && u.hostname !== "127.0.0.1", (r) => {
    outside.push(r.request().url());
    return r.abort();
  });
  const page = await ctx.newPage();
  return { ctx, page, outside };
}

// Read to the end like a reader: scroll once so every reveal fires and every
// lazy image loads. Under reduce motion the "nothing invisible at load" check
// runs BEFORE this, so a heading stuck at opacity 0 is still caught.
async function settle(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(1600);
}

async function hiddenAtLoad(page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("main h1, main h2, main h3, .reveal, .rise"))
      .filter((el) => {
        let o = 1;
        for (let n = el; n instanceof HTMLElement; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
        return o < 0.99;
      })
      .map((el) => (el.textContent || "").trim().slice(0, 40)),
  );
}

async function shot(target, file, fullPage = false) {
  const p = path.join(OUT, file);
  // A page takes fullPage; a locator only takes a path.
  await target.screenshot(fullPage ? { path: p, fullPage: true } : { path: p });
  shots.push(p);
  log(`shot ${path.relative(process.cwd(), p)}`);
}

const MODES = [
  [1440, "motion"],
  [1440, "reduce"],
  [390, "motion"],
  [390, "reduce"],
];

async function fullPageJourney(feature, route, file, asserts) {
  for (const [w, m] of MODES) {
    const { ctx, page, outside } = await open(w, m);
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    check(feature, `${route} returns 200 @${w}/${m}`, res.status() === 200, String(res.status()));
    if (m === "reduce") {
      await page.waitForTimeout(600);
      const hidden = await hiddenAtLoad(page);
      check(feature, `reduce motion: nothing invisible at load @${w}`, hidden.length === 0, hidden.join(" | "));
    }
    await asserts(page, w, m);
    await settle(page, m);
    const broken = await page.evaluate(() =>
      Array.from(document.querySelectorAll("main img")).filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.currentSrc || i.src),
    );
    check(feature, `every image in main loaded after reading to the end @${w}/${m}`, broken.length === 0, broken.join(" "));
    await shot(page, `${file}-${w}-${m}.png`, true);
    check(feature, `no request left localhost @${w}/${m}`, outside.length === 0, outside.join(" "));
    await ctx.close();
  }
}

const FEATURES = {
  async home() {
    await fullPageJourney("home", "/", "home", async (page, w) => {
      check("home", "title names the site", /Dan Diggas/.test(await page.title()), await page.title());
      check("home", "now strip has 3 links", (await page.locator(".now-strip a.cell").count()) === 3);
      check("home", "meet section has 3 cards", (await page.locator(".meet .card").count()) === 3);
      const bar = await page.getByTestId("seam-bar").isVisible();
      check("home", `seam bar ${w < 1000 ? "shown" : "hidden"} @${w}`, w < 1000 ? bar : !bar);
    });
  },

  async about() {
    await fullPageJourney("about", "/about", "about", async (page) => {
      check("about", "4 facts", (await page.locator(".facts .stat").count()) === 4);
      check("about", "stage track has 10 entries", (await page.locator('[data-track="stage"] .entry').count()) === 10);
      check("about", "systems track has 8 entries", (await page.locator('[data-track="systems"] .entry').count()) === 8);
      const btns = await page.locator(".elsewhere .btn").allTextContents();
      check("about", "two onward buttons", btns.join("|") === "Explore the tech →|See the music →", btns.join("|"));
    });
  },

  async tech() {
    await fullPageJourney("tech", "/tech", "tech-index", async (page) => {
      check("tech", "ledger lists 28 posts", (await page.locator("#ledger a.ledger-row").count()) === 28);
      check("tech", "start here has 3 cards", (await page.locator(".start .card").count()) === 3);
    });
    // Filter the ledger the way a reader does: press the Proof chip.
    for (const w of [1440, 390]) {
      const { ctx, page } = await open(w, "motion");
      await page.goto(BASE + "/tech", { waitUntil: "networkidle" });
      const chip = page.getByRole("button", { name: "Proof", exact: true });
      await chip.click();
      await page.waitForTimeout(500);
      check("tech", `Proof chip pressed @${w}`, (await chip.getAttribute("aria-pressed")) === "true");
      const visible = await page.locator("#ledger a.ledger-row:visible").count();
      check("tech", `Proof chip narrows ledger to 5 @${w}`, visible === 5, String(visible));
      await page.locator("#ledger").scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await shot(page.locator("#ledger"), `tech-ledger-proof-filter-${w}-motion.png`);
      await ctx.close();
    }
  },

  async post() {
    // Reach the post the reader's way: from the ledger row on /tech.
    for (const w of [1440, 390]) {
      const { ctx, page } = await open(w, "motion");
      await page.goto(BASE + "/tech", { waitUntil: "networkidle" });
      await page.locator(`#ledger a.ledger-row[href="${POST}"]`).click();
      await page.waitForURL("**" + POST);
      check("post", `ledger row opens ${POST} @${w}`, page.url().endsWith(POST), page.url());
      await ctx.close();
    }
    await fullPageJourney("post", POST, "post-my-agents-say-done", async (page) => {
      check("post", "one h1", (await page.locator("main h1").count()) === 1);
      check("post", "standfirst present", ((await page.locator(".standfirst").textContent()) || "").length > 20);
      check("post", "byline names Daniel Adekugbe", /Daniel Adekugbe/.test((await page.locator(".byline").textContent()) || ""));
      check("post", "2 proof figures", (await page.locator(".post-body figure.proof").count()) === 2);
      check("post", "keep-up box present", (await page.locator(".keep-box").count()) === 1);
      const rss = await page.locator('head link[rel="alternate"][type="application/rss+xml"]').getAttribute("href");
      check("post", "head advertises the RSS feed", /\/feed\.xml$/.test(rss || ""), rss || "none");
    });
  },

  async follow() {
    for (const w of [1440, 390]) {
      // 1. The Now card on /tech: RSS, X, LinkedIn pills.
      let { ctx, page, outside } = await open(w, "motion");
      await page.goto(BASE + "/tech", { waitUntil: "networkidle" });
      const card = page.locator(".now-card");
      const pill = (label) => card.locator("a.follow-a", { hasText: label });
      check("follow", `now card RSS -> /feed.xml @${w}`, (await pill("RSS").getAttribute("href")) === "/feed.xml");
      check("follow", `now card X label is @Dandiggastech @${w}`, ((await pill("@Dandiggastech").textContent()) || "").includes("@Dandiggastech"));
      check("follow", `now card X -> ${X} in a new tab @${w}`, (await pill("@Dandiggastech").getAttribute("href")) === X && (await pill("@Dandiggastech").getAttribute("target")) === "_blank");
      check("follow", `now card LinkedIn -> profile in a new tab @${w}`, (await pill("LinkedIn").getAttribute("href")) === LINKEDIN && (await pill("LinkedIn").getAttribute("target")) === "_blank");
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await shot(card, `follow-tech-now-card-${w}-motion.png`);

      // Click X and LinkedIn: a new tab opens to the right address; the request is aborted locally.
      for (const [label, url, file] of [["@Dandiggastech", X, "x"], ["LinkedIn", LINKEDIN, "linkedin"]]) {
        await pill(label).hover();
        await page.waitForTimeout(300);
        await shot(pill(label), `follow-${file}-pill-hover-${w}-motion.png`);
        const [tab] = await Promise.all([ctx.waitForEvent("page"), pill(label).click()]);
        await tab.waitForLoadState().catch(() => {});
        const tried = outside.find((u) => u.startsWith(url.replace(/\/$/, "")));
        check("follow", `clicking ${label} opens a new tab aimed at ${url} @${w}`, !!tried, tried || outside.join(" "));
        await tab.close();
      }

      // 2. RSS: click the pill, land on the feed.
      const [resp] = await Promise.all([page.waitForResponse((r) => r.url().endsWith("/feed.xml")), pill("RSS").click()]);
      check("follow", `RSS click serves application/rss+xml @${w}`, (resp.headers()["content-type"] || "").includes("application/rss+xml"), resp.headers()["content-type"]);
      const xml = await resp.text();
      const items = (xml.match(/<item>/g) || []).length;
      check("follow", `feed carries 28 items @${w}`, items === 28, String(items));
      await page.waitForTimeout(500);
      await shot(page, `follow-rss-feed-${w}.png`);
      await ctx.close();

      // 3. "What I've been up to": Now card link -> /now page.
      ({ ctx, page } = await open(w, "motion"));
      await page.goto(BASE + "/tech", { waitUntil: "networkidle" });
      await page.getByRole("link", { name: "Everything on the Now page →" }).click();
      await page.waitForURL("**/now");
      check("follow", `Now card link opens /now @${w}`, page.url().endsWith("/now"));
      check("follow", `/now heading reads "What I have been up to." @${w}`, ((await page.locator("main h1").textContent()) || "").trim() === "What I have been up to.");
      await ctx.close();
      for (const m of ["motion", "reduce"]) {
        ({ ctx, page } = await open(w, m));
        await page.goto(BASE + "/now", { waitUntil: "networkidle" });
        if (m === "reduce") {
          await page.waitForTimeout(600);
          const hidden = await hiddenAtLoad(page);
          check("follow", `/now reduce motion: nothing invisible at load @${w}`, hidden.length === 0, hidden.join(" | "));
        }
        await settle(page, m);
        await shot(page, `follow-now-page-${w}-${m}.png`, true);
        await ctx.close();
      }

      // 4. Footer Follow column (every page) and the post's keep-up box.
      ({ ctx, page } = await open(w, "motion"));
      await page.goto(BASE + "/about", { waitUntil: "networkidle" });
      const hrefs = await page.locator("footer .follow-list a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
      const need = ["/feed.xml", X, LINKEDIN, "/now"];
      check("follow", `footer Follow carries RSS, X, LinkedIn, Now @${w}`, need.every((h) => hrefs.includes(h)), hrefs.join(" "));
      check("follow", `footer shows @Dandiggastech @${w}`, ((await page.locator("footer .follow-list").textContent()) || "").includes("@Dandiggastech"));
      await page.locator("footer.site-footer").scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await shot(page.locator("footer.site-footer"), `follow-footer-${w}-motion.png`);
      await page.goto(BASE + POST, { waitUntil: "networkidle" });
      const kb = page.locator(".keep-box");
      const kh = await kb.locator("a.follow-a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
      check("follow", `post keep-up box carries RSS, X, LinkedIn, Now @${w}`, need.every((h) => kh.includes(h)), kh.join(" "));
      await kb.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await shot(kb, `follow-post-keep-up-${w}-motion.png`);
      await ctx.close();
    }
  },

  async email() {
    for (const w of [1440, 390]) {
      for (const m of ["motion", "reduce"]) {
        const { ctx, page, outside } = await open(w, m);
        for (const [route, where, sel] of [["/tech", "tech", ".now-card .subscribe"], [POST, "post", ".keep-box .subscribe"], ["/now", "now", ".subscribe"]]) {
          await page.goto(BASE + route, { waitUntil: "networkidle" });
          const box = page.locator(sel).last();
          check("email", `${where}: form is coming-soon @${w}/${m}`, (await box.getAttribute("data-state")) === "coming-soon");
          check("email", `${where}: email input disabled @${w}/${m}`, await box.locator('input[type="email"]').isDisabled());
          const btn = box.getByRole("button", { name: "Get the next post" });
          check("email", `${where}: button disabled @${w}/${m}`, await btn.isDisabled());
          const note = ((await box.locator(".note").textContent()) || "").trim();
          check("email", `${where}: note says sign-up opens soon, points to RSS @${w}/${m}`, /Email sign-up opens soon/.test(note) && (await box.getByRole("link", { name: "RSS feed" }).getAttribute("href")) === "/feed.xml", note);
          // A reader tries anyway: force a click on the disabled button. Nothing must go out.
          await btn.click({ force: true }).catch(() => {});
          await page.waitForTimeout(400);
          check("email", `${where}: forced click sends nothing to Buttondown @${w}/${m}`, !outside.some((u) => u.includes("buttondown")), outside.join(" "));
          check("email", `${where}: page did not navigate @${w}/${m}`, new URL(page.url()).pathname === route);
          if (m === "reduce") {
            const op = await box.evaluate((el) => { let o = 1; for (let n = el; n instanceof HTMLElement; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity); return o; });
            check("email", `${where}: form visible without scrolling under reduce motion @${w}`, op >= 0.99, String(op));
          } else {
            await box.scrollIntoViewIfNeeded();
            await page.waitForTimeout(900);
          }
          await shot(box, `email-coming-soon-${where}-${w}-${m}.png`);
        }
        await ctx.close();
      }
    }
  },
};

const wanted = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(FEATURES);
for (const f of wanted) {
  if (!FEATURES[f]) { check("drive", `unknown feature "${f}"`, false, Object.keys(FEATURES).join(" ")); continue; }
  try { await FEATURES[f](); } catch (e) { check(f, "journey threw", false, String(e).split("\n")[0]); }
}
await browser.close();

const failed = results.filter((r) => !r.ok);
writeFileSync(path.join(OUT, "drive-summary.json"), JSON.stringify({ base: BASE, at: new Date().toISOString(), features: wanted, checks: results.length, failed: failed.length, results, shots: shots.map((s) => path.relative(process.cwd(), s)) }, null, 2));
log(`DRIVE ${failed.length ? "FAILED" : "OK"}: ${results.length - failed.length}/${results.length} checks, ${shots.length} shots`);
process.exit(failed.length ? 1 : 0);
