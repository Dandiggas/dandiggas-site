---
title: "My Sessions Are the Traces: Error Analysis on My Own AI Agents"
date: "2026-10-27"
preview: "Chapter 3 of Evals for AI Engineers says to read traces end to end, mark the first failing step, and group the notes only after 20 of them. I work with coding agents all day, so I built that into the dashboard I already use. Here is the page, the first mark, and the plan."
readTime: "6 min read"
---

I read chapter 3 of Evals for AI Engineers (O'Reilly, by Shreya Shankar and Hamel Husain) and realised I already had the dataset the chapter asks for. I work with coding agents all day: Claude Code, Codex, Hermes and Antigravity. Every session is a trace (the full ordered record of what I typed, every tool call, what came back, and what the agent said).

![The cover of Evals for AI Engineers by Shreya Shankar and Hamel Husain.](/blog/error-analysis/evals-for-ai-engineers-cover.png)

## What the chapter asks for

The chapter is called Error Analysis. It is the Analyze step of the book's Analyze, Measure, Improve loop. Its rules, in plain words:

1. Start from real traces, not from metrics. Production logs are preferred when you have them.
2. Read each trace end to end. Write one short free-form note about the first step where it went wrong. The book calls this open coding (a term from qualitative research).
3. Give each trace a yes or no verdict: acceptable or not. No scores out of 5.
4. Keep going until you have at least 20 problematic traces and new failure types have stopped appearing.
5. Only then group the notes into failure types. The book calls this axial coding.
6. Do not ask a model to invent the failure types from scratch. It will give you generic ones (hallucination, instruction following, tone) and miss the ones specific to your system.
7. Count how often each type appears, fix the top ones, and read again.

The sentence that stuck: an individual step can look fine in isolation and still lead to a wrong result, so you evaluate traces, not steps.

## What I built

Agent Estate is the local dashboard I use to watch my agents. On 23 October I added a Conversations page. It reads the recorded sessions from all four agent apps: last 14 days, up to 200 per app. When I took the screenshot below it held 431 sessions. For each one it shows every recorded step in order: my words as "You", each tool call with what it was asked and what came back, and each reply. The model's private reasoning is not recorded, so it is not there.

On 24 October I added the error analysis part. Every step has one button: "Mark this step as the failure". It takes one short note. Every mark lands in a Failures list on the same page, with the time, the agent app, a link to the conversation, the step, the note and the verdict. The verdict per conversation is Acceptable or Not acceptable. The list downloads as CSV.

![The Conversations page with one step marked as the failure and the note under it.](/blog/error-analysis/conversations-marked-step.png)

![The Failures list: one row per marked step, with a CSV download.](/blog/error-analysis/failures-list.png)

## The first thing it found was in the list itself

Before I had marked anything, the list was wrong. 193 of the 200 newest Claude Code rows showed as "Untitled conversation". The cause was my own dashboard. Its usage strip runs a usage check (`claude -p "/usage"`) every 10 minutes, and each run writes a throwaway session file. There were 1,893 of them, and they had taken the 200 newest slots. Now a session with no words from me is skipped before the cap. Result: 117 real Claude sessions named, 3 untitled across all apps, down from 204.

That is the book's point about representative data, found the hard way. If the sample is wrong, the reading is wrong before it starts.

## The first real mark

The first failure I marked was from 26 October. An agent building a metronome app said it was done before it had looked at the result. A stop hook (a check that runs when the agent tries to finish) had to force the screenshot. My note, as written: "Said the metronome was done before looking at it. The stop hook had to force the screenshot."

No category yet. The book is clear on that: at this stage you collect notes in your own words, you do not sort them.

## The plan, applied to my own workflows

My agents are not a product with users. They are how I work. So the failure types I find are failures in my own workflows: how I brief, what I let an agent claim, what I check. The method is the same.

1. Mark the first failing step in every session I read, until there are 20 marks.
2. Group the notes by hand into failure types. Count them.
3. Turn the top types into things that cannot be ignored: a code guard, a skill, a rule in my agents' operating contract. Not another paragraph in a rules file. I wrote about why text rules do not hold last week.
4. Read again, and see which counts drop.

I already have one number to beat. On 24 October I had a cheap model label 819 messages from before a rule change and 900 after. Agents that confirm the plan before starting get corrected about half as often: 7% of my messages versus 13%. That is the kind of count the Failures list should produce for every failure type, not just the one I happened to measure.

## What is not proven yet

- One mark so far. The method needs 20 before any grouping means anything.
- The counts will be mine, on my own sessions. They say nothing about anyone else's agents.
- The verdict column is empty on the first mark. I have to go back and set it.

The chapter is online at O'Reilly: [Chapter 3, Error Analysis](https://www.oreilly.com/library/view/evals-for-ai/9798341660717/ch03.html). The book's site is [ai-evals.com](https://ai-evals.com/).
