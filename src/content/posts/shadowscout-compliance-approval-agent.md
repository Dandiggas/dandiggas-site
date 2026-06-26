---
title: "ShadowScout: Sending the Scout Before Another AI Tool Gets Adopted"
date: "2026-06-26"
preview: "A hackathon build for shadow AI approvals: Tavily searches vendor evidence, Gemini extracts claims, deterministic policy rules make the decision, and ClickHouse-shaped audit rows preserve the trail."
readTime: "5 min read"
---

I built ShadowScout at the Multiagents Hackathon in London because the problem is obvious now: AI tools are entering companies faster than security and legal teams can review them.

Someone wants to use Cursor. Someone else wants Granola for meeting notes. Another team tries a browser agent, a transcript tool, or a local desktop recorder. The question is not just "is this tool good?" The real question is:

**Can this tool touch our source code, customer data, internal meetings, or browser state without creating a risk we cannot explain later?**

Most teams answer that by manually reading privacy policies, security pages, DPA wording, SOC2 claims, pricing pages, docs, and forum posts. Or worse, they ask an LLM for a general opinion and get something that sounds confident but has no audit trail.

ShadowScout is my attempt at a better first pass.

## What it does

An employee requests approval for an AI tool. The company provides its policy and the intended data/use case.

ShadowScout then:

- plans searches from the company policy and missing evidence types
- uses Tavily to find vendor security, privacy, terms, docs, pricing, and news sources
- fetches and classifies those sources
- uses Gemini to extract structured compliance claims
- rejects claims when the quoted evidence is not present in the source text
- maps the findings against deterministic company-policy rules
- produces an approve, conditional approve, review, or reject decision
- writes a cited report, evidence JSON, agent trace, and ClickHouse-ready audit rows

The important boundary is deliberate:

**The LLM gathers and structures evidence. Deterministic policy rules make the approval decision.**

That keeps the product away from "the model vibes this is safe" and closer to "here is the evidence, here is the rule, here is the decision."

## Why this is not just ChatGPT

ChatGPT can give a decent answer if you ask whether a tool is safe. But security approval is not just about a decent answer.

You need to know:

- which sources were checked
- which quote supports each claim
- whether the quote actually exists in the fetched source
- which company requirement passed or failed
- why the score changed
- what usage is allowed and what is blocked
- what controls would make a rejected tool approvable
- what changed when the tool is reviewed again next month

ShadowScout outputs that as an approval packet.

A typical report includes:

- executive verdict table
- requirement matrix
- evidence citations
- score reasons
- scoped approval profile
- compliance roadmap
- ClickHouse-shaped rows for runs, sources, risk claims, and verdicts

That last part matters because security decisions need history. A good approval workflow should be queryable later.

## The demo shape

The hackathon demo scans tools like Cursor and Granola against a security-sensitive company policy:

```text
Requires SSO/admin controls, no training on customer data, DPA availability,
deletion/retention controls, and SOC2 or equivalent preferred.
```

The interesting outcome is not simply "approve" or "reject".

Cursor can be conditionally approved for restricted use when the relevant controls are documented. Granola gets flagged higher-risk for sensitive meeting transcript workflows unless admin, retention, DPA, and data-use controls are confirmed.

That is the real product shape:

```text
Allowed:
- restricted rollout after required controls are documented

Blocked:
- unmanaged source-code repositories
- secrets or production credentials

Required controls:
- retain evidence packet
- named reviewer accepts conditions
- rescan periodically
```

This is the difference between a generic AI answer and a usable security workflow.

## The monitoring piece

Approving a tool once is not enough.

Vendor policies change. Security pages change. Company policy changes. A tool that was acceptable last month may become a re-review item after new wording, new product behaviour, or a new use case.

So ShadowScout also has a weekly review path for approved or conditionally approved tools. It compares the saved decision to the current scan and produces a drift summary:

```text
Previous verdict: approve
Current verdict: conditional approve
Action: drift detected from saved decision
```

For me, that is the stronger product angle. It turns one-off vendor review into a control loop.

## What I would improve next

The prototype works, but it is still a prototype.

The next improvements are clear:

- live ClickHouse ingestion instead of generated SQL files
- canonical vendor-domain allowlists so unrelated sources cannot satisfy controls
- stronger source trust labels for vendor docs vs third-party commentary
- better policy templates for engineering, sales, HR, and meeting tools
- clearer UI around allowed use, blocked use, and required controls

But the core pattern feels right:

**Before your team installs another AI tool, send the scout first.**

Demo: https://www.loom.com/share/50c79eb38158418e94ad1d94564655e4

Code: https://github.com/Dandiggas/shadow-ai-scout
