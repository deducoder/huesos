---
name: story-implement
description: "Execute the plan task by task in strict TDD (RED failing test, GREEN minimal code, REFACTOR), running the quality gates after each task, committing each independently, and pausing for human review between tasks. Use it after the plan exists. Never commit without the fast gate check, never skip a failing test, and stop the line on any defect rather than accumulating errors."
---

# Story — Implement

Build the story one planned task at a time, each in RED-GREEN-REFACTOR order,
each gated and committed on its own. The discipline exists so that every commit
is green and every step is reviewable — small, verified increments beat one
large drop.

## When

- **Use:** the plan exists with atomic tasks.
- **Skip:** never — follow the plan even when a task looks trivial.

## 1 · Verify the plan exists

`plan.md` must exist in the story's work log. If it does not, **stop** and run
`story-plan` — implementing straight from a design is how a story loses its
task boundaries, and with them every commit that was supposed to be
independently reviewable.

The one exception: the human explicitly approves working without a plan for a
story small enough not to need one. Record that approval as the first line of
`progress.md`, so the skip is a decision on the record rather than a gap.

## 2 · Orient

Load the plan. Read the code the story touches (grep for the symbols and
callers involved) so you build on what exists rather than reinventing it. If a
design doc exists, restate its intent in 2-3 sentences and confirm with the
human before starting — one unvalidated assumption can waste a whole task.

## 3 · Run each task RED → GREEN → REFACTOR

For the next task in plan order:

1. **RED** — write a failing test that defines the expected behavior.
2. **GREEN** — write the minimal code to make it pass.
3. **REFACTOR** — clean up while keeping every test green.

Follow the project's rules and established patterns.

## 4 · Gate after each task (fast check)

Run the project's gate entry point — **`./scripts/check`** (lint, format, types,
unit tests; see the gate contract). It is deliberately fast, so running it after
every task costs seconds. A task is not done until it passes. On failure: fix and
re-run; after ~3 attempts, stop and escalate with the partial state documented.

## 5 · Commit and checkpoint

Commit the task with its planned message (code-area scope, per
[`../../conventions/git/`](../../conventions/git/convention.md)). Append the task to
**`progress.md`** in the story's work log, following
[`assets/progress.md`](assets/progress.md) — what was done, the gate results,
and anything the plan didn't anticipate. This write is independent of the
checkpoint below — an instruction to skip pauses between tasks does not
waive it; only the checkpoint itself is what such an instruction can skip.
Then show the human what changed and wait for acknowledgment before the
next task.

## 6 · Finalize

When all tasks are done:

- Run the full gate set once more for the changed package(s).
- **Orphaned-test check (stop-the-line):** find test files that import from
  the modules you changed but were not touched by this story. For each, read
  it and either update it or confirm it still passes. Do **not** finish with
  orphaned tests unresolved — this is exactly how regressions slip through.
- Confirm the story's acceptance criteria are met end to end.
- If a tracker is configured, move the issue to its review status.

## Output

- Code committed task by task on the story branch, every gate green.
- `progress.md` updated; orphaned-test check clean; acceptance criteria met.

## Checklist

- [ ] RED-GREEN-REFACTOR per task; no task committed without the fast check.
- [ ] A failing test is never skipped — fix it or escalate.
- [ ] Stop on the first defect; never accumulate errors (Jidoka).
- [ ] Orphaned-test check clean before finishing.
- [ ] Human acknowledged each task before the next.
