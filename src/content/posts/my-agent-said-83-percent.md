---
title: "My Agent Said I'd Used 83% of My Week. I'd Used 0%."
date: "2026-10-07"
preview: "I asked an agent to track how much of my AI plans I had left. Its first answer came from a log file and was wrong by 83 points. The fix was to stop reading what the tools wrote down and ask them directly."
readTime: "4 min read"
---

My agent told me I'd used 83% of my weekly Codex allowance. I'd used 0%.

Nothing was broken. The number came from a log file, and a log file only knows what was true the last time something wrote to it.

## What I wanted

I run three AI coding tools: Claude Code, Codex and Antigravity. Each plan has limits: how much you can use in a five-hour stretch, and how much in a week. Hit one mid-task and the tool stops until it resets. I wanted one place that shows all of them, so I see a limit coming instead of finding out when I hit it.

That place is Agent Estate, the dashboard I built to keep an eye on my agents. So I asked an agent to add it.

## The first answer

The agent went looking for the numbers on disk. Each of these tools keeps a running record of every session (a session log), and Codex's records include the usage limits as they stood at that moment. It found the newest one, from a session early on Tuesday morning, and reported back: 83% of the week used, resetting on Friday.

That would have changed how I worked for the rest of the week. I'd have saved Codex for small jobs and leaned on the others.

Then I asked a simpler question. Every one of these tools already has a built-in command that shows your usage: `/usage` in Claude Code, `/status` in Codex. Why not just run that and read the answer?

The agent did, and came back with a correction it put in bold: the live answer was 0% used, on a fresh week that resets next Wednesday.

## Why the log was wrong

A log is a photograph. It records the moment it was taken and never updates. That Codex record was written during my last Codex session, a day and a half earlier. Since then the week had started again. Nothing writes to the log when that happens, because no session was running.

I still don't know why that week restarted before the Friday the log promised. That's the point. The log couldn't know either.

**A log tells you what was true. The tool tells you what is true.**

## What it does now

Agent Estate asks each tool directly, the official way, every ten minutes:

- **Claude Code:** runs `/usage` without starting a conversation. It's a built-in command, so it costs nothing (0 tokens) and takes about four seconds.
- **Codex:** asks the same question its `/status` screen asks, through Codex's own connection for other programs (the app server). Under a second.
- **Antigravity:** runs its own `/usage` command, which hands back neat, structured numbers.

![Agent Estate's Plan allowance panel: every limit for all three tools, with the tightest one named at the top](/blog/allowance-strip.png)

Three rules kept it honest:

**1. If the tool can't answer, show nothing.** A failed check says "Couldn't read" with no number. An old number shown as if it were current is exactly the mistake that started this.

**2. Catch the expensive failure.** If Claude Code ever stopped treating `/usage` as a built-in command, the request would go to the AI model instead and cost real usage, which is the thing I'm trying to measure. The checker spots that and reports it as an error, and it runs on the cheapest model so a slip costs as little as possible.

**3. Test it, then break it on purpose.** There are 16 tests, built from real answers the three tools gave plus the ways they can fail: a timeout, a missing tool, a changed format. Then the agent removed two of the protections on purpose, the expensive-failure check and the handling for dates that cross into a new year (`/usage` leaves the year out). The matching test went red each time. A test that stays green when you break the code isn't testing anything.

## The number that mattered wasn't the headline

Once the real numbers were on screen, the surprise was in Claude Code. My overall weekly use was 53%. Fine. But one model has its own separate weekly limit, and that one was at 93%.

If I'd only watched the headline figure, I'd have run into a wall with half my week apparently left. So the panel leads with whichever limit is closest to running out, and that is what shows on my desktop.

![The desktop panel: one line per tool, and the limit closest to running out spelled out underneath](/blog/allowance-hud.png)

## What carries over

This isn't really about usage limits. Agents read logs all the time: to see what happened, to decide what to do next, to report back to you. A log is the easiest thing for an agent to find, so it's the first thing it reaches for. If the system it's asking about can answer for itself, ask the system.

The agent got this wrong, then caught it and said so in bold. That's the behaviour I want. But the lasting fix was making the right answer the easy one to get.
