---
name: story-review
description: "Reflect on a finished story, extract what's worth keeping, and write the retrospective before closing. Use it after implementation is complete and the gates pass, on every story. Skipping it is the most common step-skipping failure — even a smooth story teaches something. Keep the reflection specific: vague retrospectives compound into no learning at all."
---

# Story — Review

Close the loop on the story: confirm it's really done, reflect with specifics,
and record what the next story should inherit. This is where finished work
turns into a better process instead of just a merged branch.

## When

- **Use:** implementation complete, gates green, before closing.
- **Skip:** never — even a smooth story yields a process insight.

## 1 · Verify the implementation is done

`progress.md` must exist in the story's work log and the gates must be green.
If either is not true, **stop** and finish `story-implement` — a retrospective
written mid-implementation reflects on work that has not settled yet.

## 2 · Confirm acceptance criteria, then run quality-review

Trust the end-of-story gates from step 1 (the full suite runs once at push,
not again here). Confirm the acceptance criteria themselves are met, against
the story's scope. If in doubt about a specific gate, re-run its scoped
package check rather than the full suite.

Then run the [`quality-review`](../quality-review/SKILL.md)
discipline over what the story changed — the gates are green, which is exactly
when the defects that survive are the semantic ones: a test that asserts
nothing, a type that lies, an API surface wider than the story needed. Skip
only for a story with no production-code change. Its findings feed step 3's
reflection and step 5's retrospective, so run it **before** you write them.

## 3 · Reflect (with examples)

Answer concretely, citing what actually happened:

1. What did you learn about this system or codebase?
2. What would you change about the process?
3. Estimated vs actual — where did the estimate miss, and why?
4. Any concrete improvement to a skill, convention, or template?

Apply small improvements immediately; note larger ones as follow-ups. Vague
answers ("went well") are the failure mode — be specific or it's not learning.

## 4 · Capture the learning to memory

Write the durable insights worth carrying across sessions to your persistent
memory (a fact per learning), not a project-local scoring store. This is what
future sessions recall — a reusable pattern, a pitfall, a calibration note.

## 5 · Write the retrospective

Write `retrospective.md` in the story's work log
(`work/.../{scope}-{slug}/retrospective.md`), following
[`assets/retrospective.md`](assets/retrospective.md).

Commit per the git convention: `chore({scope}): review story`. If a tracker is
configured, move the issue to its review/ready status (best-effort).

## Output

- `retrospective.md` committed with reflection and estimate delta.
- Key learnings saved to persistent memory.

## Checklist

- [ ] Acceptance criteria confirmed met; gates green.
- [ ] Reflection is specific, with examples — not vague.
- [ ] Durable learnings saved to memory for future recall.
- [ ] Never close without the retrospective.
