---
name: epic-plan
description: "Sequence an epic's stories into an ordered plan with milestones, putting the riskiest work first and proving the architecture early with a walking skeleton. Use it after epic design has produced the story list and before starting the first story. Skip it for a very small epic with an obvious linear order. Plans are hypotheses, not commitments — sequence by risk, never by size alone."
---

# Epic — Plan

Turn the story list into a sequence: what comes first, what runs in parallel,
and the milestones that mark real progress. The default ordering is risk-first
— you learn most from the hard parts, and you want that learning while there's
still time to react.

## When

- **Use:** after design, before the first story.
- **Skip:** a very small epic (2-3 stories) with an obvious linear order.

## 1 · Verify the scope exists

`scope.md` must exist in the epic's directory, with the story list `epic-design`
produced. If it does not, **stop** and run `epic-design` — there is no sequence
to plan before the decomposition exists.

## 2 · Sequence the stories

Order using these strategies, in priority. The deep rationale for each is in
[`references/sequencing-strategies.md`](references/sequencing-strategies.md):

| Strategy | When |
|---|---|
| **Risk-first** (default) | High-uncertainty work — tackle unknowns early |
| **Walking skeleton** | Unproven architecture — build a minimal end-to-end path first |
| **Quick wins** | Need momentum — early demonstrable value (supports risk-first, never replaces it) |
| **Dependency-driven** | Hard blockers — unblock the critical path |

Per story: position, rationale, dependencies (hard/soft/external), what it
enables. Identify what can run in parallel (no mutual dependency, different
areas). Keep the dependency graph acyclic.

## 3 · Define milestones

Two to four checkpoints, each with verifiable success criteria and a demo:

- **Walking skeleton** — smallest end-to-end path; proves the architecture.
- **Core MVP** — ~50-70% of stories; demonstrates value.
- **Feature complete** — planned stories done.
- **Epic complete** — done criteria met.

For a multi-component epic (client/server, CLI/API), schedule an **E2E
integration checkpoint** before the last story — run real infrastructure and
verify the seams between stories. Mocks cannot catch cross-story contract
mismatches.

## 4 · Write the plan

Write **`plan.md`** in the epic's work log, following
[`assets/plan.md`](assets/plan.md): the sequenced story table with its status
columns, the milestone checklist, the parallel streams, and the top sequencing
risks. Present it to the human before starting the first story.

It is its own artifact, not a section of `scope.md` — the scope is a stable
declaration, the plan is a hypothesis that changes as stories land (see
[`../../conventions/artifacts/`](../../conventions/artifacts/convention.md)). The progress table
lives here, and `story-close` updates it.

Commit `chore({scope}): plan epic`. If a tracker is configured, move the epic
to its implement status (best-effort).

## Output

- `plan.md`: order + rationale, milestones, parallel streams, progress table,
  risks.
- Epic moved to implement in the tracker (if any).

## Checklist

- [ ] Every story has a sequencing rationale; critical path identified.
- [ ] At least two milestones (walking skeleton + MVP minimum).
- [ ] Dependencies acyclic; parallel opportunities noted.
- [ ] Multi-component epic includes an E2E integration checkpoint.
- [ ] Sequenced by risk, not by size. Plans are hypotheses — don't over-plan.
