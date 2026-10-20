---
title: "I Typed 'I Told You' 117 Times. Then I Stopped Writing Rules for My AI Agents."
date: "2026-10-20"
preview: "I scanned 1,754 sessions and 4,701 of my own prompts across two months. Written rules in a markdown file did not stop my agents from skipping skills, starting edits before design sign-off, or burning frontier tokens on lookups. Here is how I replaced text rules with deterministic code guards."
readTime: "6 min read"
---

I keep one shared rule file (an operating contract) for every AI coding tool I run. Each time an agent skipped a step in my workflow, I added a new line to that file.

This week I audited two months of my own session logs to measure whether those written rules worked. I scanned 1,754 sessions and 4,701 prompts that I typed by hand between 18 August and 18 October. I excluded automated scheduled jobs (cron runs) so the numbers only reflect interactive engineering work.

The data showed clear friction. I typed "again", "I said", or "I told you" in 117 prompts. I asked the agent to open a file or diff it had just created in 159 prompts. I asked for plain-language explanations or tables in 115 prompts.

Adding more text rules did not reduce the repeat corrections. On 8 October I added a prompt hook that told the agent to confirm the plan before starting a multi-file change. After that date, I still had to type "clarify intent" by hand 10 more times. When I added a written rule to present trade-offs in a table, my manual requests for a table still rose from 7 in August and September to 21 in October.

A written rule is a reminder. A reminder is just text inside the working memory (context window) that the model can ignore. A code guard (a runtime plug-in, called a mod in Claude Code) runs outside the model and enforces the boundary in code.

## Four workflow gaps that text rules could not close

When I grouped the session logs, four engineering problems stood out.

**1. Skipping workflow skills.** My rules say to load my plain-English explainer skill (`explain`) when I ask for a simple breakdown, and my code-style skill (`readable-code`) before editing code. Across 451 sessions, `explain` loaded 0 times out of 35. `readable-code` loaded 0 times out of 29. My real prompts use shorthand like "English" or "red first" (plus voice-dictation mishears from Wispr Flow), which did not match the formal descriptions in the skill headers.

**2. Starting code edits before design sign-off.** On larger builds, I want the agent to state the goal, list the affected files, and wait for my confirmation before touching the repository. A markdown instruction to wait works most of the time, but when a model is confident it calls file-edit tools in the same turn as its plan.

**3. Enforcing approval boundaries on outward tools.** My agents have tools to draft emails, prepare pull requests, and manage project tickets. In a safe agent platform, the boundary between preparing a draft and executing an outward action (`git push`, creating a pull request, or sending a message) must live in the tool runner, not in the model's system prompt.

**4. Using top-tier models for routine lookups.** In a separate pass across 9,579 total sessions, I measured which tasks actually needed a top-tier reasoning model (a frontier model). Only 22% of my interactive Claude Code sessions and 17% of my Codex sessions required frontier reasoning. About 51 million of 110 million output units (tokens) on top-tier models went to status checks, ticket lookups, and read-only file searches.

## Replacing text rules with deterministic code guards

Instead of writing longer rules, I built 13 small code guards (Claude Code mods) that sit between the prompt, the model, and the tool runner. Each guard intercepts either the prompt I submit (`prompt.submit`), the sub-agent spawn (`agent.spawn`), or the tool the agent tries to run (`tool.call`).

### 1. Rotating the active skill menu and routing by real phrases (`skill-router` and `readable-code-guard`)

My full skill library holds over 300 skills in a central index (`~/.agents/skills/`). Loading all of them at startup would overflow the tool's description budget and hide the descriptions of the bottom skills. Instead, a weekly usage scanner (`skills-usage-scan.py`) reads 30 days of session logs across all my agents and syncs only the active tier into each harness, while everything else stays lazy-loadable from the library index.

To fix the 0-out-of-35 trigger miss on active skills, I built a word-to-skill lookup table (`skill-routes.json`) from the exact phrases in my session logs, including voice-dictation mishears from Wispr Flow (such as "ScalaDraw" for Excalidraw and "Brimble" for Brim). That lookup table alone matched 45% of my real prompts, up from 29%.

The `skill-router` guard runs on every prompt I type:

1. Match the prompt against the word-to-skill table first.
2. If no word matches and the prompt has 6 or more words, ask a small, fast model (Haiku) to classify the prompt against my active skill list.
3. Attach the full text of the matched skill (`SKILL.md`) to the prompt once per session, and send a one-line reminder on later turns.

For coding repositories, I paired the router with `readable-code-guard`. That guard blocks file modifications (`Edit` and `Write` tool calls) inside my main project repositories until `skill-router` has attached the `readable-code` skill to the session.

