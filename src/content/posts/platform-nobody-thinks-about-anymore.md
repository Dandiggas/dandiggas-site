---
title: "The Platform Nobody Thinks About Anymore"
date: "2026-05-28"
preview: "Platform engineering only becomes visible when it breaks. This is the story of building reusable testing, compliance and production-gating infrastructure that multiple services could adopt without reinventing the same deployment safety work every time."
readTime: "12 min read"
---

There is a category of engineering work that only becomes visible when it breaks.

Nobody notices that the compliance record was created automatically. Nobody notices that the lock file prevented two test suites from corrupting each other's results. Nobody notices the production gate checking the right staging run, until the day it does not exist and a broken build reaches production at 3am.

That is platform engineering. The better you do it, the more invisible it becomes.

Over the course of a year, I worked on internal testing and compliance infrastructure that multiple services could depend on. Not one pipeline, but shared deployment safety infrastructure that other teams could plug into with a small workflow change. This is the story of how it came together, and what I learned about building systems that disappear into the background.

---

## The Starting Point: Everyone Rolling Their Own

When I started this work, each repository had its own answer to three problems:

1. **Staging tests**: how do you prove a deployment works before promoting it?
2. **Compliance records**: how do you create an auditable record that a deployment happened, with the right approvals and metadata?
3. **Production gating**: how do you prevent a bad build from reaching production?

Some repositories had ad-hoc scripts. Some had manual checklists. Some had nothing, which is really just the "deploy and hope" model with a nicer name.

Each team had solved the same problem slightly differently. None of the solutions composed. If a new service wanted the same level of deployment safety, it had to start from scratch.

The vision was simple:

> Build reusable infrastructure so that any service can get staging tests, compliance records and production gating by adding a small amount of workflow configuration.

Make the safe path the easy path.

Getting there was less simple.

---

## Phase 1: Compliance Record Automation

The first piece was compliance automation.

Every production deployment needed a change record: change type, category, environment, approver, timestamp, release version and the right workflow transitions. Teams were creating these manually. That meant people could forget, choose the wrong values, or leave audit gaps that had to be cleaned up later.

The obvious solution was to create the change record automatically as part of the deployment pipeline.

The non-obvious problem was that enterprise APIs are often less documented than they look.

### The "No Documentation Exists" Problem

The compliance records needed specific field values and workflow transitions. The UI showed human-readable labels. The API expected internal field IDs, option IDs and transition IDs that were not obvious from the screen.

So I reverse-engineered it one API call at a time.

```bash
# Find the internal field IDs for a known record
curl -s "$ISSUE_API/example-record" | jq '.fields | keys[]'

# Discover valid workflow transitions
curl -s "$ISSUE_API/example-record/transitions" | jq '.transitions[] | {id, name}'

# Inspect valid values for a custom field
curl -s "$FIELD_API/custom-field/context" | jq .
```

This was not glamorous work. It was manual API probing: try a payload, get a 400, inspect the response, adjust the field, try again. Documentation was incomplete or wrong in places. Some values were only discoverable by comparing an existing correct record against the API response.

But that boring field-mapping work became the foundation. Every service that can now create compliant deployment records automatically depends on those mappings being correct.

### The Idempotent Key

The critical design decision was this:

> The release tag is the idempotent key.

If a pipeline retries because of a network blip or a manual re-run, it must not create duplicate change records. So the action checks whether a record already exists for that release tag. If it exists, it reuses it. If not, it creates one.

```yaml
# Pseudocode for the idempotent check
- name: Check for existing change record
  run: |
    existing=$(search_change_records "release_tag = ${{ github.ref_name }}")
    if [ -n "$existing" ]; then
      echo "record already exists: $existing"
      echo "record_exists=true" >> $GITHUB_OUTPUT
    fi
```

This sounds obvious in hindsight, but without it every retry can create another record. Every manual re-run becomes audit noise. Someone then has to manually work out which record is real.

The idempotent key makes the system deterministic: same release tag, same record, no matter how many times the workflow runs.

---

## Phase 2: The Staging Test Executor

The second piece was harder.

