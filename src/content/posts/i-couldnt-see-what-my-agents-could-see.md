---
title: "I Couldn't See What My Agents Could See"
date: "2026-08-14"
preview: "I use AI agents across three different harnesses every day, and for months I had no idea which of them knew what. So I built myself a control panel. This is how it got birthed, and why observability of your own setup is a different problem from observability of your outputs."
readTime: "5 min read"
video: "/blog/agent-estate-walkthrough.mp4"
videoPoster: "/blog/agent-estate-walkthrough-poster.jpg"
videoCaption: "A walk through the Agent Estate: every harness, skill, memory note and eval on my machine in one view."
---

I use large language models a lot. Not for one product, not at work. On my own machine, for my daily life. Music admin, job applications, coding practice, content, email. Over time those uses hardened into consistent workflows, and the workflows got packaged into skills, which are little instruction files an agent loads so it does a task my way instead of its way.

Then one day I tried to answer a simple question: what does my setup actually know how to do?

I couldn't.

Here is the state I was actually in, written down honestly:

I didn't know what a given skill looked like without digging through folders to find it. I didn't know what my tools looked like, or what they were doing under the hood. I knew what they would achieve for me, but not how. I didn't know which skill was available to which harness, by which I mean the different agent environments I run, like Claude Code, Codex and Hermes. I didn't know whether Codex had context of a skill that Claude had context of. I didn't know what system prompt my agents were carrying, or what was going into context before I even said a word. I couldn't look back at any traces. And I couldn't evaluate anything, because you cannot evaluate what you cannot see.

None of this was a production system. There was no customer, no uptime dashboard, no on-call. It was just my machine. Which is exactly why nothing existed for it. The whole observability industry watches what your model did: the traces, the logs, the costs. Nothing watches what your setup has.

## The terminal was technically enough, and that wasn't enough

The honest objection is that the information was all there. I could list skills in the terminal. I could open the config files. I could grep.

But listing is not seeing. If I wanted to know what one skill actually was, that was a path to find, a file to open, and then the same again for the next harness to check whether it also had it. Every question was a small scavenger hunt, and the cost of the hunt meant I mostly didn't ask. I lived with a growing library of capabilities I could not survey. Skills piled up that I never used. Skills I used daily were invisible as a pattern.

I like living in a terminal. This is not a terminal-versus-UI argument. It is a "some questions need a surface" argument. A library you cannot browse is a warehouse, not a library.

## So I got my agent to build the thing I wanted to look at

The dashboard is called Agent Estate. It runs locally, reads the actual config of each harness on my machine, and shows me the estate as one picture. The part I recorded a video about today is the skills view.

One click on a skill now answers three questions at once: what the skill is, which harnesses have it in context, and how often I have actually used it over time. The same view shows who authored the skill in the first place, because in a multi-agent setup the author matters: a skill Claude wrote and Codex merely has access to behaves differently in my head than one Codex owns.

The usage column turned out to be the quiet killer feature. Intuition told me I had a healthy library. The numbers told me which skills earn their place in context and which are just furniture. You do not prune what you cannot see, and context is not free: every skill an agent carries is words in its head before you say anything.

There is also an eval side, where I score how well each model actually performs with each skill, but that deserves its own write-up.

## Why I am writing this down

Because the before-state was the interesting part. I did not set out to build a product, and this is not one. It is personal infrastructure, the same category as dotfiles. Single user, by design.

What I actually did was treat my own AI usage as a system worth engineering. I had consistent workflows, no visibility, and a vague sense that things were drifting. The fix was the same fix it would be at work: make the state observable first, then improve what the observations tell you. It turns out that discipline transfers fine to a laptop. It might be the most useful place it transfers to, because you are the user who is there every day.

I am documenting the journey as I go: context management, evaluation, observability, on one machine, for one person. If you are managing context across your own agents, whether that is with a spreadsheet, a folder convention, or something you built, I genuinely want to hear how you are doing it.
