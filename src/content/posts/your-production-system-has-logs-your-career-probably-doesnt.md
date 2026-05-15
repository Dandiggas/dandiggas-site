---
title: "Your Production System Has Logs. Your Career Probably Doesn’t."
date: "2026-05-15"
preview: "Engineering work leaves traces everywhere: Jira, GitHub, Slack, incidents, notes. Career observability is about connecting them before performance review season turns you into an archaeologist."
readTime: "10 min read"
---

## The problem

Most engineers are doing more valuable work than they can actually explain.

Not because they’re bad communicators. Although, yes, some of us do use “it depends” as a full personality.

The real problem is that engineering work is fragmented.

Your delivery history lives in Jira. Your implementation history lives in GitHub. Your actual thinking lives somewhere between Slack threads, architecture discussions, debugging sessions, production incidents, code review comments, meeting notes, half-written docs, and that one note you definitely wrote somewhere but will never find again.

Then performance review season arrives and someone asks:

“What impact did you have over the last six months?”

And suddenly you’re an archaeologist.

You search your merged PRs. You scan Jira. You remember a production issue but not the exact date. You remember helping someone debug something important, but there’s no ticket for it. You know you influenced a design decision, but the evidence is buried in a thread called “quick question”.

The final self-review ends up saying something like:

“Worked on platform improvements and supported incidents.”

Which might technically be true, but it undersells the work so badly it should come with an apology.

What actually happened might be:

“I investigated recurring failures in the payments worker, traced them to a race condition between retries and webhook processing, shipped a safer idempotency fix, added regression coverage, improved the incident runbook, and helped support understand which customer states were safe to retry.”

Same work. Completely different story.

The annoying part is that the second version is not marketing fluff. It is just the truth with context.

The problem is that context leaks out of engineering work constantly.

## The idea

In software, we solved a version of this problem with observability.

If a system is misbehaving, we don’t sit around trying to remember what the API did last Tuesday. We look at logs, traces, metrics, deployments, errors, dashboards, incident timelines.

A service gets full observability.

An engineer gets “please complete your self-review by Friday”.

Seems fair.

So I started thinking about “career observability”.

Not in the grim HR surveillance sense. I do not want a dashboard that ranks engineers by commit count. That way lies madness, performative productivity, and someone renaming variables just to stay competitive.

I mean observability for the engineer themselves.

A way to understand your actual work over time:

- what you built
- what you debugged
- what decisions you influenced
- what incidents you handled
- what context you discovered
- what technical debt you reduced
- what invisible support work you did
- what themes kept showing up

The point is not to turn engineering into personal analytics nonsense.

The point is to stop losing the story of the work.

## The workflow

The setup I’ve been experimenting with is simple in concept:

Claude Code connects to:

- Jira tickets
- GitHub commits
- an Obsidian knowledge graph

I’ve been testing this with my own project notes and coding sessions rather than trying to turn it into a polished SaaS product. Mostly because I wanted to see if the idea was actually useful before doing the usual developer thing of accidentally building a platform.

When a coding session starts, it checks the current working context automatically.

It looks at assigned tickets. It checks recent commits. It pulls previous notes from Obsidian. It tries to understand what I was doing before I asked it anything.

That part matters.

Most AI coding sessions start cold. You open the tool and spend the first few prompts explaining the same background again:

“We’re working on the billing service.”
“This ticket relates to failed webhook retries.”
“The previous fix was reverted.”
“No, don’t touch that file, it’s cursed.”
“Yes, I know it looks wrong. It is load-bearing wrong.”

With the memory loop, Claude starts with more context.

Every few prompts, when something useful happens, important information gets persisted back into Obsidian.

Not everything. I don’t need a permanent knowledge graph entry for “hmm”. If every thought becomes a note, you haven’t built memory, you’ve built a landfill.

The things worth saving are usually the things future me will forget:

- why a technical decision was made
- what debugging paths were already tried
- what the root cause turned out to be
- what trade-offs were accepted
- which files and systems were involved
- what follow-up work was created
- what risks remain

Over time, this creates a graph of actual engineering work.

Tickets connect to commits.
Commits connect to debugging sessions.
Debugging sessions connect to architecture decisions.
Architecture decisions connect to incidents.
Incidents connect to lessons learned.

That means when it’s time to write a self-review, promotion packet, project summary, or impact document, the AI can generate a first draft from real work history rather than memory alone.

Not “make me sound impressive”.

More like:

“Look at my work over the last quarter. Group it into themes. Show me what changed. Pull evidence from tickets, commits, and notes. Tell me what I’m forgetting.”

That is a much better starting point than staring at a blank document wondering whether “helped with stuff” counts as career progression.

## Why ticket count doesn’t work

The worst version of engineering measurement is ticket count.

It’s easy to count, which is exactly why people reach for it. Unfortunately, lots of stupid things are easy to count. Number of Slack messages sent. Number of meetings attended. Number of times someone says “alignment”.

Ticket count has the same problem.

One ticket might be:

- change button copy
- add one config value
- fix a typo

Another ticket might be:

- untangle a production incident
- migrate a fragile workflow
- prevent duplicate payments
- redesign an API boundary
- remove a class of future bugs

Both are one ticket.

The count is the same. The impact is not.

Some of the most valuable engineering work does not produce a satisfying ticket at all.

You might prevent a bad architecture decision. You might mentor someone through a difficult part of the system. You might write the runbook that makes the next incident easier. You might delete a feature idea before it becomes six months of regret.

That work is real. It often protects the business from future pain.

But it is hard to measure because nothing exploded.

