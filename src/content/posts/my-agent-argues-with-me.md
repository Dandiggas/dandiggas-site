---
title: "My Agent Argues With Me Before It Updates My Worldview"
date: "2026-07-06"
preview: "Summaries pile up and thinking stays still. So I built a pipeline where videos become typed challenges against a beliefs file capped at seven entries, checked for novelty against a knowledge graph, and judged by exactly one person: me."
readTime: "10 min read"
---

[Last post](https://tech.dandiggas.com/posts/ai-agent-first-loop), my agent learned to run while I sleep. This weekend I gave it a more dangerous job: telling me when I'm wrong.

Here's the problem it solves. 500 hours of video hit YouTube every minute, and some slice of it would genuinely change how I work. My response, like everyone's, was a Watch Later graveyard. And when I did watch something, the forgetting curve took about 90% of it within a week. AI summarisers made this worse, not better: they turned videos I didn't watch into notes I didn't reread. The pile grew. My actual operating beliefs, the things that decide what I build and how, stayed exactly where they were.

The realisation that reframed everything: I don't have an information problem. I have a **belief update problem**. Nothing in my stack connected "I ingested something" to "I now operate differently."

## Standing on Karpathy's shoulders, then climbing one rung up

The knowledge half of this is not mine. Andrej Karpathy's [llm-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) describes an LLM-maintained knowledge base: raw sources in, an agent incrementally updates pages, links concepts, flags contradictions, lints for staleness. I implemented it back in May. My version accumulates everything into a knowledge graph: one 85-minute conference video recently became 188 connected concepts across 19 clustered topics, every edge tagged as EXTRACTED, INFERRED, or AMBIGUOUS so I always know what was found versus interpreted.

But here's what I noticed after running it for weeks: a knowledge base that stays current does not mean a mind that does. The wiki knew things I hadn't acted on. It held contradictions I'd never resolved. Knowing is not believing.

So the layer I built this weekend sits on top: **governance for judgment**, not storage for knowledge.

## The beliefs file

At the centre is one markdown file, Operating Paradigm, with hard rules:

**Maximum 7 active beliefs.** If it grows past what I can reread daily, it becomes another pile. New belief in means the weakest one out.

**Every entry needs three parts or it doesn't go in.** The belief. The why, one sentence plus a link to the evidence that earned it. And "do now": two or three checkbox actions I can take this week. No action, no entry. Otherwise it's just opinions.

**Retire, never delete.** Replaced beliefs move to a dated Retired section with one line on why. Six months from now, the list of things I stopped believing, and when, will be the most valuable part of the file.

**The AI proposes. Only I promote.** This rule is the whole point, and I'll come back to it.

## The pipeline

My involvement is one action: I save a video to a designated playlist. Then:

```
save to playlist
      |  07:30 daily sweep
      v
signal triage ---- fluff --> blunt skip, playlist entry deleted
      | signal
      v
transcribe + slide frames
      v
knowledge graph update  (my beliefs file is copied into the corpus
      |                  first, so beliefs are nodes in the graph)
      v
vault note (permanent record)
      v
GATE 1: would this change what I build or do?  -- no --> note only
      | yes, max 3
      v
GATE 2: check against the graph
      |- already known from N sources --> dropped as repetition
      |- novel                        --> filed
      |- conflicts with prior source
         or with belief #N            --> filed WITH the conflict named
      v
Proposed section of the beliefs file  (accumulates all month)
      v  first Sunday, 18:15
monthly review: each proposal + a blunt recommendation
      v
I judge: promote / amend / reject
```

The details that took iteration to get right:

**Proposals are typed.** `NEW:` add a belief. `UPDATE #2:` sharpen an existing one. `RETIRE #3:` this belief may now be stale. The RETIRE type matters most: sources aren't just allowed to add to my thinking, they're allowed to attack it.

**Zero is the normal outcome.** The gate only passes material that would change what I build, do, or how I position myself this month. Most videos should not move your worldview. A pipeline that finds "insight" in everything is a pipeline you learn to ignore. The first live run produced exactly three proposals from a 21-minute talk; plenty of runs produce none, and the system says so plainly.

**The graph is the bs detector.** Because every prior ingest lives in the knowledge graph, and my beliefs live there too, each candidate proposal gets a verdict: novel, already known from three other sources (dropped; a third YouTuber repeating "context engineering matters" is not signal), or in conflict with something specific. Conflicts don't get silently dropped. They arrive with the disagreement named, because a contradiction is either nonsense to reject or evidence the field actually moved, and that call is mine.

**Monthly cadence, with one escape valve.** Early versions nagged me daily about pending proposals. Wrong. Beliefs need runway: the do-now actions are experiments that take weeks. So proposals accumulate silently and get judged in one monthly review, where any belief whose actions went untouched all month also gets named and questioned. Shelf-ware beliefs are lies you tell yourself in markdown. The exception is a rare GAMECHANGER tag for things that can't wait, defined narrowly: it invalidates a live decision about money, work, or security this week.

## Why the human gate is load-bearing

The first version of this could have auto-updated the beliefs file. Ingest, rewrite, done. It would have been worthless, and I got the proof within hours.

The pipeline proposed a belief about auditing my saved prompts for stale workarounds. Reasonable, sourced, well-formed. Also wrong for me, because I have never saved a chat prompt in my life. When I pushed back, the belief got restated in terms of things I actually own: my agent's instruction files, skill definitions, cron prompts. Those are saved prompts; I'd just never called them that. The corrected belief is sharper than either the AI's proposal or my objection.

That friction is the quality control. Every entry in the Active section should have been argued with at least once, by me. An entry that gets nodded through is dead weight I'll skim past forever. This is why the file is mine and not the AI's: the arguing is the point.

One design decision downstream of this: the pipeline writes only to the Proposed section, structurally. It cannot touch Active or Retired. A system that can change your mind should not be allowed to make it up for you.

## The part where it posted about itself

There's a fitting coda. The LinkedIn post announcing this system was itself produced by the system's proof arm: work logged in the vault became a drafted post, the draft was checked for originality against Karpathy's gist before making any claims, and it published only after I replied with an explicit thumbs up.

Even the publishing enforced the philosophy. My LinkedIn tooling refused to post twice, and the root cause turned out to be an anti-bot pacer that gates write actions to human working hours. On a Sunday night it silently slept until Monday instead of saying so. The fix wasn't removing the protection; it was making it honest: a typed error naming the next window, and a deliberate human-set override. Bounded waits, typed refusals, human holds the override. Same governance model, three layers down.

## Steal this

The whole thing is stock components: yt-dlp, whisper running locally on Apple Silicon, an LLM extraction pipeline into a graph, Obsidian as the record, cron jobs, one markdown file as the constitution. Nothing here needs a product.

The three rules are the system: **cap it** (7 beliefs, forced eviction), **action it** (no entry without do-now steps), **gate it** (AI proposes, human promotes, monthly). Karpathy's pattern keeps your knowledge current. This keeps your judgment current. The gap between those two sentences is where the whole build lives.
