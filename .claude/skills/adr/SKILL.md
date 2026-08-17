---
name: adr
description: "Record an architectural decision — the forces, the options rejected, the choice and its costs — as a numbered, immutable document under records/decisions/. Use it when a decision has several valid answers and real consequences, when adopting a technology, or when other work will depend on the outcome, and after a research or spike that reached a conclusion worth keeping. Skip it for obvious or cheaply reversible choices. Never edit an accepted ADR to change your mind: write a new one that supersedes it."
---

# ADR — Architectural Decision Record

Write down *why*, while the reasons are still alive. Code shows what was
decided; only an ADR shows **what else was considered and why it lost**. Without
that, every past decision looks arbitrary and gets silently re-litigated.

## When to write one

- Several **valid** approaches with real consequences.
- Adopting (or rejecting) a **technology or dependency**.
- A decision **other work will depend on** — an interface, a boundary, a
  contract.
- The conclusion of a **research** or a **spike** worth keeping.
- A decision that was **expensive to reach** — if it cost an argument or a day,
  it will cost that again in six months.

**Do not write one for:** an obvious choice, a detail that is cheap to reverse,
or something the code already states plainly. An ADR per commit is as useless as
none at all — both mean nobody reads them.

## Structure

Follow [`assets/adr.md`](assets/adr.md). Four sections carry the weight:

**Context** — the forces and the tension between them, plus **the options and
why each fails**. This is the part most ADRs skip and the only part that is
still useful in a year. Cite the requirements and guardrails that constrained
the choice (`RF-XX`, `MUST-...`) so the reader sees what was non-negotiable.
Name what you lean on; never write its path. A work item is cited by its
tracker or local key (`b15`, `s15`, `E2`); a research report or session log —
which has no key and does not publish — by its own name and date. A path
doesn't resolve for a reader of the published page, who may never open the
repo, so the citation it was meant to be simply isn't one
([`../../conventions/docs-publishing/rules.md`](../../conventions/docs-publishing/rules.md) R5).
Naming the directory itself while describing the method — `work/`,
`work/{type}/{item}/` — is not a citation and stays legal.

**Decision** — concrete specifics, not intentions: a file, a boundary, a shape.
If part is deliberately deferred, say so and until when — a recorded deferral is
a decision, an unsaid one is an omission.

**Consequences** — positive **and negative**. An ADR with no costs listed is
selling, not deciding, and the reader stops trusting it.

**Alternatives considered** — each rejected option with the specific constraint
it violated, not a vague preference.

## Numbering and placement

`records/decisions/adr-{NNN}-{slug}.md`, sequential from the highest existing
number. **Numbers are never reused**, not even for a rejected or superseded
ADR — the gap is part of the record.

## Immutability — the discipline that makes them worth keeping

An accepted ADR is **a record of what was decided and why, at that time**. It is
not a living document.

- **Do not edit it** to reflect a change of mind. Write a **new** ADR that
  supersedes it, and set the old one's `status: superseded by ADR-{NNN}`.
- Fixing a typo is fine. Rewriting the reasoning is not — it destroys the only
  thing an ADR offers over reading the code: an honest snapshot of what was
  known at the time.

Status is one of `proposed` · `accepted` · `superseded by ADR-{NNN}` ·
`rejected`. A rejected ADR is **kept**, not deleted: "we considered this and
said no" is exactly the knowledge that stops the idea coming back every year.

## Language

The ADR is written in the **project's working language** — it is read inside the
project, like the tracker description and unlike the commit
([`../../conventions/git/`](../../conventions/git/convention.md)). Its `title` and `slug` follow
whatever the surrounding ADRs already use.

## Output

`records/decisions/adr-{NNN}-{slug}.md`, committed
(`docs({scope}): record ADR-{NNN} {slug}`). If it came from a research or a
spike, link it from that artifact's finding so the trail is walkable.

## Publish

If a docs system is connected (`tracker-bind`'s Docs space binding exists),
publish after the file is committed — never before, publish reads the
committed content, not a draft. Follow
[`../../conventions/docs-publishing/`](../../conventions/docs-publishing/convention.md):

1. Resolve the Decisions index to publish under — the epic's (`epic:
   E{N}`) if the ADR names one, Standalone's if `epic: —`. Find it by
   searching the space by title; create it from the template on a miss.
2. Publish the ADR as a child page of that index — title is the ADR's own
   H1, body is its content.
3. Append one row to the Decisions index (never rewrite the table).
4. Present the published page's URL.

No docs system connected → skip this section entirely, same as every
other best-effort tracker/docs touchpoint in the method.

## Checklist

- [ ] The decision had several valid answers — otherwise it needed no ADR.
- [ ] Context names the options **and why each lost**.
- [ ] Constraints traced to requirements/guardrails by id.
- [ ] Cross-references to other work items use their tracker/local key,
      never a git-relative path.
- [ ] Negative consequences stated, not just the positives.
- [ ] Number is the next unused one; no number ever reused.
- [ ] No accepted ADR was edited to change its reasoning.
- [ ] Published if a docs system is connected — skipped cleanly if not.
