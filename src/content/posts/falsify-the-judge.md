---
title: "Falsify the judge before trusting the eval"
date: "2026-07-27"
preview: "An LLM judge can give you a green evaluation without proving it can recognise a bad answer. So I added a tier to my eval harness that has to fail before it's allowed to pass."
readTime: "3 min read"
---

An LLM judge can give you a green evaluation without proving that it can recognise a bad answer.

That is a dangerous kind of green.

This week I added a fifth tier to my skill evaluation harness. It sits between trigger tests and golden tests, and its job is to falsify the judge before the judge is allowed to score real outputs.

## The calibration test

For each rubric-based skill, the real judge sees two fixtures:

1. a known-good answer
2. a plausible but wrong answer

The judge only calibrates if it scores the good answer at 8 or above and the wrong answer at 3 or below.

If it cannot separate them, the golden tests are skipped. An uncalibrated judge does not get to certify the system.

## The first five skills

I wired the tier into five semantic skills:

- LinkedIn post: good 8 to 9, wrong 2
- X post: good 9, wrong 1
- graph generation: good 9, wrong 1
- video vetting: good 9, wrong 1
- job application: good 9, wrong 1

All five calibrated.

That was still only a green run, so I forced a red one.

I pointed a fail fixture at the known-good post. The judge scored it 9. The calibration tier correctly failed and the command exited 1.

That red run mattered more than the green dashboard. It proved the gate could catch a judge that accepted the wrong fixture relationship.

## Hardening the judge input

I also treated the target output as hostile input.

The output is now delimited and length-bounded. The judge is explicitly told to ignore instructions embedded inside it. A generated answer should not be able to influence its own score by telling the evaluator what verdict to return.

The harness now has a stricter rule:

A verifier is not trustworthy because it passes good work. It is trustworthy only after it demonstrably rejects plausible wrong work too.
