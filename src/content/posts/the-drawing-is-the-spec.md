---
title: "The Drawing Is the Spec. The Data on the Arrows Is the Contract."
date: "2026-11-09"
preview: "Everyone is writing about managing coding agents like a team. I measured 7,785 of my own prompts: median 11 words. The prompt is short because the spec is a drawing, with the real data written on every arrow. Once the data on each hop is chosen, the code is already decided. Here is the loop, with a real diagram."
readTime: "8 min read"
---

Addy Osmani published an article this week called "Your coding agents made you a manager" ([X, 8 Nov 2026](https://x.com/addyosmani/status/2119332146485891501)). Give the agent a check it can run. Brief what the repo cannot show. Turn every second correction into a rule. Plan before code. Delegate the task, never the judgment.

I read it and nodded. Then I measured my own sessions against it, because I had the data on disk.

## What 7,785 prompts look like

I pulled every message I have typed into my coding agents since March: 10,218 in Claude Code, 197 in Codex, 11,041 in Hermes. I dropped anything automated or pasted. That left 7,785 prompts typed by hand.

- Median prompt: **11 words**
- Prompts of 15 words or fewer: **60%**
- Prompts in a "Goal / Constraints / Out of scope" template: **1%**
- Prompts that hand the decision to the agent ("you decide"): **0.1%**
- Sessions with three corrections in a row: **7 of 905**

Eleven words. No template. The articles going round show prompts with a goal line, a constraints line, a non-goals line and a check command. I do not write those. My prompts work anyway, and I wanted to know why.

Two reasons. The durable rules moved into the harness (the tools and hooks around the agent), which [I wrote about last month](/posts/i-stopped-writing-rules-for-my-ai-agents). And the spec moved into a drawing.

## The drawing, with the payload

Before an agent writes code for me, I draw the change. Boxes for each step. Arrows for each hop. And on every arrow, the data that moves (the payload), with the real field names and the shape of the data.

Here is one. On a project I was working on, I drew a trigger that turns a ticket event into an agent run. This is that drawing, redrawn with the names and values changed. The shape is the real one.

![A ticket event starts an agent run, drawn to the payload: the webhook body with its list of changes and set of labels, the event on the bus, the batch from the queue, the conditional write into a seen map keyed by event_id, a latest-status map keyed by issue_key that drops stale events, the run request, the typed result posted back on the ticket.](/blog/drawing-is-the-spec/ticket-trigger.png)

Read the arrows. The tracker sends `{event_id, issue_key, changed_at, changes[], labels[]}` and wants a 200 within ten seconds. The receiver forwards it onto a bus that crosses into a second cloud account. The queue hands over a batch, a list of up to ten messages, and the same event can be in that list twice, or two events for one ticket can arrive out of order. Two maps sort that out. `seen`, keyed by event_id, takes a write only if the key is absent. `latest`, keyed by issue_key, takes a write only if the timestamp is newer than the one stored. Only then does one container start, with `{run_id, workflow, timeout_s, env{}, allowed_tools[]}`. The result goes back onto the ticket as `{verdict, cost_usd, tokens{}, findings[]}`. One line at the bottom says when the system reads "ok" and when it reads "down".

That is the whole spec. Scope: these seven boxes and no others. Boundaries: account A only forwards, and the run never sees the queue. Data contract: the fields in the white boxes, with their types. Done: one run per event_id and the newest status per ticket wins, even when the queue delivers twice. Osmani's template has the same five things. Mine is a picture.

## Why the payload matters

A drawing with box names only tells you the shape. A drawing with the data on the arrows tells you what you will see when you open the code.

When the happy path is on the drawing down to the field names, I can read the code and know what each line should do before I read it. I know that the dedupe function does one conditional write and nothing else. If I see it read the table first and then write, that is a race, and I do not need to read the rest to know it. I know where `changed_at` gets compared to the stored one. If that comparison is missing, the stale "Open" event starts a run it should not.

My attention goes to the edges: the batch holds the same event twice, the two events for one ticket arrive in the wrong order, the webhook gets no 200 and sends again. The agent wrote a test for each of those. I checked them against the drawing, not against the code.

The opposite happened to me earlier this year. I let an agent build a take-home from a text brief. The tests passed. In the interview I could not walk through my own code. I had never drawn it, so I had no picture of what moved between the parts. This system, which I drew to the payload months ago on a project I was working on, I can still fault-find today. I know what the data looks like coming in, so I know where to go.

That is the difference between implemented and understood. The drawing is where understanding lives.

## What the drawing shows before any code

The drawing did one more thing I did not expect. It changed how I work with people, not just agents.

Three things happened that a text spec never gave me.

**Colleagues read the intent in one look.** Nobody asked me what the change did. They looked at the arrows and knew. The questions I got were about the hops, which is where the design decisions are.

**The data structure got questioned where it was chosen.** When the message on the queue is written out on the arrow, you can ask whether it is the right shape before any code depends on it. Is the duplicate key the event id, or the ticket id plus a timestamp? Is this the right data type for this piece of data? Should the seen-events store be a hash map (a dictionary, keyed for instant lookup) rather than a list we scan every time? In this drawing the answer turned out to be two maps with two different keys, because they answer two different questions: have I seen this event, and is this the newest status for this ticket. That is where you start to reason about those patterns. You can do it without the drawing. Seeing the data on the arrow makes it clearer to reason about, and the question is cheap on the drawing and expensive after.

**Bottlenecks showed up as geometry.** Where several arrows meet one box, that box is the queue, the lock or the slow call. Where one arrow carries a large payload across an account boundary, that hop is the cost. You see it before you measure it.

By the time the drawing is done, you already know what code needs to be written. Each box is a function. Each arrow is its input and output. The agent is typing, not designing. And months later, when something breaks, I know exactly where to go, because I know what the data looks like coming in.

## The loop

1. **Draw it.** Every box, every hop, the payload on every arrow, the condition on every branch. If code will exist for a step, it is on the drawing. A parse from text to dict gets its own line. Nothing is "abstracted away".
2. **Write the tests from the drawing.** One per box: what goes in, what must come out. I write these, or I agree each one before it exists. The agent does not add tests on its own.
3. **Let the agent build against the drawing and the tests.** One box per commit. Each box becomes one function with the box's name. If the agent needs a step that is not on the drawing, it stops and tells me. The drawing changes first, then the code.
4. **Proof, not a report.** The change is done when I have a screenshot of the result, the test output, and the drawing saved next to them. A tool saying "done" is not evidence.
5. **Options come back as a table of user stories.** When the agent has a choice to make, it does not pick. It writes each option as "As Dan, I want X so that Y", with its pick and the other way side by side. We agree the acceptance criteria before the build, not after.

Step 5 is the part I have not seen written down. Most "manage your agents" advice is about what you tell the agent. This is about what the agent tells you, and in what form. The closest I know is Garry Tan's gstack, whose plan reviews send each decision back as a brief with a recommendation and the user impact of every option. Mine goes one step further: each option is a user story, so the human benefit is the sentence, not a footnote. A user story table forces that benefit into the open. It is much harder to talk me into a clever implementation I do not need.

## Where it fits

None of this is new on its own. Gary Bernhardt's "Boundaries" talk (SCNA 2012) separates the pure core that turns values into values from the thin shell that touches the world. The boxes with payloads are that core. Harper Reed's "[My LLM codegen workflow atm](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/)" (Feb 2025) gets a spec out of the model by interview before any code. Mine gets it out of me, as a picture, which is how I think. Osmani's article says the check command is the most useful line in your rules file. My drawing ends with that line.

What I have not seen anywhere is the drawing as the single artefact that is spec, review guide, and the thing you remember six months later.

## What I am adding after reading Osmani

He is right about two things I do not do yet. Every task should carry an "out of scope" line and a "check" line. My ticket template has why, what and acceptance criteria, and I am adding those two. And he caps work in progress. I have no number for how many builds can be open at once. I am going to pick one.

## Try it on your next change

Open a blank canvas. Draw the boxes. Write the real field names on every arrow. If you cannot name the fields, you are not ready to brief anyone, human or agent. When you can, the prompt gets short, because the drawing did the work. Once the data on each hop is chosen, the code is already decided.

Sources: [Osmani, "Your coding agents made you a manager"](https://x.com/addyosmani/status/2119332146485891501) · [Osmani, "Your AI coding agents need a manager" (Jan 2026)](https://addyosmani.com/blog/coding-agents-manager/) · [Harper Reed, "My LLM codegen workflow atm"](https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/) · [Bernhardt, "Boundaries"](https://www.destroyallsoftware.com/talks/boundaries)
