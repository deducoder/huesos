---
name: story-plan
description: "Decompose a story into atomic, independently committable tasks in TDD order, with a verification per task and a final manual integration test. Use it after design (or directly for simple stories) and before implementing. Size the decomposition to the story — do not over-decompose a small story — and never write a plan whose tasks skip the failing-test-first cycle."
---

# Story — Plan

Turn the design into an ordered list of small tasks, each independently
committable and each verified by the project's gates. The plan is what keeps
implementation honest: one commit per task, tests defining behavior, riskiest
work first.

## When

- **Use:** after design, or directly for a simple, well-understood story.
- **Skip:** never — even a one-task story states its verification.

## 1 · Verify the scope exists

`scope.md` must exist in the story's work log. If it does not, **stop** and run
`story-start` — tasks decomposed without a "done when" have nothing to be
complete against.

`design.md` is **not** required here: a simple, well-understood story plans
straight from its scope (see `## When`). When a design does exist, read it —
the plan implements its approach, not a fresh one.

## 2 · Decompose into tasks

Divide into atomic, individually verifiable tasks — **one commit per task**.
Match the count to the size; over-decomposing a small story is its own waste:

| Size | Tasks |
|---|---|
| XS | 1-2 |
| S | 2-3 |
| M | 3-5 |
| L | 5-8 (consider splitting the story) |

Each task states:

- **Description** and the files it creates/modifies.
- **TDD cycle:** RED (failing test) → GREEN (minimal code) → REFACTOR.
- **Acceptance link:** the scenario it satisfies (if the design has them).
- **Verification:** the concrete gate commands for that task (tests scoped to
  the changed area, plus lint/format/types — the project's gate entry point,
  `./scripts/check`).
- **Commit message** (code-area scope, per
  [`../../conventions/git/`](../../conventions/git/convention.md): `feat(cart)…`, not
  `feat(s3.2)…` — the branch already names the story).

**Always end with a manual integration test** — validate end-to-end with the
software actually running. Unit tests alone do not prove the story works.

## 3 · Order by risk and dependency

- Map dependencies; keep the order acyclic.
- **Riskiest tasks first** — surface the unknowns while there's time to react.
- Parallelize only where there is no mutual dependency.

## 4 · Write the plan

Write `plan.md` in the story's work log
(`work/.../{scope}-{slug}/plan.md`), following the template in
[`assets/plan.md`](assets/plan.md): the ordered task list with descriptions,
files, verifications, sizes, dependencies, and the risks. It should be
reviewable in under five minutes.

Commit per the git convention: `chore({scope}): plan story`. If a tracker is
configured, move the issue to its implement status (best-effort).

## Output

- `plan.md` with atomic TDD tasks, risk-first order, a final integration test.
- Commit `chore({scope}): plan story`.

## Checklist

- [ ] Task count matches story size — no over-decomposition.
- [ ] Every task is independently committable with its own verification.
- [ ] Task commit messages use a code-area scope, not the story id.
- [ ] A manual end-to-end integration test is the last task.
- [ ] Riskiest tasks are ordered first.
