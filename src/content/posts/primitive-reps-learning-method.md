---
title: "Primitive Reps: The Way I Learn Hard Things"
date: "2026-06-22"
preview: "I do not learn hard technical skills by covering topics. I break them into small movements and repeat those movements across scenarios until the pattern becomes automatic."
readTime: "5 min read"
---

I have realised I do not learn hard things by "covering topics."

That phrase sounds productive, but it usually means I watched a few videos, read a few notes, and briefly felt like I understood something.

Then I try to use it under pressure and the whole thing disappears.

The method that actually works for me is different. I break the skill into small movements, then I repeat one movement across different scenarios until it becomes boring.

I call them primitive reps.

## Small movements compound

Atomic Habits is basically built on this idea: small actions repeated consistently become part of the system. You are not trying to win through one giant effort. You are trying to make the right behaviour easier to repeat.

That is obvious in physical skills.

A basketball player does not only practise "shooting." They practise the small pieces inside the jump shot. Foot position. Balance. Elbow. Wrist. Follow-through. Where the guide hand sits. How the ball leaves the fingers.

The shot looks like one movement from the outside, but it is built from smaller movements that have been repeated so many times the body stops negotiating with itself.

Same with piano.

When I was practising properly, I would not just keep playing the whole piece badly from the top. I would isolate the awkward bit. Sometimes that meant practising the thumb tuck when crossing under. Just that movement. Slowly. Again and again. Then it starts to feel normal, and suddenly the bigger phrase is not as scary.

That is the bit people skip when learning technical skills.

They try to play the whole song too early.

## Topics are too big

A topic is usually too large to practise directly.

"Learn system design" is not a rep.

Neither is:

- learn APIs
- learn databases
- learn caching
- learn AI platforms
- learn evals
- learn security

Those are labels. Useful labels, but still labels.

A rep has to be smaller.

For coding, filtering is a rep. Counting things in a dict is a rep. Reading a file and returning the right shape is a rep. Spotting the difference between mutating a list and returning a changed copy is a rep.

That is why my CodingDojo is built the way it is. I do not do one filtering task and move on. I do 10 or 12 filtering tasks across different data shapes.

Numbers greater than 10.

Even numbers.

Names longer than 5 characters.

Active users.

Paid orders.

Files larger than 1MB.

It looks repetitive because it is repetitive. That is the point.

The goal is not to memorise the answer to "active users." The goal is to make the filtering movement automatic enough that my brain has room for the actual problem later.

## One module, one movement

The rule I am using now is simple:

One module = one movement.

Many tasks = reps of that same movement across different scenarios.

So if I am learning system design, I do not want one giant exercise where I have to do requirements, entities, APIs, storage, queues, caching, scaling, security, and failure modes all at once.

That is too much load.

Instead, I want a module just for requirements gathering.

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

## The AI platform version

The same method works for AI platform engineering.

I do not want to "learn RAG" in the abstract. I want reps.

A retrieval module should have 12 retrieval tasks across different products:

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

Not one vague note saying "add evals." Twelve reps where I decide what good means, what bad looks like, what should block release, and what evidence I would want before trusting the system.

Same for tool permissions.

Not "agents need guardrails." That is too vague to be useful. The rep is:

- what can the agent read?
- what can it write?
- what needs approval?
- what is blocked completely?
- what gets logged?
- what is the blast radius if it goes wrong?

That is where the mental model starts forming.

## Why this works for me

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

That is the method.
