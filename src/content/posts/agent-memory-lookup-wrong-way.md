---
title: "I Built My Agent a Memory. The Lookup Was Pointing the Wrong Way."
date: "2026-08-13"
preview: "My agent's memory had a write path and no read path. The check I needed already existed. It just ran at the end of the job instead of the start. An ordering bug wearing the costume of a missing feature."
readTime: "9 min read"
---

An agent I work with was filing notes about a repository I'd asked it to look at. Before writing anything, it searched my notes for the repo's name, a rule I'd added months ago so it would update existing notes instead of piling up duplicates.

The search found a page. I'd written it five weeks earlier. It had already analyzed that same repository, already read its security model, and already framed the exact question I was in the middle of asking.

I had no memory of writing it. I'd just spent half an hour of that afternoon working out something it already said.

My first read was that my notes had failed to remind me of something. That's not what happened, and the real version is more interesting.

## What I'd actually built

The setup is unglamorous and it works. A directory of markdown notes as the durable store. A small index file, capped at about 120 lines, one entry per topic, that gets loaded at the start of every session. A hook that counts messages and nags the agent to write things down every few exchanges. And a background agent that does the writing, under a few rules: search before you write, update facts in place, never append a contradiction.

That's the write loop. I've been running it for a year. The notes are accurate, they're linked, and they're not bloated.

I had quietly assumed that a good write loop implied good recall.

## The lookup existed. It ran too late.

Here's the thing I got wrong for about an hour.

I'd told myself the lookup only fires when a name comes up in conversation, and that's why old pages stay buried. Tidy story. But **the name did come up.** I opened that task by handing over the repository's URL. It was the first thing I said.

The system still didn't look, because the only lookup I had was *search before you write*. It runs when the agent goes to save something. Which is to say: after the work is finished.

So the check wasn't missing. It was pointing the wrong way. It ran at the end of the job as a filing tidiness rule, when the useful place for it was at the start of the job as a "you've been here before" rule. Same notes, same question, opposite ends of the task.

Half an hour isn't a catastrophe. But it's the same half hour every time a subject comes back around, and I have a year of notes.

That reframing matters, because "I need a retrieval system" and "I need to move an existing check earlier" are very different sizes of problem. Mine was an ordering bug wearing the costume of a missing feature.

![Where the lookup sits: before the work, or after it](/blog/blog-retrieval-loop.png)

None of which is a new observation. A write path and a read path is the standard way agent memory gets taught, and "passive retrieval" is an active research problem with papers on it. What those papers assume is embeddings, a vector index, and a learned retrieval policy.

I have a folder of markdown files.

Semantic search is a real option here and it would beat what I built for finding things by meaning. It's also an index to build, keep fresh and debug, and it still can't tell you which of your notes have been abandoned. I wanted something with no moving parts. That ruled out embeddings and left me with grep.

## The reasoning mistake

Once I'd seen it, I split the problem in two:

1. I'm working on something and I've forgotten there's already a page about it.
2. There's a page I've forgotten exists at all.

The first is easy. The second is harder and needs something cleverer.

So I proposed building the first and waiting to see whether the second actually caused me problems. Don't build for a problem you haven't had. Reasonable. It's the same instinct that stops you writing a caching layer before you've measured anything.

It's also completely wrong, and it took one sentence to kill it:

*You won't remember the second kind.*

Forgetting something entirely is **unobservable**. There is no moment where you notice a gap, no error, no failed lookup, nothing to investigate. The failure is that nothing happens. So "wait until it bites" can never fire, because it never bites. It just quietly costs you, forever.

**Any plan that defers a fix until an unobservable failure gets noticed is not a plan.**

The instinct here is the one behind a **dead man's switch**: you can't detect absence by waiting for a signal, so you invert it and treat silence itself as the alarm. Strictly, what I need isn't one. A dead man's switch requires something that keeps checking in, and my notes don't check in. The closer relative is the backup nobody has ever restored. It isn't failing. It has just never been exercised, and nothing is ever going to tell you that. You have to go and look, on a schedule, at a thing that is not complaining. Same shape as the monitor that only alerts on requests that arrive: a total outage looks like a quiet night.

## Fix one, at session start

Three parts, all shell, no model calls, running when a session opens:

**Search the notes for what I'm working on now.** The ticket identifiers I have open, and the name of the directory I'm sitting in.

**Follow one hop of the links out of whatever matched.**

**List the pages nothing links to.** That's the restore-the-backup part. "No inbound links" is a precise signature for a page I've abandoned, and going to look at it on a schedule is the only way I will ever hear about it, because it is never going to raise its hand.

The middle one is the part I'd tell you about at a pub.

I'd been ending every note with a Connections section: a handful of `[[wikilinks]]` to related notes, a line each explaining the relationship. For months. I did it because a rule I wrote told me to, and I thought of it as documentation. Something for a future reader.

**I had a graph and I had never once traversed it at retrieval time.**

