---
title: "What Actually Stops an AI Workflow at Its Spending Limit?"
date: "2026-11-20"
preview: "A spending limit sounds like a number in a config file. When I tested one, the number was the easy part. The hard parts were two calls spending the same balance at once, a caller that could pick a new budget, and a reply that failed before anyone counted it."
readTime: "5 min read"
theme: guardrails
stat: "1 shared service in front of every call"
line: "Two calls spending the same balance at once, and a reply that failed before anyone counted it."
---

I recently worked on measuring and limiting what an AI workflow spends. One run of the workflow can make many model calls before it finishes.

I had three jobs. See what each run spent. Keep the model inputs and replies so I could inspect them. Stop the run from spending past its limit.

The third job changed when I asked one question: what actually stops the run?

A usage record tells me what a finished call cost. But by the time that record exists, the call has already happened and the money is spent. A record can report the overspend. It cannot prevent it.

So recording spending and allowing spending are two different jobs, and they sit in two different places.

## The check has to sit in front of the call

The version I built on 17 November put one shared service between the workflow and the model provider. Every model call went through it.

Before it sent a request on, the service checked the run's budget. After the reply came back, it recorded what the call used. The budget check now had a fixed place in the path of every request, before the money moved.

## Two calls at once can spend the same money

Here is a made-up example, not a measured result. A run has $10 left. Two calls each might cost $7.

If both calls read the balance before either one updates it, both see $10. Both start. Each decision was correct on its own, and together they spend $14.

The service fixed this by holding money back before each request (a reservation). It did not reserve the expected cost. It reserved the most the call could cost: the price of the largest input the model accepts, plus the reply length the request asked for.

The database checked the balance and wrote the reservation as one step that cannot be split (an atomic transaction). Two calls cannot both see the same $10.

When the full reply arrived, the real usage replaced the reservation. The unused part went back into the budget.

One test fired twenty calls at the same time. The saved results show the run stayed within its limit.

That safety has a cost. Because the service reserves the worst case, it can refuse a small request while some budget is still left. The tests proved the limit holds. They did not prove that every last token of budget gets used.

## The run has to have an identity it cannot change

An earlier prototype had a different hole. A caller could change its run ID and get past the limit.

The sums were right for each ID. The protection still failed, because a caller could pick a new ID and get a fresh budget.

In the later version, the program that starts runs (the controller) gave each run its own access key. The service read the run's identity from that key. The worker doing the run could not choose a new budget.

The worker also had no permission to call the model provider directly. Without that rule, the budget service would only be one optional route out.

I started with a money problem. The tests showed it was also a question of who is allowed to create a run.

## A failed reply does not mean the call was free

Failures needed their own rule.

Say the provider handles a request, but the reply fails before the service reads the usage. If the service releases the whole reservation, it treats unknown spending as zero.

So the service kept the reservation. A recovery test settled it later from a trusted usage record. A separate test delivered the same request and reply twice, and the spending counted once.

When no trusted usage record exists, the amount stays open. The system does not invent an exact total because a report wants one.

## What the tests proved, and what they did not

The saved logs from 17 November show twelve tests passing. Eight are acceptance tests and four cover edge cases. Between them they cover:

- a caller that changes its run ID
- twenty calls at the same time
- the same request or reply delivered twice
- a reply that never reports its usage
- a reply that fails, then recovery afterwards
- expired keys and unknown models
- failed requests and failed storage writes
- keeping every full input and storing very large replies
- token limits and dollar limits held separately
- two models with different prices, with full replies and streamed replies

Some of those tests ran against real infrastructure with planted input, such as a forced duplicate delivery or very large made-up content. Not every test was a normal live call.

The limits matter as much as the passes:

- This was development work. Nothing went to production.
- It supported two models, text and tool calls only. Anything else was refused.
- The service collected each streamed reply before passing it on. So these tests do not prove the user sees words as they arrive.
- Costs came from configured list prices, not from the final bill.
- Twenty calls at once is a test case, not proof of production scale.

## What I ask now

A spending limit is easy to write down. Whether it holds comes down to four answers:

1. Where does the next call get permission to spend?
2. Can two calls at once spend the same balance?
3. Can a caller change its identity and get a new budget?
4. What happens to money when the usage never comes back?

I now expect any spending-limit work to answer all four, with a test for each.
