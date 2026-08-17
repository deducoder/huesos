---
name: epic-review
description: "Reflect on a finished epic before it ships: confirm every story is actually done, run quality-review across the whole merge range, re-verify the scope item by item against the code, and write the retrospective. Use it after all stories are merged, before epic-close. Never trust 'all stories checked ⇒ scope fulfilled' — that re-read happens here, not at close. Mirrors story-review/bug-review; epic-close depends on this having already run."
---

# Epic — Review

Close the reflection loop before `epic-close` ships anything: confirm the
epic is actually finished, catch what only shows up across the whole merge
range, re-verify the scope against the real code, and write the
retrospective. This is the same review/close split `story-review`+
`story-close` and `bug-review`+`bug-close` already use — applied to epics
too, not a new shape.

## When

- **Use:** all stories merged, before `epic-close`.
- **Skip:** never — even a smooth epic yields a process insight no single
  story's retrospective could show on its own.

## 1 · Verify every story is actually done

Confirm every story the epic's `scope.md` lists shows `done` in the
**progress table of `plan.md`** (where `story-close` reports completion) —
not just merged, actually reported done, or explicitly `dropped` with a
documented reason. If any is still `todo`/`doing`, **stop** and resolve it
first — reviewing an epic that is still moving reflects on a shape that
hasn't settled.

## 2 · Run quality-review at epic scope

Run the [`quality-review`](../quality-review/SKILL.md)
discipline across the **whole merge range**, not one story's diff. Each
story reviewed its own code in isolation; what only shows up here is what
emerged *between* them: an API surface that widened one story at a time, a
type that stayed honest per story and lies across the seam, tests that each
pass while none covers the path the stories share. Skip only for an epic
with no production-code change. Its findings feed step 3.

## 3 · Re-verify the scope, item by item

**Re-read `scope.md` item by item** against the observable state of the
code — "all stories done" is never the same claim as "scope fulfilled."
This step exists because "the tests passed and the tools shipped" has
hidden scope that was never delivered; the re-read is the only thing that
catches it. Pay special attention to elimination commitments ("remove X",
"replace Y", "consolidate A and B"); for each, answer explicitly:

- **Fulfilled** — cite the commit/file showing it.
- **Descoped** — say why, and link the work item that now owns it.
- **Not fulfilled** — **stop.** Finish it or explicitly re-scope before
  continuing.

This is read-only against `scope.md` — nothing here edits it.

## 4 · Reflect, then write the retrospective

Answer concretely, citing what actually happened, synthesized from the
story retrospectives (not restated one by one):

1. What did the epic teach about this system, at a scale no single story
   could show?
2. What would you change about how the epic itself was run?
3. Metrics: stories, estimated vs. actual sizes, what surfaced mid-epic
   that wasn't planned.
4. Capability gained — what the method or the team can now do that it
   could not before.

Write `retrospective.md` in the epic's work log, following
[`assets/retrospective.md`](assets/retrospective.md) — it carries the step
3 scope re-verification alongside the reflection above.

## 5 · Capture the learning to memory

Write durable cross-epic insights to persistent memory (a fact per
learning), the same way `story-review`/`bug-review` already do — this is
what future epics recall.

## 6 · Commit

Commit per the git convention (`chore` — process metadata):

```
chore({scope}): review epic
```

If a tracker is configured, move the epic to its review/ready status
(best-effort).

## Output

- `retrospective.md` committed: scope re-verified item by item, metrics,
  reflection, learnings.
- Key learnings saved to persistent memory.

## Checklist

- [ ] Every story confirmed `done` in `plan.md`'s progress table, not
      assumed from "all merged."
- [ ] Quality-review run at epic scope (or skip justified: no
      production-code change).
- [ ] Scope re-read item by item; elimination commitments resolved.
- [ ] Reflection is specific, with examples — not vague.
- [ ] Durable learnings saved to memory.
- [ ] Never let `epic-close` run without this first.