Staging tests needed a centralised execution system. Not just "run some tests", but a coordination layer that multiple repositories could call safely.

### The Architecture

The system had four main parts:

1. **Reusable GitHub Action**: any repository calls a shared action with its test configuration.
2. **Remote command execution**: the action triggers tests on a controlled test runner.
3. **Object storage results**: test results are written as JSON to a shared bucket.
4. **Pipeline polling**: the calling workflow polls for the result, then gates production on pass or fail.

The results bucket acts like a tiny state machine:

```text
pending -> running -> pass/fail

Key: test-results/{repo}/{run-id}/result.json
```

```json
{
  "status": "pass",
  "run_id": "abc123",
  "repo": "service-a",
  "timestamp": "2024-11-15T14:23:00Z",
  "details": {}
}
```

Any workflow can check the state of a test run by reading one known key. No shared database. No tight coupling to the executor. Just a result file in a predictable location.

### The Lock: Concurrency Control

The staging tests ran against a shared staging environment. If two test suites ran at the same time, they could interfere with each other: shared state, API responses from the wrong service version, flaky assertions.

The solution was a filesystem lock.

```bash
#!/bin/bash
# Only one test suite runs at a time
exec 200>/var/lock/staging-tests.lock
flock -n 200 || { echo "test already running"; exit 1; }

run_tests "$@"
```

`flock` is a Unix primitive. It is deterministic. It has been battle-tested for decades. No distributed lock service. No Redis. No ZooKeeper. Just a file lock on a single machine.

If the process dies, the lock releases. If the machine reboots, the lock releases. If someone kills the process, the lock releases.

Is it a bottleneck? Yes. That is the point.

The staging environment could not safely handle concurrent test suites. The lock made that constraint explicit instead of leaving it as an invisible race condition. A hidden race gives you mysterious failures. A lock gives you a queue. Once you have a queue, you can measure it and decide whether it is acceptable.

Later, I identified parallel execution as a scaling path. But for the number of services and the deployment patterns at the time, the single-lane lock was the right trade-off.

### The Midnight Commits

Getting the reusable action working across different repositories took iteration.

```text
00:15 - fix SSM command timeout handling
01:34 - add metrics for test execution
02:56 - fix polling race condition when result written mid-read
```

You do not always ship platform infrastructure during the busiest part of the day. If several teams depend on the same staging environment, you often work when it is quiet, when you can test the edge cases without blocking everyone else.

That is part of the tax on platform work. It has to feel invisible to the teams using it, which often means the messy part happens when nobody is looking.

### Metrics Before They Are Needed

I added metrics for test execution: duration, pass/fail rate and queue wait time.

Not because anyone asked for them. Because once you introduce a shared execution system, you need to know when it starts becoming a bottleneck.

If the lock becomes a problem, the metrics tell you how bad the wait time is. Without the metrics, the first signal is just people complaining that deployments feel slow.

---

## Phase 3: Secrets and Workflow Boundaries

The third piece was not a feature. It was a constraint I had to solve repeatedly.

GitHub Actions has a security model that makes shared infrastructure harder than it first appears.

### The Problem

Secrets do not pass across boundaries automatically:

- A workflow calling another workflow can pass secrets explicitly, but the called workflow cannot access the caller's secrets by magic.
- A reusable action cannot just read the calling repository's secrets unless they are passed in.
- A workflow in one repository cannot access secrets from another repository without explicit configuration.

When your platform has reusable actions that need cloud credentials, issue-tracker tokens and GitHub tokens, and those actions are called from multiple repositories with different configurations, you hit these boundaries constantly.

### The OIDC Solution

For cloud credentials, OIDC removes most of the long-lived secret problem.

Instead of storing static access keys, each workflow assumes a role using its GitHub OIDC identity:

```yaml
- name: Configure cloud credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789:role/staging-test-role
    aws-region: eu-west-1
```

The role trust policy restricts which repositories and branches can assume it. No static credentials in the repository. No key rotation burden. No shared secret copied across eight services.

The workflow identity becomes the credential boundary.

### The Cross-Account Artifact Problem

The staging test runner lived in one cloud account. Production deployments happened elsewhere. The production workflow still needed to verify that staging tests had passed.

