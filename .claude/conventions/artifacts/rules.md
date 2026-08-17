# Artifacts — Rules (restrictions and guards)

> Restrictions and guards that surround artifacts but are not their shape —
> that lives in `convention.md`.

## R1 — One artifact, one owner; no chained editing

Each artifact has **exactly one skill that writes it**. The rest **read** it.
The "living document" pattern, where several phases keep piling content into the
same file, is forbidden — that is what leaves an artifact such as the epic's
`scope.md` with no owner and four writers.

If a phase needs to add information, it **emits its own artifact**. If it needs
to correct another phase's artifact, that is a signal the earlier phase came out
wrong, not a licence to edit it.

## R2 — Canonical name per moment, not per type

The name is fixed by the **moment of the cycle** (the table in
`convention.md`), not by the issue type. Forbidden:

- **Per-type variants** of the same moment (`retro.md` vs `retrospective.md`).
- **Identity prefixes** in the name (`s{N}.{M}-plan.md`) — the directory path
  already supplies the identity (`../work/`).
- **Undefined names** — if a skill emits an artifact, it names it. An unnamed
  "progress log" is an artifact nobody can find.

## R3 — A single allowed cross-write: the epic's progress

`story-close` updates the **tracking table in the epic's `plan.md`** when it
closes a story. That is the **only** write outside the work item's own
directory, and it is bounded to that table.

Anything else a closing skill believes "needs fixing" in someone else's
artifact is **reported as a finding**, not edited (consistent with the scope
restrictions on `story-close` and `bug-close` in `../../skills/`).

## R4 — Shared documents: append only, entry owned by its author

`records/parking-lot.md` is a shared doc by design: several skills **add** entries
when they defer work. The rule is **append-only** — each entry is owned by
whoever wrote it, with its origin and its promotion condition; nobody rewrites
someone else's entries.

## R5 — Brownfield exception: merge into guardrails

`project-onboard` **merges** the conventions it detected from the code into
`governance/guardrails.md`, instead of creating the doc from scratch. It is the
only update to an existing doc that the convention allows by design, and it has
its own guard: it **never overwrites** the detected conventions — they are the
truth about how that codebase already works.

## R6 — Artifacts are versioned in the repo

They go into git alongside the work (already in `../work/rules.md` R3). They are
not temporary and they are not ignored. An artifact that is not committed is an
artifact lost in the merge.

## R7 — Template ≠ artifact

The template lives in `assets/` of the emitting skill
(`../authoring.md`); the artifact lands in `work/`
(`../work/convention.md`). The two are never conflated: the template is
consulted and does not change, the artifact is produced per work item.

This rule governs **artifacts only**: a written, versioned,
single-owned output. An artifact's template of ~5 lines → **inline in
the `SKILL.md`**, with no separate file; past that, `assets/`. A different
kind, the **presented output** — never written to a file, rendered to the
human as the skill's result — is always inline, under `## Output`,
regardless of length; this threshold does not apply to it.

## R8 — A deferral marker names its ceiling and its trigger

A `parked:` marker (see `convention.md`) is a deliberate simplification, not
a TODO: it names the **ceiling** it accepts and the **trigger** that revisits
it. At harvest, a marker with no trigger is flagged `no-trigger` — a deferral
without a revisit condition is how "later" becomes "never".

The harvest is a **report**: it never edits `records/parking-lot.md` (R4 stays
append-only) and never rewrites markers. Promoting a marker into a parking-lot
entry, a backlog item, or a fix is a decision its finder makes explicitly.
