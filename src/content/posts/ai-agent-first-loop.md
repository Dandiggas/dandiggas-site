---
title: "My AI Agent Waited for Me to Start It. Now One Part Runs While I Sleep."
date: "2026-07-04"
preview: "I had memory, budgets, and guardrails, and I was still the one pressing go. Climbing from harness to loop turned out to be one timer, one snapshot file, and knowing which celebrated pattern to skip."
readTime: "9 min read"
---

Two posts ago I [built a memory layer](https://tech.dandiggas.com/posts/ai-agent-memory-layer) for my AI coding assistant. Last post I [put that memory on a budget](https://tech.dandiggas.com/posts/ai-agent-context-budget) when it got fat and started eating the window it was meant to protect.

Both of those posts share a hidden assumption I didn't notice until someone named it for me: **I was still the one at the keyboard.** I typed a thing, read what came back, typed the next thing. The memory made me faster at that loop. It didn't change that I *was* the loop.

Then I read a working note on something called "loop engineering" and it reframed the whole thing. The idea, in one line: you stop prompting the agent and start designing the system that prompts it. Generation gets cheap enough that the scarce resource isn't the model's output anymore — it's your judgment about what runs, when, and how you'd know if it went wrong.

The uncomfortable part was realizing I'd been doing this by accident for months and getting the important half wrong. This is the post about doing it on purpose.

---

## The four-layer ladder

The note lays out a ladder, and the useful move is figuring out which rung you're standing on. Each layer minds something one size bigger than the one below it:

- **Prompt** — the words you write for one message. Minds: what do I say?
- **Context** — what's in the window right now. Minds: what to load, summarize, clear?
- **Harness** — arming a single run: which tools, which actions, and *what counts as done*.
- **Loop** — scheduling the harness so it runs itself, over and over, without you pressing go.

[I drew the ladder out as a diagram here](https://excalidraw.com/#json=nnN6imi5iDv8OlhVlyto_,XRx2_-uVtr6cY5sIIonQlA) if you want the one-glance version, including where mistakes get caught at each layer.

They stack; they don't replace each other. And **figuring out which rung you're standing on is the whole exercise** — because the fix you need lives one rung up from where you are. My "context is a budget" work was all **context-layer**. The batch of guardrails I'd bolted on since — scripts that block the assistant from claiming a bug is fixed without evidence, or force a confirm before a destructive git command — those were **harness-layer**. They define "what counts as done" for a single run.

What I was missing was the top rung. Everything I'd built still waited for me to open a session and start it. The one verb I didn't have was *runs on a timer*.

---

## What actually separates a loop from a harness

Three verbs, per the note, and they're a good checklist:

1. **Runs on a timer** — wakes on a schedule, no button-press.
2. **Spawns helpers** — splits work across sub-agents, ideally a maker and a separate checker.
3. **Feeds itself** — its output becomes its next input. Yesterday's findings get written to a file; this morning it reads that file back. That on-disk memory across runs is *why it's a loop and not just a task you happen to run a lot.*

I already had two of the three. When I do a big analysis I fan work out to sub-agents (spawns helpers). My memory system writes state to disk that the next session reads (feeds itself). The gap was purely the timer. Which is a small delta — and also exactly the delta that turns a thing you operate into a thing that operates itself.

---

## The blocker that turned out not to be one

Here's where I nearly talked myself out of it. My agent runs on a cloud model provider that hands out short-lived credentials — I paste fresh keys at the start of each session. A loop that "runs while I'm asleep" seemed dead on arrival: no session open, no keys pasted, no model access.

I sat with that for a bit before I saw the split. **The loop doesn't need the model.**

Think about what a morning triage actually *is*: pull my open tickets, pull the pull requests waiting on my review, pull my own open PRs. Every one of those is a plain API call — the ticket system's REST endpoint and my repo host's command-line client. None of it is reasoning. None of it needs an LLM at all. The model only earns its keep on the *thinking* — summarizing, deciding what matters — and that can happen later, in a session, where I'm already authenticated.

So I split it clean:

- **The loop is a dumb cron script.** REST calls only. Zero model tokens. Runs unattended at 7:30 on weekdays. Writes a markdown file to disk.
- **The intelligence stays in-session.** When I sit down, the agent reads that pre-built file instead of going and fetching everything live. The expensive discovery already happened — for free, while I was asleep.

This is an old instinct dressed in new language: don't put a model where an API call does the job. The credential wall only exists if you insist the loop must think. Most of what I wanted from a morning loop wasn't thinking. It was fetching.

---

## The part I deliberately left out

The note is emphatic about one pattern: separate the maker from the checker. Empirically, an agent asked to grade its own work praises it — "the model that wrote the code is too nice grading its own homework." So you split off an independent, skeptical evaluator, because tuning a critic is more tractable than making a generator self-critical.

I believe it. I'd watched it happen the same week: a verification pass I ran over a batch of findings killed a third of them, and two of the ones it cut were findings an earlier, hastier pass had reported with confidence.

And then I built my triage loop with *no* checker. On purpose.

Because the reason a checker exists is to catch a *model* flattering itself. My triage "maker" isn't a model — it's a REST call. The ticket API doesn't hallucinate tickets; the CLI doesn't invent pull requests. The data is ground truth by construction. **A checker earns its place against a maker that can lie — not against a REST call that can't.** Bolting a verifier onto a loop with nothing to flatter would've been pure cargo cult — the ceremony of the pattern with none of the reason.

That's the whole game, I think. The note's close amounts to this: designing the loop *with judgment* is the cure, and designing it *to avoid thinking* is the accelerant — same act, opposite outcomes. Knowing when to *skip* the celebrated pattern is the judgment half. The checker earns its place the day I let a model draft my review comments. Not before.

---

## Feeds itself, and fails loud

Two small properties made the difference between a script and a loop.

**Feeds itself.** The script keeps a tiny snapshot of what it saw last run. This morning's file marks with a star anything that's *new* since yesterday. That's the difference between opening a file that says "you have 15 PRs to review" every single day — which you'd learn to ignore by Wednesday — and one that says "one of these is new since yesterday." The loop reading its own past output is what makes the signal survive.

**Fails loud.** The failure mode I was most afraid of isn't a crash — it's a *silent* one. If the ticket query quietly fails, a naive script writes an empty file, and an empty triage inbox reads exactly like "nothing's waiting on you." That's the worst possible lie for this tool to tell. So a failed query writes a visible warning line into the file instead of nothing. A loop that runs unattended is also a loop that *fails* unattended, so its failures have to be loud enough to survive the gap until someone looks.

That second one connects to the idea in the note that stuck with me most, which is about where mistakes hide.

---

## Why unattended things are scarier than they look

The note's sharpest point is about blast radius. Take the same mistake — a wrong assumption — and watch how its cost changes as you climb the ladder:

- At the **prompt** layer, a wrong assumption gives you one bad answer. You see it immediately and rephrase.
- At the **context** layer, it's a stale doc in the window; the answer comes back confidently wrong and you clear the context.
- At the **harness** layer, the agent acts on it once — but the run ends, the diff is right there, and you review it before anything ships.
- At the **loop** layer, the wrong assumption gets written to the state file, read back the next morning as established fact, and built on across days. By the time anyone looks, it's load-bearing.

The cost of a mistake scales with how many turns it survives before someone catches it. And a loop is, by construction, a machine for maximizing turns. That's not an argument against loops — it's an argument for why every serious piece of loop machinery (the independent checker, the human checkpoint, the spend cap) exists to do one thing: **shorten the distance between a mistake and its discovery.**

Which recasts all those guardrails I'd built at the harness layer. I'd thought of them as hygiene. They're not. They're loop-safety, built before I had a loop — every one of them shrinks mistake-to-discovery distance. It turns out I'd been laying the foundation for the top rung while I was still standing on the one below it. And this week that safety net caught its own maker: two of those guardrails false-fired on my own writing, I saw it in one turn, and tightened them. One-turn discovery. That's what the net is for.

---

## The costs that accrue while you're not looking

The note names four ways a loop bills you quietly, and all four are worth keeping on a card:

1. **Verification debt** — a loop running unattended is a loop making mistakes unattended. The checking is still your job; you've just moved it, not removed it.
2. **Comprehension rot** — the faster the loop ships things you didn't write, the wider the gap between what exists and what you understand. This one scares me most, because it's invisible until the day you have to explain a system you nominally own and can't.
3. **Cognitive surrender** — when the thing runs itself, it's tempting to stop having an opinion and just accept what it produces.
4. **Token blowout** — sub-agents multiply spend, and a loop on a timer multiplies it *while you're asleep.* This is the one that made me put the discovery on a free REST cron instead of a model, and it's why any loop I build next will carry a spend cap as part of its definition of done.

---

## Why this matters beyond my setup

The first post was about making context persist. The second was the invoice for letting it grow unmanaged. This one is about what happens when you climb off the bottom rung entirely — when you stop being the thing in the loop and start being the person who designs it.

None of the specifics transfer, and they're not supposed to. You don't need my cron job, my ticket system, or my credential setup. What transfers is the shape of the thinking: figure out which rung you're on; know that the only thing separating "a script you run" from "a loop that runs itself" is a timer, a snapshot it reads back, and the discipline to fail loud; don't put a model where an API call will do; and never add a verifier to a maker that can't lie — the pattern without its reason is just ceremony.

And the warning I'd tattoo on it if I could: **build the loop like someone who intends to stay the engineer, not just the person who presses go.** The loop is only as good as the judgment you put into designing it — and the moment you're designing it to avoid thinking rather than to think better, you've handed over the one thing that was actually yours.

I built my first real loop this week. It does something almost trivially small: it hands me a triage list every morning before I sit down. But it's the first thing in my setup that works while I'm not there — and the interesting part wasn't the automation. It was discovering how much of "staying the engineer" comes down to knowing which safety nets to build *before* you need them.