Direct cross-account object storage access would require extra trust relationships and more security surface area. Instead, I used GitHub Actions artifacts as the intermediary:

1. The staging workflow runs tests and uploads the result as an artifact.
2. The production workflow downloads that artifact using the staging run ID.
3. Both workflows trust GitHub. Neither cloud account needs broad access to the other.

The artifact is the proof. The staging run ID is the correlation key.

---

## Phase 4: Connecting It All

Once the pieces existed, the final phase was connecting them into one flow:

```text
Deploy to staging
  -> Trigger staging tests
  -> Lock ensures exclusive execution
  -> Results written to object storage
  -> Pipeline polls for result
  -> Tests pass?
    -> YES: Create or reuse compliance record
            -> Deploy to production
            -> Run health probes
    -> NO:  Block, roll back staging, notify
```

The first full consumer was a deployment flow for a rules service. After that worked end to end, other services adopted the pattern over time. Each adoption became much smaller than the original build because the platform handled the hard parts.

That is the compounding effect of platform work. The first integration is expensive. The next one is cheaper. Eventually, teams stop thinking about the platform at all. They just call the shared action and get the safety rails for free.

---

## The Design Principles

Looking back, three principles held throughout.

### 1. Deterministic Infrastructure

The lock is deterministic: one process holds it.

The result state machine is deterministic: the result is pending, running, pass or fail.

The compliance record creation is deterministic: same release tag, same record, no duplicates.

The production gate is deterministic: the required staging test passed or it did not.

Human judgement enters at the decision to deploy. After that, the system should be automated, predictable and auditable.

### 2. Explicit Constraints Over Implicit Races

The lock makes the concurrency constraint visible.

Without it, two test suites can race silently and produce intermittent failures nobody can reproduce. The lock turns the mystery into a queue.

Same with the production gate. Without it, the constraint is "someone should check staging tests passed". That relies on memory and discipline. With a gate, the rule is enforced by code.

You cannot skip it by accident.

### 3. Compose, Do Not Couple

Each piece works independently:

- The compliance action works without staging tests.
- The staging test executor works without the compliance action.
- The production gate can work with different sources of truth: object storage, artifacts, or manual override.

That composability matters because teams rarely adopt platform infrastructure all at once. One service might start with compliance automation. Another might start with staging tests. Another might only need the production gate.

A useful platform meets teams where they are, then lets them become safer over time.

---

## What I Learned

Building platform infrastructure is a different discipline from building features.

Features are visible. Users see them. PMs demo them. Metrics track them.

Platform work is invisible by design. The better it works, the less anyone thinks about it.

That invisibility is the measure of success, but it is also the challenge. Nobody is going to notice that you spent nights reverse-engineering API field IDs so compliance records create themselves. Nobody is going to notice the lock preventing a race condition they never saw. Nobody is going to notice that pipeline retries do not create duplicate records.

The path from "everyone rolls their own" to "one platform that just works" requires someone to sit with the ugly integration problems:

- secrets that do not cross workflow boundaries cleanly
- APIs with incomplete documentation
- race conditions that only appear under load
- locks that need to be boring and reliable
- deployment gates that need to fail closed, not fail open

Not until they are "good enough". Not until they work once. Until they are deterministic, reusable and boring.

That is platform engineering.

It disappears when it works.

And multiple services deploying safely without thinking about it is the proof that it is working.

---

## Tech Stack

- **Reusable actions:** GitHub Actions composite actions, callable from multiple repositories
- **Test execution:** EC2 and AWS Systems Manager Run Command
- **Concurrency control:** `flock` filesystem lock on the test executor
- **State machine:** S3 bucket with JSON results keyed by repository and run ID
- **Compliance:** issue-tracker REST API automation with workflow transitions and custom field mapping
- **Idempotency:** release tag as deduplication key for compliance record creation
- **Secrets:** OIDC role assumption instead of long-lived credentials
- **Cross-account proof:** GitHub Actions artifacts between staging and production workflows
- **Monitoring:** CloudWatch metrics for test duration, pass rate and queue time
- **Production gate:** artifact download and result verification before promotion
