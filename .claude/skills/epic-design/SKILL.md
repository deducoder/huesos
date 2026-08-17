---
name: epic-design
description: "Design an epic: walk the actual codebase (gemba at epic scale), make the architectural decisions worth recording as ADRs, and break the work into 3-10 independently deliverable stories under explicit scope boundaries. Use it after starting an epic and before planning its sequence. It bridges a strategic objective to executable stories — go see what exists and cut what doesn't serve the objective; never decompose from imagination."
---

# Epic — Design

Turn the objective into a bounded set of stories, informed by the real code.
This is the gemba walk at epic scale: read what exists, decide the few things
that need deciding, and decompose only what serves the objective.

## When

- **Use:** work spanning 3-10 stories, after `epic-start`.
- **Skip:** single-story work (story design); a bug (bug flow). High
  uncertainty → research first.

## 1 · Verify the brief exists

`brief.md` must exist in the epic's directory. If it does not, **stop** and run
`epic-start` — the brief holds the hypothesis and the appetite this design has
to stay inside.

## 2 · Frame the objective

From the brief, state:

- **Objective** — the business/user outcome (1-2 sentences, outcome-focused).
- **Value** — what's unlocked when it's done.

## 3 · Gemba walk (never skip)

Go to the actual code before proposing stories:

1. Read the modules this epic will touch.
2. Search for existing implementations — do not propose a story that
   duplicates what exists; reuse or extend.
3. Follow the codebase's established patterns; consistency over novelty.
4. Map the real dependencies — what imports what, what breaks if you change X.

If existing code is over-engineered, consider a *simplification* story rather
than building on top of it.

## 4 · Architectural decisions (ADRs)

Record an ADR when there are multiple valid approaches with real impact, new
technology, or a decision other epics will depend on. Skip when the pattern is
established or the choice is cheap to change. One decision per ADR — see the
[`adr`](../adr/SKILL.md) technique for the structure and the
immutability rule. If uncertainty is high, research first (timeboxed), then
decide.

## 5 · Break down into stories (MVP mentality)

Decompose into 3-10 independently deliverable stories. Apply the lean gates:

- **KISS** — each story does one thing; if it takes >2 sentences to explain,
  split it.
- **YAGNI** — only stories that serve the objective; "nice to have" → parking
  lot.
- **DRY** — a story that duplicates existing functionality is removed or
  reframed as an extension.
- **Everything is an MVP** — each story is the simplest version that proves
  value.

Per story: id, name, 1-line description, size (XS/S/M/L), dependencies. Target
1-5 days each, no dependency cycles. **Waste check** per story: "if we don't
build this, does the epic still meet its objective?" If yes, defer it.

From **the decomposition** just produced — not the brief, which deliberately
holds no in-scope list (ADR-004, the brief holds constraints only; recorded
in gemba's own repository under `records/decisions/`) — state:

- **In scope** (MUST / SHOULD) vs **Out of scope** (with rationale and where
  deferred work goes), staying inside the brief's **no-gos** and **appetite**,
  which are the constraints this decision may not overturn.

Defer what doesn't block the objective; split out what needs its own ADR.

## 6 · Done and risks

- **Done when:** all stories complete + measurable epic criteria + docs updated
  + retrospective done.
- **Risks:** top 3 with likelihood / impact / mitigation.

## Output

Write two artifacts in the epic's work log, following their templates:

- **`scope.md`** (WHAT + WHY) — objective, stories, boundaries, done criteria.
  [`assets/scope.md`](assets/scope.md). **This skill owns `scope.md`** — it is
  created here, not by `epic-start` (which owns only `brief.md`), and nobody
  else edits it: the plan lives in `plan.md` and progress in its table (see
  [`../../conventions/artifacts/`](../../conventions/artifacts/convention.md)).
- **`design.md`** (HOW) — gemba findings, target components, key contracts.
  [`assets/design.md`](assets/design.md). Short for simple epics, never absent.

Capture deferred items in `records/parking-lot.md`.

If a tracker is configured, update the tracker description with the full
scope (replacing the 1-line set at creation), **without listing child
stories** — the parent link already expresses them — best-effort,
non-blocking (see
[`../../conventions/tracker/`](../../conventions/tracker/convention.md)).

Commit: `chore({scope}): design epic`.

## Checklist

- [ ] Gemba walk done — code read, no duplicate stories proposed.
- [ ] Objective is outcome-focused; scope boundaries explicit.
- [ ] Lean gates applied; every story passes the waste check.
- [ ] 3-10 independently deliverable stories, dependencies acyclic.
- [ ] Both scope.md and design.md produced; ADRs for real decisions.
