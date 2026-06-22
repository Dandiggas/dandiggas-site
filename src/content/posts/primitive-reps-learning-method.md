---
title: "Primitive Reps: The Way I Learn Hard Things"
date: "2026-06-22"
preview: "I do not learn hard technical skills by covering topics. I break them into small movements and repeat those movements across scenarios until the pattern becomes automatic."
readTime: "5 min read"
---

I have always learned best through reps.

Not vague repetition. Specific reps.

One small movement, repeated across different scenarios, until the pattern becomes automatic.

I have done this in music for years without calling it a framework. When you practise piano properly, you do not just keep playing the whole piece from the top and hope the awkward part magically fixes itself. You isolate the movement that is breaking the phrase.

Sometimes that movement is tiny. Tucking the thumb when crossing under. Getting the hand shape right. Slowing it down until the body understands what the brain keeps shouting.

Same with a jump shot.

A good basketball player is not only thinking "shoot the ball." The shot is built from smaller pieces: foot position, balance, elbow, wrist, guide hand, follow-through. From the outside it looks like one clean movement. Underneath it are hundreds of small reps that have removed the argument from the body.

That is how I think about learning hard technical things too.

## Topics are not reps

A topic is usually too big to practise directly.

"Learn system design" is not a rep.

Neither is:

- learn APIs
- learn databases
- learn caching
- learn AI platforms
- learn evals
- learn security

Those are labels. Useful labels, but still labels.

A rep has to be smaller than that.

For coding, filtering is a rep. Counting things in a dict is a rep. Reading a file and returning the right shape is a rep. Spotting the difference between mutating a list and returning a changed copy is a rep.

That is why I built my CodingDojo the way I did. I do not do one filtering task and move on. I do 10 or 12 filtering tasks across different data shapes.

Numbers greater than 10.

Even numbers.

Names longer than 5 characters.

Active users.

Paid orders.

Files larger than 1MB.

It looks repetitive because it is repetitive. That is the point.

The goal is not to memorise the answer to "active users." The goal is to make the filtering movement automatic enough that my brain has room for the actual problem later.

## One module, one movement

The rule I use now is simple:

One module = one movement.

Many tasks = reps of that same movement across different scenarios.

That matters because a lot of learning material jumps to the full performance too quickly. It asks you to design the whole system, build the whole app, solve the whole problem, explain the whole architecture.

There is a place for that. But if the primitives underneath are still shaky, the full exercise becomes noise.

So when I am working on system design, I do not want one giant exercise where I have to do requirements, entities, APIs, storage, queues, caching, scaling, security, and failure modes all at once.

That is too much load.

I want a module just for requirements gathering.

Same movement, different scenarios:

- URL shortener requirements
- food delivery requirements
- chat app requirements
- file sync requirements
- ticket booking requirements
- payment system requirements
- notification system requirements
- search system requirements
- analytics dashboard requirements
- AI assistant backend requirements

By the end of that module, I am not trying to remember what a URL shortener does. I am training the habit of asking:

- who is the user?
- what are they trying to do?
- what must the system guarantee?
- what scale matters?
- what is out of scope?
- what question would I ask before drawing boxes?

Then I can move to entities and relationships. Same scenarios, different movement.

Then APIs.

Then storage.

Then queues and workers.

Then failure modes.

This is slower at the start, but faster later. It stops every design problem from feeling like a foggy blob.

## Small movements compound

This is where Atomic Habits connects for me.

The useful part is not the motivational version of habits. It is the compounding part. Small actions repeated consistently become part of the system. Eventually you stop needing to negotiate with yourself every time.

That is what I want from technical practice.

I do not want to rely on panic, inspiration, or a perfect study day. I want the movement to be trained well enough that it shows up when I need it.

That only happens if the movement is small enough to repeat.

If the rep is too big, you avoid it.

If the rep is too vague, you cannot tell whether you improved.

If the rep keeps changing shape, you never get enough clean repetitions to build the pattern.

So I make the movement small, keep the shape consistent, and change the scenario around it.

That is the sweet spot.

## The AI platform version

I am applying the same structure to AI platform engineering.

I do not want to "learn RAG" in the abstract. I want reps.

A retrieval module should have retrieval tasks across different products:

- customer support assistant
- internal policy chatbot
- coding assistant
- music sample librarian
- invoice extraction assistant
- legal clause explainer
- research agent

Each task is training the same movement:

- what source data exists?
- how does it get ingested?
- how is it chunked?
- what metadata matters?
- where do permissions get checked?
- how do citations work?
- what proves the answer is grounded?

Same for evals.

Not one vague note saying "add evals." Reps where I decide what good means, what bad looks like, what should block release, and what evidence I would want before trusting the system.

Same for tool permissions.

Not "agents need guardrails." That is too vague to be useful. The rep is:

- what can the agent read?
- what can it write?
- what needs approval?
- what is blocked completely?
- what gets logged?
- what is the blast radius if it goes wrong?

That is where the mental model starts forming.

## What the reps are really doing

The value is not in the individual exercise.

The value is in seeing the pattern repeat.

After enough reps, I start to notice what changes between scenarios and what stays the same. That is the mental model.

In a chat app, entities are users, conversations, messages, delivery state.

In a ticket system, entities are events, seats, reservations, payments.

In a RAG app, entities might be documents, chunks, embeddings, users, permissions, queries, traces.

Different nouns. Same modelling movement.

That is the bit I am trying to lock in.

I am not trying to become someone who has memorised 100 examples. I am trying to become someone who can see the primitive underneath the example.

## My current rule

If a skill matters, I do not ask, "Have I covered this topic?"

I ask, "What is the smallest movement inside this skill, and have I done enough reps for it to become automatic?"

That changes the whole learning system.

It makes practice less glamorous. It also makes it work.

Because the boring bit is usually where the skill lives.

The jump shot is in the wrist.

The piano phrase is in the thumb tuck.

The system design interview is in the requirements rep before the diagram.

The AI platform is in the boundary, the trace, the eval, the permission check.

Small movements. Repeated properly. Over a long enough period.

That is the method I have been using. I am just putting better language around it now.
