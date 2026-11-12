---
title: "My Agents Say Done. Now They Have to Show Me."
date: "2026-11-12"
preview: "A coding agent says 'done' in the same voice whether the thing works or not. So I stopped taking its word. Every change my agents make now leaves a record with five kinds of proof, a second model's review, and four questions answered, and it all lands on one page I built called Changes HQ. First week: 10 changes, 62 pieces of proof, 67 review findings."
readTime: "6 min read"
---

On 5 November I typed this to one of my coding agents:

> "I need screenshots as proof, because right now I'm just going by your word."

That was the problem in one line. An agent says "done" in the same confident voice whether the thing works or not. The next day I clicked a clip thumbnail on my desktop dashboard that an agent had called finished, and got a crash report. The agent had tested the one control it changed. It had not pressed the others.

So I stopped taking the word. Now every change has to show me.

## What counts as proof, and what does not

I had been asking agents for screenshots for months. "Take a screenshot and feed it back to yourself" was a normal message from me by the summer. What I had never done was write down what does **not** count. Now that list sits in the file every agent reads:

- A tool's own success reply ("published", "created", `success: true`).
- A process that is running, a window title, an exit code of 0.
- A test suite that passes but never failed.
- A file that exists. Existence is not behaviour.
- "I ran it" with no output pasted.
- A helper agent's "done" that nobody read.

Every one of those is something an agent has told me was proof. Every project now has its own page of what does count. For my music app it is a screenshot from inside the music software plus the file it wrote compared against a known good copy. For a website it is the live page, fetched and quoted.

## Five kinds of proof

Each change my agents ship now carries some of these, picked by what the change does.

**1. A screenshot of the result.** Not of the code. Of the thing a user sees, taken in a hidden browser (headless) so it does not take over my screen. The agent has to look at it and describe it before it counts.

**2. A clip, when something moves.** A screenshot shows the end state. It does not show the change happening. On 5 November I asked for clips "so that I can actually see the transition and know that we verified." When an agent fixed a tab on my desktop dashboard that did nothing when pressed, the proof was a screenshot of the old build with the tab pressed and nothing open, a screenshot of the new build with the pane open, and a short clip of a real press opening and closing it.

**3. A test that failed first.** A test that passes on the broken code proves nothing. Last week an agent spent 13 tool calls failing to download one PDF from my email. The cause was one character: an en dash in the filename crashed the server that hands my agents their mail. The fix shipped with a test that plants a file with an en dash in its name. On the old code it failed ("Remote end closed connection without response"). On the new code it passes. Both runs are in the record.

![The attachment fix drawn as boxes and hops: the request goes into the mail server, the server fetches the file, a new helper turns the filename into a header the server can send, and the reply goes back with the file. The data that moves is written on every arrow.](/blog/agents-show-me/attachment-fix-drawing.png)

**4. A drawing of the change, with the data on every arrow.** Boxes for each step, arrows for each hop, and on each arrow the data that moves (the payload). I [wrote about why a few days ago](/posts/the-drawing-is-the-spec). Now every change carries one, drawn in Excalidraw and saved as an image with the editable drawing inside it. It is the first thing I look at.

**5. A review by a second model.** The agent that wrote the change does not get to mark its own homework. A different agent reads the diff and tries to break it. Across the first 10 changes, reviewers raised 67 findings: 51 fixed, 11 accepted with a reason written down, 5 still open. Honest note: my usual reviewer is Codex, and Codex ran out of credits for most of the week, so 9 of the 10 reviews were a fresh Claude agent with no memory of the work. That is weaker than a different model family, and the record says so.

## Four questions on every change

Each record also answers four questions I ask about any change I am going to own:

1. Does it work?
2. Can I follow it as boxes and arrows?
3. Was it tested end to end, the way I would use it?
4. Could I change it in a month?

Each answer is yes, partly or no, with a line of detail. In the first week, 5 of the 10 changes said "partly" to end to end, and named the step that was not run. One said: "Open PR: push and gh are called by a fake in tests; no real PR was opened." I would rather read that than a clean yes I cannot trust.

## Where it all lands: Changes HQ

The proof has to live somewhere I will actually look. So every change writes one small file next to the code, `changes/<date>-<ticket>.json`, checked against a fixed shape (a schema). A page I built, Changes HQ, reads those files from 8 of my projects and shows one card per change.

![Changes HQ: "10 changes are waiting for you, 8 need your eyes." Each card shows the user story, the four questions as dots, thumbnails of the drawing and screenshots, a Reviewed button and an Open diff in Cursor button.](/blog/agents-show-me/changes-hq.jpg)

Each card has:

- the change as a user story ("As Dan, I can now ... so that ...");
- the drawing first, then the screenshots and clips as thumbnails;
- the test runs and logs, one click away;
- the review, finding by finding;
- a flag when the change touches a file I said I always read myself;
- a button that opens the diff in my editor, and one that writes the pull request description from the record.

The page was slow at first, which is its own small story. Opening it pulled 29.3 MB because the thumbnails were full-size screenshots and every clip loaded whole, and the proof tab took 62 seconds. An agent cut it to 1.4 MB and 2.3 seconds, and the record for that change carries the before and after measurements.

## The first week in numbers

From 1 to 8 November:

- 10 changes across 3 projects
- 62 pieces of proof: 36 screenshots, 8 test runs, 6 logs, 5 drawings, 5 clips, 2 traces
- 67 review findings: 51 fixed, 11 accepted, 5 open
- 5 of 10 changes honest about being only partly tested end to end

## What it does not fix

All 10 of those changes are still waiting for me. The Changes HQ screenshot above says so.

Proof makes my review fast. It does not do my review. A screenshot can show the wrong thing, and a clip can show a happy path that skips the case that breaks. The agent still writes the record about its own work, and a second agent from the same family is not a truly independent check. I still read the drawing, I still press the buttons on anything that matters, and I still read every diff in the files I marked as mine.

What changed is the starting point. I used to start from "the agent says it works." Now I start from what it showed me.

## Try it on your next change

1. Write your own "this is not evidence" list and put it where your agent reads its instructions.
2. Make the agent attach proof to the change: the screenshot, the red-then-green test, the drawing.
3. Have a different model review it before you do.
4. Put it all on one page you will actually open.

You do not need my page for this. You need the habit of asking "show me" before you ask "is it done?"