### 2. Locking outward actions in the tool runner (`send-gate`)

The `send-gate` guard watches every command that writes outside my local workspace. It checks `git push`, GitHub and GitLab pull-request or comment commands (`gh` and `glab`), email send endpoints, and messaging tools.

When I submit a prompt, the guard records my exact words and verifies that the prompt came from the interactive keyboard (`origin.kind === "composer"`). When the agent calls an outward tool, the guard checks whether my latest prompt contains an explicit action verb like `send`, `post`, `push`, or `publish`.

One detail mattered in testing. A prompt like "draft a reply" or "update the comment" uses those words as nouns, not as an order. So the guard strips noun phrases (`a reply`, `the comment`, `draft post`) before checking for the action verb:

```ts
const IMPERATIVE = /\b(send|post|push|publish|reply|comment|ship|merge|delete)\b/i
const AS_A_NOUN = /\b(a|an|the|my|your|his|her|their|draft)\s+(reply|comment|post)\b/gi

export function saidSend(text: string): boolean {
  return IMPERATIVE.test(text.replace(AS_A_NOUN, ''))
}
```

If my prompt did not authorise the action, the guard denies the tool call and instructs the agent to present the exact payload for review first. If the guard itself throws an error, its error handler (`.catch`) fails closed and denies the call.

### 3. Protecting project and audio files during clean-ups (`delete-guard`)

The `delete-guard` plug-in inspects every shell command (`Bash` tool call) before execution. It splits chained commands on `&&`, `||`, `;`, and `|`, and extracts every file path passed to `rm`, `trash`, `find -delete`, or a move to `.Trash`.

Deleting temporary build artifacts inside `/tmp`, `scratchpad`, `node_modules`, or `dist` passes straight through. If a target path is an audio session file (`.als`, `.logicx`, `.flp`, `.ptx`, `.wav`) or any file modified in the last 7 days, the guard blocks the command unless my latest prompt explicitly authorises deletion.

### 4. Enforcing plan sign-off and routing sub-agents (`go-gate` and `cheap-fanout`)

The `go-gate` plug-in turns my plan-confirmation rule into a state machine. When a prompt asks for a multi-file build or refactor, the guard locks write tools until my next message confirms the plan (`go` or `yes`). Direct answers and small lookups pass straight through without friction.

Alongside it, `cheap-fanout` intercepts sub-agent launches (`agent.spawn`) and routes read-only search and exploration workers to smaller models (Sonnet or Haiku) by default, reserving the frontier model for architecture and multi-file implementation.

## How I verified the guards

Each guard has its own automated test suite (`*.test.ts`) that mocks the file system and tool runner, plus strict TypeScript verification (`tsc`) and plug-in schema validation (`claude plugin validate`).

Because unit tests only prove the logic in isolation, I also verified the guards inside a live interactive terminal session (`tmux`):

- **`skill-router` and `readable-code-guard`:** Typing a single word, "English", in a fresh session attached the `explain` skill automatically. Attempting an unguided edit in my main repository was blocked until `readable-code` loaded.
- **`send-gate`:** Asking the agent to prepare a GitHub issue blocked `gh issue create` at the tool boundary and returned the draft text to the terminal instead.
- **`delete-guard`:** Asking the agent to tidy a folder containing a test `song.als` project file blocked `rm` and left the file intact on disk.
- **`go-gate`:** Submitting a multi-step build prompt displayed the status band (`Waiting for your go`) and held tool execution until I replied `go`.

Live testing also caught two integration bugs that unit tests missed. First, my reply-watcher command `/watch` collided with an existing skill of the same name, so I renamed the command to `/track`. Second, the status-pane check for my local model server (`lms`) failed because that CLI writes its status output to the error stream (`stderr`) instead of standard output (`stdout`). Both fixes now have regression tests that fail when the bug is present.

## Current limits

Code guards only protect the boundaries they can observe:

- **Cross-harness support varies.** Claude Code runs these guards in process. Codex and Hermes do not have a plug-in mod runner, so they receive the shared skill-routing table via a prompt pre-processor (`clarify-intent.py`) rather than in-process tool locks.
- **Shell writes can bypass the edit tool check.** The `readable-code-guard` intercepts `Edit`, `Write`, and `NotebookEdit` tool calls, but it does not parse arbitrary file redirection inside `Bash` commands.
- **Four workflow helpers remain in soak testing.** The automatic file opener (`auto-open`), `/away` mode (`hands-off`), the `/phone` note exporter, and the status-bar watcher (`replies-band`) pass their test suites and are running in daily use this week.

## The rule I use now

If I have to write the same instruction twice, it does not belong in a prompt file. A prompt tells the model what you prefer. A guard defines what the system allows.
