---
title: "I Gave My AI Agent a Memory. Then It Started Choking on It."
date: "2026-06-10"
preview: "The follow-up to the memory-layer post. Persistent context worked too well: session start was burning 30-40K tokens before I typed a word. Four fixes — context is a budget, not a bucket."
readTime: "7 min read"
---

Two months ago I wrote about [building a memory layer for my AI coding assistant](https://tech.dandiggas.com/posts/ai-agent-memory-layer). The idea was simple: load the useful context automatically at the start of a session so I do not have to explain the same project, open PRs, service boundaries, or team workflows every time I sit down.

It worked.

The closing line of that post was "make context compound instead of evaporate."

Good line. Slightly dangerous.

Six weeks later, context had compounded a bit too well. The system I built to save context had become one of the biggest things spending it. The session-start routine was burning 30-40K tokens before I had typed a single word.

This is the follow-up. Less "look what I built", more "look what broke, and what I had to change."

The lesson that reframed it: context is a budget, not a bucket.

Once I started treating it that way, four fixes fell out.

---

## The bloat problem nobody warns you about

My memory system has an always-loaded index. It is one file injected into the prompt at the start of every session. Current work, open tickets, team notes, tooling, references. It acts like a table of contents before I ask for anything.

That always-loaded part is exactly where the trap lives.

Every line in that index becomes a tax on every future session. A note I wrote in April about a now-merged PR does not just sit there harmlessly. It costs tokens today, tomorrow, and every session after that, whether it matters or not.

Append-only memory feels free when you add the line. It is not free when you read it forever.

The second problem was worse: the index started contradicting itself. If I corrected a finding, I would add a new line saying "actually it is X" without removing the old line saying "it is Y." Over time the file picked up little archaeological layers: a fact, a correction, a warning not to trust the earlier fact, and sometimes another correction after that.

The index was supposed to be the thing I could trust at a glance. Instead it became something I had to debug.

Two failure modes, one root cause: I was treating an always-loaded file like infinite scratch space.

It is not. It is the most expensive real estate in the system, because I pay for it on every session.

---

## Fix 1: prune the index before loading anything else

The first fix was not glamorous, but it helped immediately.

I added a hard gate. The index gets checked before the session-start routine loads anything else. If it has grown past roughly 120 lines, or if it has been more than 14 days since the last cleanup, the routine flags it for pruning.

```bash
lines=$(wc -l < "$INDEX")

if [ -f "$stamp" ]; then
  days=$(( ( $(date +%s) - $(date -r "$stamp" +%s) ) / 86400 ))
else
  days=999
fi

echo "index: ${lines} lines, ${days}d since last prune"

if [ "$lines" -gt 120 ] || [ "$days" -gt 14 ]; then
  echo "PRUNE_DUE=1"
else
  echo "PRUNE_DUE=0"
fi
```

A healthy run looks boring:

```text
index: 94 lines, 1d since last prune
PRUNE_DUE=0
```

When the gate trips, pruning does not mean deleting the detail. It means collapsing and relocating it.

A chunky block in the index becomes one pointer line:

```text
- [Sprint rollover notes](sprint-rollover.md) - current rule and latest status
```

The detail moves into a topic file that only loads when needed. Finished work moves to an archive file that never loads at session start. Retraction trails move out of the index and into the relevant topic note.

The rule is simple: the always-loaded index carries current truth only.

What is true now belongs in the index. Why it changed belongs somewhere you only pay for when you ask.

That split made the file useful again.

---

## Fix 2: put the expensive read in a disposable window

Session-start used to pull in heavy stuff inline:

- git logs across multiple repos
- open PRs and pipeline runs
- project-board tickets and comments
- working notes
- the big service note for the thing I was working on

That service note alone can run past 15K tokens. Read all of it inside the main context window and you have already spent a huge chunk of the session before the actual work starts.

The fix was obvious once I stopped thinking of the main window as the only place reading could happen.

A subagent has its own context window. So the expensive read can happen somewhere disposable.

Now session-start fans out three read-only reader lanes:

- repos lane: git activity, open PRs, pipeline runs
- board lane: assigned tickets and comments that need a reply
- docs lane: big service notes, recent design docs, working notes

Each lane reads the heavy blob in its own window, summarizes it down to a few lines plus a pointer, and returns only that to the main agent.

The 30-40K token read still happens. It just happens in windows I throw away after the summary comes back.

My main context receives signal instead of raw payload.

![Session-start fan-out: the main context window dispatches three read-only lanes. Each lane reads its heavy blob in its own window and returns a short summary plus a pointer. The main agent fans in, synthesizes what is waiting, and serializes all writes.](/blog/context-budget-fanout.png)

There is a risk here. Summaries are lossy.

I hit that once when the docs lane skimmed past an in-flight schema change because it did not look important in isolation. That is why every returned summary line carries a pointer back to the source. If a summary feels thin, the full file is one read away.

The point is not to make the heavy context disappear. The point is to stop paying for it up front on every session.

There is also a concurrency trap.

If three agents can all write to the same memory files at the same time, the system gets messy fast. So the rule is strict: reader lanes never write. They read, summarize, and propose. Every real write goes back through the main agent after the lanes report in.

Fan out the reads. Single-thread the writes.

The reads are where the cost is. The writes are where the danger is.

---

## Fix 3: match the model to the job

Once the work was split into lanes, the next problem was obvious.

Do all three lanes need the same model?

No.

Two of the lanes are mostly mechanical. Scrape a board. Summarize a git log. List which pipelines ran. That is not deep reasoning. It is pattern matching with a bit of cleanup, so those lanes run on the cheapest fast model I trust for the job.

The docs lane is different. Deciding what matters in a long service note is a judgment call, so it gets a stronger model.

None of the lanes get the most expensive model. That one is reserved for the actual reasoning I came to do, not for reading a status page.

You do not need frontier inference to tell you which PRs are open.

This cut the cost of session-start without making the output worse, because most of the work never needed the expensive model in the first place.

---

## Fix 4: version the prompt like code

This is the fix that made the others safe.

The session-start routine lives in an instruction file. It defines what loads, when to prune, which lanes fan out, and what gets written back.

For months I edited it in place.

Change a line. Hope it feels better. Move on.

That is fine while a prompt is a prompt. It is not fine once the prompt is load-bearing infrastructure.

So I started treating the file like code. It now has:

- a version number in the header
- a changelog at the bottom
- a tagged baseline in git
- a semver policy for behavioural changes

The policy is simple:

- MAJOR: a phase is added or removed, or a behavioural rule is reversed
- MINOR: a new step is added inside an existing phase
- PATCH: wording and clarity only

The fan-out work became a reviewable progression instead of a vague pile of edits:

```text
v1.0.0  capture the current routine as a versioned baseline
v1.1.0  add the three-lane reader fan-out and single-threaded fan-in
v1.2.0  add boundary-triggered sprint rollover
```

The file grew from 394 lines to 520 during that work. Before versioning, I would not even have known that number.

That is the point.

The moment a prompt controls behaviour, "I'll just tweak it" is not a process. A version number and changelog turn "it feels worse lately" into a diff you can actually inspect.

There is a funny recursion here too. At 520 lines, the instruction file is now close to the kind of size that triggers pruning everywhere else. Eventually the rules will fire on the file that defines the rules.

The prompt will have to prune its own prompt.

That is when I know the rule is real and not just special pleading for one file.

---

## Bonus fix: trigger on the boundary, not the date

One more small pattern came out of this.

My session-start routine used to refresh the sprint-tracking file based on time. If it had been about two weeks, roll over.

That was always a bit fake. Date heuristics drift. They fire early, late, or on the wrong day.

The better signal was sitting in the source system: the sprint id.

Now the routine compares the active sprint id against the id recorded in the file. Same id, same sprint, do nothing. Different id, the sprint rolled. Archive the old file, start a fresh one, and pull forward anything unfinished.

The broader rule: detect state changes by watching the thing that actually changes, not a proxy that usually correlates with it.

A readable boundary beats a timer you have to tune.

---

## Why this matters beyond my setup

The first post was about making context persist. This one is the invoice.

Persistent memory is useful, but it has a cost. If you never manage that cost, the memory layer eventually eats the window it was built to protect.

The specific tools do not matter much. You do not need my memory format, my subagents, or my model tiers.

The transferable pattern is this:

- keep the always-loaded surface small
- store current truth in the index and history elsewhere
- put heavy reads in disposable windows
- return summaries with pointers, not raw blobs
- match the model to the judgment required
- fan out reads, single-thread writes
- version load-bearing prompts like code
- trigger workflow changes from real boundaries, not date guesses

The system I have now is leaner, cheaper, and easier to reason about than the one I had six weeks ago.

The part I did not expect is that the rules are now general enough to apply to the system that defines them.

The prompt is big enough to trip its own prune gate.

That is annoying.

It is also probably a good sign.