Prevented problems are always awkward to explain. “You’re welcome, this outage never happened” is not a sentence that fits neatly into Jira.

## Visible work vs invisible work

Visible work is easy to recognise.

A feature shipped.
A pull request merged.
A dashboard went live.
A demo happened.
A stakeholder said “nice”.

Invisible work is different.

It looks like:

- reading a vague bug report and turning it into a reproducible case
- explaining why the obvious implementation is dangerous
- improving test coverage around a fragile path
- helping another engineer understand an old system
- finding the real root cause instead of treating the symptom
- writing down context that was previously trapped in someone’s head
- making a system less surprising

This is where a memory system helps. It catches the connective tissue.

A single commit says:

“Add idempotency guard.”

The memory graph says:

“This was part of a reliability effort after two payment retry incidents. The guard was added after investigation showed duplicate webhook delivery could create conflicting state transitions. The change was paired with regression tests and an updated support runbook.”

That is the useful version.

The diff tells you what changed.

The memory tells you why it mattered.

## The build

The basic workflow looks like this:

1. Start a Claude Code session
2. Pull current Jira tickets
3. Pull recent GitHub commits and PRs
4. Search Obsidian for related notes
5. Work on the task
6. Persist useful context back into Obsidian every few prompts
7. Build a graph of tickets, commits, decisions, incidents, and debugging notes
8. Use that graph later to generate impact summaries

The Obsidian part is important because I don’t want all of this trapped inside an AI tool.

Obsidian gives the memory a home. It’s searchable. It’s editable. It’s mine. If the AI writes something wrong, I can correct it. If a note becomes important, I can expand it. If something is nonsense, I can delete it with the quiet satisfaction of removing bad documentation from the world.

The AI is not the source of truth.

It just helps me keep the source of truth up to date.

That distinction matters.

## What I learned

### Engineers undersell themselves because they forget the middle

Most self-reviews focus on outcomes.

“I shipped X.”
“I completed Y.”
“I improved Z.”

But engineering impact often lives in the middle of the story.

The false starts. The investigation. The decision not to do something. The trade-off. The weird edge case. The moment where understanding changed.

That middle is where seniority shows up.

A junior engineer and senior engineer might both close the same ticket. The difference is often in how they got there, what risks they saw, what context they preserved, and how much future pain they removed.

If you don’t capture that, you flatten your own work.

### AI summaries are useful, but they need supervision

AI is very good at turning messy notes into a coherent summary.

It is also very good at sounding confident while being wrong. This is, unfortunately, one of its core competencies.

So I would not blindly trust an AI-generated self-review.

It can overstate your role. It can miss nuance. It can turn normal work into heroic nonsense. It can use phrases like “drove cross-functional alignment”, at which point you should probably close the laptop and go for a walk.

The right workflow is review-first.

Ask the AI for a draft. Then check it against reality.

Did I actually lead that?
Was this really business impact, or just technical cleanup?
Would my manager recognise this?
Is there evidence?
Am I accidentally making myself sound like a LinkedIn founder who just discovered databases?

The AI helps you remember. You still need judgment.

### The memory loop is only useful if it stays lightweight

If saving context becomes a chore, it dies.

Engineers already have enough admin. Nobody wants to finish debugging an outage and then write a five-paragraph reflection like they’re doing GCSE coursework.

The useful version is lightweight.

Every few prompts, the AI asks or infers:

“Is this worth saving?”

Then it writes a concise note:

- what happened
- why it mattered
- what changed
- what to remember next time

That’s enough.

The point is not perfect documentation. The point is durable context.

## The risk

There is a bad version of this idea.

A company could take career observability and turn it into surveillance.

“Your impact graph shows fewer architecture nodes this quarter.”
“Your mentoring centrality score is down 12%.”
“Our AI has ranked your pull request influence as ‘moderate’.”

Absolutely not.

That is how you get engineers performing for the system instead of doing useful work.

The best version of career observability is personal first. It belongs to the engineer. It helps them understand and communicate their own work. It can support managers, but it should not become a secret scoring engine.

If people feel watched, they will game it.

And engineers are very good at gaming systems. We literally automate things for a living.

## What’s next

I think this gets interesting when the knowledge graph becomes part of the normal engineering workflow.

Not just for reviews, but for daily work.

Imagine starting a task and immediately seeing:

- related incidents
- previous attempts
- relevant architecture notes
- risky files
- past decisions
- people who touched the area recently
- unresolved questions

That would save real time.

It would also make teams less dependent on memory and folklore.

Every codebase has folklore. “Don’t touch that service on Fridays.” “That field is nullable for historical reasons.” “The old migration failed but nobody remembers why.” “Ask Priya, she knows.” Poor Priya.

This is where career observability starts to overlap with technical observability.

The same notes that help you explain your impact can also help you do better work. They give continuity. They reduce repeated investigation. They help engineers build on their own history instead of rediscovering it every quarter.

## Final thought

I don’t think AI should write your self-review for you.

That sounds convenient, but it misses the point.

You should understand your own work deeply. You should know what mattered, what didn’t, what you learned, what you would do differently, and where you actually created value.

But AI can help you remember.

It can gather the fragments. It can surface patterns. It can connect the ticket to the commit, the commit to the incident, the incident to the decision, and the decision to the business impact.

That is useful.

Engineering careers are not just a list of shipped tickets. They are a long chain of decisions, trade-offs, fixes, failures, recoveries, and bits of invisible work that compound over time.

Those things deserve a trace.

And when someone asks what impact you had over the last six months, you should not have to answer from vibes.
