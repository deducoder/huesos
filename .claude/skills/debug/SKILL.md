---
name: debug
description: "Find the root cause of a defect you hit mid-work — a failing test, unexpected behavior, an integration problem — with a time-boxed, tiered analysis (5 Whys for a single causal chain, Ishikawa for multiple causes), then fix the cause and feed the tasks into the current plan. Use it in the flow, when something breaks and spinning up the formal bug pipeline would be overkill. For a tracked bug with its own branch and lifecycle, use the bug flow instead. Skip an obvious typo — just fix it. Never guess: hypothesis first, then test; 'human error' is never a root cause."
---

# Debug (in-flow)

Quick, disciplined root-cause analysis for when something breaks while you're
in the middle of something else. Time-boxed, so you don't rabbit-hole; feeds
its fix straight into the plan you're already working. **Stop fixing symptoms
— find the true cause.**

This is the lightweight, standalone path. For a formally tracked bug (its own
branch, scope, 7-phase lifecycle) use the [bug flow](../../bug/); the fuller
signal-based method-selection table lives in
[`bug-analyse`](../bug-analyse/SKILL.md).

## When

- **Use:** a defect surfaces mid-work and you want a fast diagnosis without the
  full bug pipeline.
- **Skip:** an obvious typo/syntax error — just fix it. A tracked bug → bug
  flow.

## 1 · Triage — tier and time-box

Classify before choosing a method, and respect the box (escalate if exceeded):

| Tier | Criteria | Method | Time-box |
|------|----------|--------|:--------:|
| XS | Cause evident, fix obvious | skip to step 4 | 5 min |
| S | Cause obscure, single causal chain | 5 Whys | 15 min |
| M/L | Multiple possible causes | Ishikawa | 30-60 min |

## 2 · Reproduce (genchi genbutsu)

Go see it. Capture `WHAT / WHEN / WHERE / EXPECTED`. Can't reproduce yet →
gather logs, add instrumentation, or build a minimal fixture first — you can't
trust a fix for something you haven't seen fail.

## 3 · Find the root cause

- **S · 5 Whys** — ask "why?" along one factual causal chain until you reach
  something actionable and changeable. Each answer evidenced, not guessed.
- **M/L · Ishikawa** — explore the 6 M's (Method, Machine, Material,
  Measurement, Manpower, Milieu / env & config drift), pick the top 2-3
  hypotheses, and test each:

  | Hypothesis | Test | Result | Conclusion |
  |---|---|---|---|
  | {cause} | {how tested} | {found} | confirmed / eliminated |

**"Human error" is never a root cause** — ask why the error was possible; that
answer is the real cause.

## 4 · Fix, test, prevent

Fix the confirmed root cause, not the symptom. Regression test first
(RED → GREEN), then confirm the original problem no longer reproduces and the
suite stays green. Add prevention where it fits: input validation at the
boundary, a doc/ADR note, and — for a recurring systemic issue — save the
learning to persistent memory so future sessions recall it.

## 5 · Feed the plan

Name the resulting tasks — fix, regression test, prevention — into the plan
you're working (`story-plan` or `bug-plan`). Debug diagnoses; the plan
carries the work.

## Output

By tier: **XS** → one-liner in the commit message (not an artifact, nothing to
name). **S, M and L** → `work/debug/{name}/analysis.md`, following
[`assets/analysis.md`](assets/analysis.md) — `debug` writes its own artifact
and never into the work item's `progress.md`, which belongs to
`*-implement` / `*-fix`. Size the depth to the tier; the destination does not
change with it.

## Checklist

- [ ] Tier declared and time-box respected — escalate if exceeded.
- [ ] Problem specific and reproducible before analysis.
- [ ] Root cause evidenced, not speculated; "human error" never accepted.
- [ ] Fix hits the root cause; regression test RED→GREEN.
- [ ] Resulting tasks fed into the current plan.
