---
title: "Most of My Context Window Was Unaccounted For"
date: "2026-08-18"
preview: "I built a dashboard to see what my agents had. It still couldn't tell me what was in the context window at the moment I hit enter. So I built a context workbench, measured one live session, and found that 80% of the used context was not attributable to anything I could name."
readTime: "5 min read"
video: "/blog/agent-estate-context.mp4"
videoPoster: "/blog/agent-estate-context-poster.jpg"
videoCaption: "The context workbench: every live session, with the system prompt, tools, skills and conversation measured and attributed per source."
---

Last week I wrote about building myself a dashboard so I could finally see my own agent setup: which harness had which skill, what each one was, how often I actually used it. That answered what my setup *has*.

It did not answer the question I actually keep asking, which is what my agent is *carrying* right now, at the moment I type a message.

I run several harnesses, which is my word for the different agent environments on my machine: Claude Code, Codex, Hermes, and now Antigravity. I use different ones for different jobs. And every single day I would hit the same wall. Why did that session compact so early? Why did this one feel dumber than the last one? What went in before I said a word?

You can name the usual suspects. Your skills, which are instruction files the agent loads. Your rules files, the CLAUDE.md or AGENTS.md that every harness reads at startup. The output of your tools and your MCP servers, which is the connective tissue between an agent and your real applications. That is a list of ingredients. It is not a measurement. Nobody was telling me how many tokens each of those was actually costing me in a specific live session.

So I built a context workbench.

## What it does

Every session I start lands in it. Not a log I go and find afterwards, the live one, mid-conversation.

For each session it shows the system prompt the agent is actually carrying, the skills that are in its context, the hooks that fired, and then the part I built the whole thing for: a token breakdown, split by where the tokens came from. System. Tools and MCP. Skills. Conversation. And whatever is left over.

The tagline I gave it is the honest description of the goal: the exact next turn state, measured totals, attributed segments, reversible revisions.

## The number that justified building it

Here is a real session from the video, a Claude Code session I had been using to prep for an interview.

It was 38.8% full. That is 387,971 tokens of a one million token window. Where those tokens came from:

- System: 2,050
- Tools and MCP: 40,881
- Skills: 462
- Conversation: 35,464
- Unexposed: 309,114

Read that last line again. About 80% of everything in that agent's head was in a bucket labelled "unexposed". My actual conversation, the reason the session existed at all, was 9% of it.

The unexposed number is not a guess or a rounding error. It is a measured residual: the total the harness says the request used, minus everything the workbench could attribute to a named source. The gap is the point. It is the honest size of what I could not see.

The other pair of numbers in that same session did the same job on a smaller scale. 108 tools available, 10 invoked. 45 skills intended, 2 actually loaded.

## Saying "I don't know" out loud

The thing I am most pleased with is not the chart. It is that every row carries a label saying how the number was obtained.

The system prompt in that session is marked wire captured, meaning it was taken from the actual request that went out, not reconstructed. Tools, same. Skills are marked not observable, because the harness does not tell me which of the ones it intended to load actually made it in.

In a different session in the same video, running on a different harness, the system prompt is only marked partial and the tools are marked configured rather than wire captured. Same workbench, weaker evidence, and it says so.

This matters more than it sounds. Every harness hides something different. Claude never writes its system prompt to disk. Codex encrypts its reasoning state. A dashboard that smooths over those differences and shows you five confident numbers is lying to you in the most expensive way, because you will make decisions on it. I would rather have a number and a note saying "this one is an estimate" than a clean chart I cannot trust.

You cannot fix what you cannot see, but you also cannot fix what you have been told wrong.

## What I do with it

This is where it stops being a toy. With per source attribution I can finally make calls I was previously making on vibes.

If a tool is dumping thousands of tokens into every session for output I never read, that is now visible, and I can go and change what that tool returns. If a skill is loaded in every session but never actually used, that is furniture, and furniture in a context window is words in your agent's head before you have said anything. If my conversation is a small slice of the total, then compaction is not about me talking too much, it is about everything else crowding me out.

Curation instead of guesswork. That is the whole return on this.

It is also harness agnostic by design. Whichever environment I am in, I get some level of visibility into what is in the window at a point in time, and I get told how good that visibility is. That last part is what makes comparing them possible at all.

## Where this goes

This is one piece of a series I am working through on my own setup. Tools and MCPs are next, then the evals I run against my skills, and a benchmark I built for myself to check whether any of this is actually making the agents better.

The thread running through all of it is the same. I am treating my personal AI usage as a system worth engineering, and the first move in engineering any system is making its state observable before you start tuning it.

If you are tracking what goes into your context window, whether that is a script, a spreadsheet, or just a habit of clearing sessions early, I want to hear how you are doing it. I have not seen many people measure this, and I would like to be wrong about that.
