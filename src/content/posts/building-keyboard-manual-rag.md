---
title: "I Built a RAG System to Solve a Real Problem I've Had for 15 Years"
date: "2026-04-09"
preview: "You put a specific keyboard on the rider, get flown out to the gig, and when you arrive it's something completely different. That's the scenario this project solves."
readTime: "5 min read"
---

## The Problem

I've been playing keyboards professionally for years. Session work, weddings, live shows, festivals. One thing that happens more often than you'd think: you put a specific keyboard on the rider, you get flown out to the gig, and when you arrive it's not what you asked for.

You asked for a Nord Stage 3 because you know it inside out. Your sounds are ready, your splits are programmed, you just need to plug in and go. But you get there and it's a Yamaha Motif. You've never touched one before. You've got 20 minutes of soundcheck to figure out how to programme every sound you need for the set. After that the room gets cleared, and the next time you're in front of that keyboard, you're playing live.

That's the scenario this project solves.

## The Idea

What if I had a chatbot loaded with the PDF manuals for every modern keyboard you're likely to encounter on a gig? You could ask it plain questions like "How do I split the keyboard?" or "How do I save a performance?" and get a straight answer pulled directly from the manual for that specific instrument.

In an ideal world it would keep itself updated too. An agent running on a schedule, scraping for the latest manuals and firmware updates every couple of weeks, so when you ask it something you're always getting current information.

## The Build

I wanted to keep costs low and run things locally. My machine's an M4 Max with 128GB RAM, so it's more than capable of running a local LLM. The stack:

- **FastAPI** for the backend API
- **Qdrant** for vector search (storing and retrieving manual chunks)
- **sentence-transformers** (all-MiniLM-L6-v2) for embeddings
- **LocalAI** running **Llama 3.1 8B** for answer generation
- **Langfuse** for end-to-end tracing and observability
- **Docker Compose** to keep everything portable — anyone can clone the repo and spin it up
- Simple HTML and Tailwind for the frontend. No React, nothing heavy. It didn't need it.

I chose Langfuse because I wanted real observability over what the system was doing. Not just "did it answer?" but: what chunks did retrieval pick? How many tokens went into the prompt? How long did each stage take? Where exactly did it go wrong when the answer was bad?

I also added a basic eval harness with positive cases (questions the manual should answer) and refusal cases (questions it should refuse, like general music theory). That way I could measure whether changes actually improved things instead of just eyeballing it.

## What I Learned

**Model choice matters.** I started with Phi-3.5 Mini because it's small and fast. It was rubbish. It would half-refuse a question and then hallucinate an answer anyway. Swapping to Llama 3.1 8B was a big improvement — better instruction following, proper refusals when the context didn't cover the question.

**The system prompt is part of the product.** The default "you are a helpful assistant" prompt doesn't cut it, especially with smaller models. I had to be explicit about the role ("keyboard manual assistant"), the constraint ("use ONLY the manual excerpts"), the refusal behaviour ("say I couldn't find that"), and the output format ("step-by-step for how-to questions"). Small models need more hand-holding. A good prompt with a small model can punch well above its weight.

**Chunk size changes everything.** Initially the chunks were too small and retrieval was pulling back fragments that didn't have enough context to answer properly. I bumped the chunk size from the default up to 600 tokens, then to 1000, and the quality of retrieved context improved noticeably.

**Observability turns guessing into debugging.** Before Langfuse, when the answer was bad I'd be guessing — was it the retrieval? The prompt? The model? With tracing I can click into any request and see exactly what happened. The retrieved chunks are right there. If they're irrelevant, that's a retrieval problem. If they're good but the answer is bad, that's a generation problem. It completely changes how you improve the system.

## Demo

Here's a short walkthrough showing the system answering questions, the Langfuse trace, and a controlled failure case:

[Watch the demo](https://www.loom.com/share/d0b6df37b0514febab2706f1488a3a84)

## Code

The full source is on GitHub:

[keyboard-manual-assistant](https://github.com/Dandiggas/keyboard-manual-assistant)

## What's Next

If I extend this further, the next step would be running it in the cloud rather than locally. Probably AWS ECS, spun up on demand rather than always running. An EventBridge rule triggering an agent on a schedule to scrape specific sites for new manuals, firmware updates, and gear news — keeping the knowledge base current without any manual effort.

But for now, it does what it needs to do. And more importantly, it gave me a reason to build a real RAG system end-to-end and understand every layer of it — from chunking strategy to retrieval quality to prompt engineering to observability. That's the part that transfers.
