---
name: story-design
description: "Design a story before planning it: walk the actual code (gemba), reuse what exists instead of duplicating, frame the problem and value, choose the leanest approach, and — most important — write concrete runnable examples and testable acceptance criteria. Use it before planning any non-trivial story; keep it lean for simple ones but never skip the gemba walk. Design without reading the code is guessing."
---

# Story — Design

A lean spec that a human can review in five minutes and that an agent can
build from accurately. The single highest-leverage habit here is the **gemba
walk**: go read the real code before proposing changes — most wasted effort
comes from designing against an imagined codebase.

## When

- **Use:** before planning any story with real design content.
- **Lean, not skipped:** simple stories get a short version, but the gemba
  walk and the examples are never optional.

## 1 · Verify the scope exists

`scope.md` must exist in the story's work log. If it does not, **stop** and run
`story-start` — designing without the boundaries the scope draws is how a
design solves a problem nobody agreed to.

## 2 · Assess complexity

Size the design to the story: simple (1-2 components) → core sections only;
complex (5+ components, novel logic, several integrations) → full spec.

If the story touches human interaction (UX, prompts, workflows), consider a
short research pass first. If it names "integration"/"E2E"/"dogfood", at least
one acceptance scenario must run against **real infrastructure**, not mocks —
mocks cannot catch cross-component contract mismatches.

## 3 · Gemba walk (never skip)

Go to the actual code, and the rules that govern it:

1. **Read what exists** — open the files/modules this story will touch.
2. **Search for duplicates** — grep for similar functions/components before
   creating anything new. Reuse or extend; do not duplicate.
3. **Follow existing patterns** — solve it the way the codebase already does.
4. **Map dependencies** — what depends on what you'll change, and vice versa.
5. **Legacy sweep** — if this replaces something, answer explicitly: what
   existing code becomes orphaned when the new one lands? Valid answers:
   "nothing, net-new", "the existing {X} at file:line, deletion plan is Y", or
   "both coexist because Z". No implicit answers — a refactor is not done
   until the old code is swept.
6. **Consult governance** — read whatever exists under `governance/`: the
   project's own docs (guardrails, system design, ...) and any domain
   subdirectory a plugin has added (`governance/brand/`, or a future
   one) — for constraints this design must respect. Cite what applies,
   not everything that exists; a design that contradicts a stated
   guardrail with nothing catching it is the same hidden-scope problem
   `epic-review`'s scope re-verification exists to catch, one level
   earlier and cheaper to fix here than after the fact.

## 4 · Frame problem and value

- **Problem:** what gap does this fill? (1-2 sentences)
- **Value:** why does it matter? (1-2 sentences, observable or measurable)

You should be able to explain it to a non-technical person in 30 seconds.

## 5 · Choose the lean approach

State WHAT you're building and WHY this approach (not detailed HOW):
solution in 1-2 sentences, plus components affected (create/modify/delete).
Challenge every component by climbing the ladder in
[`../../reviews/architecture-review/`](../architecture-review/SKILL.md) — does it
need to exist, does the codebase / stdlib / platform / an installed
dependency already do it, can it be smaller — and stop at the first rung
that holds. What survives the ladder must still be the **MVP**: the smallest
version that delivers the value from step 4.

Two contract traps to declare explicitly when they apply:

- **Data mutations** — what happens on inputs that reference missing entities?
  Reject / skip-and-count / partial-with-warnings — never a silent drop.
- **Replacing a storage/IO mechanism** — for each public function, what did
  callers get on missing and on corrupt data *before*, and what after? Silent
  contract breaks (exception → empty, `None` → exception) are semantic bugs;
  add an acceptance criterion for each.

For a **new external dependency**, weigh supply-chain health (maintenance,
adoption, bus factor, "could we do this in <50 LOC?"). Well-known packages are
N/A. This informs, it does not hard-block.

## 6 · Write concrete examples (most important)

This drives build accuracy more than anything else. Give runnable examples
with **concrete values, real syntax** (not placeholders, not pseudocode):

1. How it's invoked (API/CLI).
2. Expected output — success **and** error cases.
3. Key data structures / types.

If you cannot write the examples, the approach is not concrete enough — go
back to step 5.

## 7 · Acceptance criteria

The scope's Gherkin is the base and stays where it is — the design records
only the **delta** the gemba walk produced: scenarios added or corrected, never
a restated copy (two copies of the same criteria drift apart). Plus:

- **MUST** — required, 3-5 specific and testable items.
- **SHOULD** — nice-to-have, 1-3.
- **MUST NOT** — explicit anti-requirements.

Every criterion is an observable outcome traceable to the value in step 4.

## Output

Write the design to the story's work log
(`work/.../{scope}-{slug}/design.md`), following the template in
[`assets/design.md`](assets/design.md): problem, value, approach, components,
decisions, examples, acceptance criteria, and the legacy-sweep answer.

If a tracker is configured, update the tracker description with the
story's scope and acceptance criteria (replacing the 1-line set at
creation) — best-effort, non-blocking (see
[`../../conventions/tracker/`](../../conventions/tracker/convention.md)).
Commit per the git convention: `chore({scope}): design story`.

## Checklist

- [ ] Gemba walk done — code read, duplicates searched, patterns followed.
- [ ] Legacy sweep answered explicitly.
- [ ] Governance consulted — applicable constraints cited, not skipped.
- [ ] Lean gates applied (KISS/DRY/YAGNI/MVP); no gold-plating.
- [ ] Concrete runnable examples cover success and error paths.
- [ ] Acceptance criteria are specific, testable, traceable to value.
