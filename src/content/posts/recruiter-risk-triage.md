---
title: "Recruiter Risk Triage: Separating Real Opportunities From Unsafe Outreach"
date: "2026-06-25"
preview: "A real LinkedIn recruiter message felt slightly off, so I checked the company, found the website did not resolve, and traced the role back to an expired job description. This is the local-first tool I built from that instinct."
readTime: "5 min read"
---

I was minding my own business on a normal day when a recruiter message came through on LinkedIn.

That happens a fair bit, so normally I would just skim it, check whether the role is remote, check the salary if it is there, and decide whether it is worth replying. But this one gave me that small feeling that something was off.

Part of the reason it stood out is because I already had a threat model in my head. There have been cases of people being sent malicious technical tests: clone this repo, run this package, install this dependency, complete this assessment. If you are actively looking for work, it is easy to treat that as normal hiring friction.

So I dug deeper.

I checked the company. I asked my AI agent to search for the company and verify the basic public evidence. The company did not show up in any credible way. The website did not resolve. The trail did not point to a live company with a real role. What the agent did find was more interesting: wording that looked like it came from an old job description that had already expired.

That changed the decision completely. I did not take it further.

That is the bit I wanted to turn into software. Not because I think every vague recruiter message is malicious, but because I have a knack for spotting when a normal-looking workflow has a security edge hidden inside it. Job hunting creates pressure. Recruiters ask for action. Technical tests can involve code execution. That is a dangerous combination if nobody pauses to verify the basics.

Some recruiter messages are real but not worth your time. Some are vague but harmless. Some are obvious scams. Some look legitimate until the assessment asks you to install a package, run a repo locally, move to Telegram, connect a wallet, or click a shortened link.

I wanted a tool that did not collapse all of that into "seems legit" or "looks suspicious".

So I built Recruiter Risk Triage.

It is a local-first agentic dashboard for deciding whether a recruiter message is worth replying to, and how to reply safely.

## The problem

Recruiter messages usually mix two separate questions:

1. **Is this real?**
   - Does the recruiter domain resolve?
   - Does the company or agency exist?
   - Is there an official job page?
   - Does the job description match a real role?

2. **Is this safe and worth my time?**
   - Are they asking me to move off-platform too early?
   - Are they pushing a shortened link or unknown assessment portal?
   - Are they asking for package installs, local code execution, wallet connections, or credentials?
   - Does the role match my salary, remote, stack, and career direction?

Those are different decisions.

A recruiter can be real and still send a risky assessment. A role can be legitimate and still be a poor fit. A fake-looking message might just be badly written but worth one clarifying reply.

The tool keeps those distinctions visible.

## What it returns

You paste the outreach into the dashboard and run a full check.

The app returns:

- a decision such as `Do not engage`, `Hold until basics are confirmed`, or `Proceed with qualifying questions`
- a safe reply that asks for the right proof without taking unsafe action
- main reasons in plain English
- opportunity read covering legitimacy, security risk, salary stance, reply focus, and open questions
- verification digest with DNS/MX, RDAP, Companies House, candidate job description evidence, official job evidence, and dates checked
- original JD recon that tries to infer the likely source job/client from title, stack, salary, location, and wording
- independent lane reports for recruiter identity, agency legitimacy, client/company, job description verification, security assessment, and reputation patterns
- collapsed raw details for audit/debugging

The output is meant to be usable, not theatrical.

If the right answer is "ask for official JD, client/company, salary range, remote terms, and confirmation there is no wallet/local-code/package-install assessment", it says that.

## How the graph works

The workflow is graph-shaped:

```text
extract_entities
→ deterministic_risk_scan
→ original_jd_recon
  ├── recruiter_identity
  ├── agency_legitimacy
  ├── client_company
  ├── job_jd_verification
  ├── security_assessment
  └── reputation_pattern
→ merge_evidence
→ final_report
```

The original JD reconstruction lane runs first as a neutral lead generator. It can infer candidate companies or public job pages, but downstream lanes only receive threshold-confident structured facts.

The lanes do not blindly trust each other. They independently verify against the original outreach and tool outputs.

The final evidence list is locked to input or tool-produced evidence. If LLM synthesis is enabled, it can write summaries, but model-invented evidence is discarded.

That boundary matters. The point is not to make an LLM sound confident. The point is to preserve which checks actually happened.

## The safety stance

The app is intentionally local-first.

It runs on `127.0.0.1`, keeps `.env` out of git, and defaults risky behaviour off.

Live URL expansion is disabled by default. When enabled, it only allows public `http/https` targets and blocks localhost, private IP ranges, link-local metadata services, non-HTTP schemes, embedded credentials, and unsafe redirects.

Assessment repo sandboxing is also disabled by default. With sandboxing off, GitHub or code-assessment links produce a no-network Docker sandbox plan and a "do not run on host" warning. With sandboxing on, the design is static inspection inside Docker with no network, read-only mounts, non-root user, CPU/memory/time limits, and no install/test script execution.

That is the product philosophy:

**Do not make risky recruiter workflows easier to click through. Make them easier to pause, verify, and answer safely.**

## Why I built it

This came from a real career workflow.

When you are actively looking at roles, you want to move quickly, but not carelessly. You also do not want to spend half an hour doing manual OSINT on every vague recruiter message.

Recruiter Risk Triage turns that messy judgement into lanes:

- what is verified
- what is only candidate evidence
- what is unknown
- what is unsafe
- what is worth asking next

That is the part I care about. The tool does not pretend to know everything. It gives a grounded next action.

Code: https://github.com/Dandiggas/recruiter-risk-triage-v1