Switching that on found 41 neighboring pages sitting exactly one hop from pages I already had open. No new notes. No new writing. Just following links I'd already written and never used.

That's the shape of most good infrastructure wins. Not new capability. Latent capability you've already paid for and never turned on.

## And it wouldn't have caught the thing that started this

I want to be honest about this because it's the most useful part of the story.

Fix one fires at session start, off my open tickets and current directory. The repository that started all this was neither. It arrived mid-conversation, from me, in a message. Session start was hours earlier.

So I built a retrieval system, and it did not cover the case that made me build a retrieval system.

## The question I couldn't answer: when do you look?

This is where I got stuck, and it's the bit worth stealing.

If a subject can enter at any point, something has to decide when to go and check the notes. That felt hard. How do you know a name is a *subject* and not a passing mention? How do you know when it's worth the lookup?

The answer is that you don't decide, because there's nothing to decide. A grep over a local index is under a tenth of a second and costs nothing. **Working out whether to look is more expensive than looking.** So the trigger is every message, unconditionally, no cleverness at all.

Which moves the entire problem somewhere more tractable. The risk was never triggering. The risk is **noise**. Fire on every message, get hits constantly, learn to ignore them, and you've built the orphan list you scroll past. So all of the intelligence goes into the filter, and none of it needs a model:

**Only subject-shaped tokens.** Dotted names, hyphenated names, org/repo pairs, ticket keys, CamelCase. Plain English produces nothing, which is the point: a filter that fires on "database" fires on everything.

**Only tokens that are new this session.** Told once, at first mention, which is exactly when it's useful, before the work. Told again on message forty, it's furniture.

**Rank, don't suppress.** My first cut hid any token matching more than five notes, on the theory that breadth means it's a common word rather than a subject. That is exactly backwards. A repo name appearing in fourteen of my notes isn't noise. It's the best-documented subject I own, and the one where redoing the work costs me the most. The rule was optimising for precision on the assumption that a wide match is a weak match, when in a store you wrote yourself a wide match is the strongest signal in the index. So nothing gets hidden now. It shows the three best matches, floats notes actually *named* after the subject above notes that merely mention it, and prints the total so I can see whether I'm looking at three of three or three of fourteen.

That last one is the mistake I'd most expect someone to repeat, because it doesn't feel like a mistake while you're making it. Filtering feels like craftsmanship. You're removing noise, being disciplined about what earns screen space. But that instinct is calibrated for web search, where a common term genuinely does mean a useless hit. Point it at a corpus you wrote yourself and it inverts: frequency is authorship. **The thing you're tempted to hide as too-common is the thing you most want.**

The result runs on my messages, before I've started anything. Had it existed that morning, it would have printed one line naming the page I'd forgotten, and the afternoon would have gone differently.

## Prove that empty means empty

Twice in one afternoon a search of mine returned nothing because it was broken, not because there was nothing there. Version one of fix one took **64 seconds** and timed out into an empty result. Then, building the per-message lookup, I wrapped a content search in a five-second timeout, and that search takes 7.6 seconds, because my notes live on a mounted drive. There's a third variant sitting in the same place: that drive is reached through a symlink, and the default filesystem search doesn't follow symlinks, so it returns **zero files**, which is indistinguishable from a store with nothing relevant in it. Same output, different universe.

The 7.6 seconds changed the design rather than the code. If a search costs that much it can never run on every message, and shrinking it with a timeout is precisely how you get a silent empty result. So the per-message lookup doesn't search my notes at all. It reads the small subject index built once at session start, and never touches the slow filesystem. The expensive pass happens where it's allowed to be slow.

So: before you believe a query that returned nothing, make it return something. Search for a string you know exists. If that comes back empty too, your query is broken, not your data.

My own notes caught the bug in the thing I was building to search my notes.

## What I don't know yet, and how I'll find out

I built both halves of this in a day. I haven't lived with either, and I'm not going to pretend a day-old tool is validated.

The honest gap is that "41 neighboring pages" is a capability number, not a value number. It proves the traversal works. It says nothing about whether any of the 41 were worth surfacing. So, falsifiably: in four weeks I'll report how many surfaced pages I actually opened and how many changed what I did. If fewer than one in five get opened, one hop is noise and I'll say so. If the abandoned-pages list has become something I scroll past, that's a failed feature and I'll say that too.

There's also a trap I built into my own fix. The link-following part only works while I keep writing Connections sections. If I get lazy, it degrades. Silently, obviously.

## The actual question

If you keep your agent's memory as files, you've almost certainly built the write half. Everyone does. It's the satisfying half: you can watch it capture things, and the artifacts pile up where you can see them.

So ask the other question. **What triggers a read, and does it fire before the work or after it?**

Mine fired after. For a year. It was still filing beautifully.

And the cheapest upgrade is probably already sitting in your notes, in the form of links you've written and never followed. You already paid for it.
