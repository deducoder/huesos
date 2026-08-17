# Artifacts — Convention

> Artifact conventions — what each skill emits, what it is called, and who
> owns it. Where those files live is set by `../work/`; what each skill does is
> defined by `../../skills/`. Restrictions and guards live in `rules.md`.

## The two principles

1. **Every phase its own file.** Each moment of the cycle emits **its own**
   artifact. A document shared across phases is never edited in a chain.
2. **One moment, one name; one artifact, one owner.** The name derives from the
   **moment of the cycle**, not from the issue type — the same moment never has
   two names. And each artifact has **exactly one skill that writes it**; the
   rest read it.

The content **does** vary by type (an epic's `scope.md` looks nothing like a
bug's). It is the name and the owner that are unified, not the content.

**Both tables below list artifacts only** — written, versioned outputs. A
skill's **presented output** (a review's findings, `integrate`'s result)
appears in neither: it is never written to a file, so it has no path and no
owner row here. Being outside the canonical table does not make
something a presented output, either — `debug`'s `analysis.md` is a file
artifact and still lives in the second table below, not the first.

## Canonical table — name, owner and types

| Moment | Artifact | Owner (single writer) | epic | story | bug | spike |
|---|---|---|---|:---:|:---:|:---:|:---:|
| Definition / bet | `brief.md` | `epic-start` | ✓ | — | — | — |
| Scope and done when | `scope.md` | `epic-design` · `*-start` | ✓ | ✓ | ✓ | ✓ |
| Classification | `triage.md` | `bug-triage` | — | — | ✓ | — |
| Root cause analysis | `analysis.md` | `*-analyse` · `debug` | — | — | ✓ | — |
| Design | `design.md` | `*-design` | ✓ | ✓ | — | — |
| Task plan | `plan.md` | `*-plan` | ✓ | ✓ | ✓ | — |
| Execution | `progress.md` | `*-implement` · `*-fix` | — | ✓ | opt. | — |
| Experiment outcome / kept finding | `findings.md` | `spike` · `*-fix` | — | — | opt. | ✓ |
| Generated documentation | `docs.md` | `epic-close` | ✓ | — | — | — |
| Retrospective | `retrospective.md` | `*-review` | ✓ | ✓ | ✓ | — |

A spike has no retrospective of its own: its `findings.md` **is** the retro.

A bug's `findings.md` is a different thing wearing the same name, and optional:
something worth keeping that is **not** the root cause — an unfiled upstream
report, a reproduction someone else will need, evidence for a decision that
lands elsewhere. The cause belongs in `analysis.md`; if the finding *is* the
cause, it has no `findings.md`.

## Who owns the `scope.md`, by type

There is a **deliberate** asymmetry here between epic and everything else:

- **Epic:** `epic-start` emits **only `brief.md`** (the bet: hypothesis,
  appetite, limits). The `scope.md` is owned by **`epic-design`**, because an
  epic's scope *is* a product of design — you cannot list its stories before
  decomposing it. Seeding a scope at start with "planned stories" only forces
  design to rewrite it.
- **Story / bug / spike:** the `scope.md` is owned by its `*-start`, because
  their scope arrives given — from the epic's story list, from the bug report,
  or from the spike's question.

## The user story lives inside the story's `scope.md`

`story-start` emits **a single artifact**: `scope.md`, which holds the user
story and its limits together:

- User story — *"As a {role}, I want {capability}, so that {benefit}"*.
- Acceptance criteria (Gherkin) and one concrete example.
- In scope / Out of scope.
- Done when (observable outcomes).

They are the same moment (opening the story and stating what it is and how far
it goes); two files for that was ceremony. An epic **does** split `brief.md`
from `scope.md`, because there the bet and the scope are distinct decisions,
taken by different skills at different moments.

## The epic's progress lives in its `plan.md`

The epic's `plan.md` holds the tracking table (story sequence, status,
estimated vs actual). When a story closes, **`story-close` updates that table**
— not the `scope.md`. This is the **only cross-write** allowed (see `rules.md`
R3): progress belongs to the plan, which is where the sequencing hypothesis
lives, not to the scope, which is a stable declaration.

## Artifacts that are not work-item artifacts

| Artifact | Path | Owner |
|---|---|---|
| `analysis.md` | `work/debug/{name}/` | `debug` (tiers S, M and L — XS leaves only a commit line) |
| `report.md` | `work/research/{topic}/` | `research` |
| `{slug}.md` | `work/problem-briefs/` | `problem-shape` |
| `{YYYY-MM-DD}-{slug}.md` | `work/sessions/` | `session-close` (written) · `session-start` (read) |
| `session-pointer.md` | `.claude/memory/` | `session-close` (written) · `session-start` (read) |
| `README.md` | repo root | `project-create` (creates) · `project-onboard` (only if missing) |
| `CLAUDE.md` | repo root | `project-create` (creates) · `project-onboard` (only if missing) |
| `scripts/check` | repo root | `project-create` (creates) · `project-onboard` (wires to existing commands) |
| 6 governance docs | `governance/` | `project-create` (creates) · `project-onboard` (merges) |
| `adr-{NNN}-{slug}.md` | `records/decisions/` | whoever makes the decision (`adr` technique) |
| `parking-lot.md` | `records/` | appended by whoever defers the work (see R4) — **created on first append**, not scaffolded |

**`README.md` and `CLAUDE.md` are two front doors for two readers:** the README
for a human arriving at the repo — what it is, how to run it, what is not
obvious from the code — and the CLAUDE.md for an agent working in it, which is
the **gemba core itself**: method only, with this project's four declarations
filled. Neither restates the other, and neither restates governance —
this is R1 (one owner per artifact) applied to content: two sources for the
same truth both lose trust the moment they diverge. The method is not a third
source: the core *is* it, which is why nothing else carries a copy.

`scripts/check` is the project's **gate entry point** — the contract every
"run the gates" step refers to (see `../gates.md`; nothing enforces it
automatically). It is created at project setup precisely so a project never
starts life with silent, absent gates.

`analysis.md` shares its name between `bug-analyse` and `debug` on purpose:
same moment of the cycle (finding the root cause), same name.

## The in-code deferral marker

`records/parking-lot.md` catches what someone remembers to write down; a corner
cut **deliberately** in code is marked where it happens, so the deferral stays
greppable next to the code it describes:

```
{comment leader} parked: {ceiling}, {upgrade trigger}
```

```python
# parked: O(n²) pairwise scan, fine to ~1k items — spatial index past that
```

The harvest is one grep, run by `architecture-review` at epic scope or on
demand:

```
grep -rnE '(#|//|<!--) ?parked:' . --exclude-dir=.git --exclude-dir=node_modules
```

Each hit is one ledger row; the footer counts them: `{N} markers, {M} with no
trigger`. A marker that names no upgrade trigger is flagged `no-trigger` —
those are the ones that silently rot (see `rules.md` R8).

The **session log is the source of truth** for where work stood; the memory
entry `session-close` refreshes alongside it is only a pointer (date, next
action, path), regenerated on every close so the two cannot meaningfully drift.
A session log is dated and append-only as a set — unlike a work item's
artifacts, past entries are never rewritten.

## Templates

Each artifact's template lives as **`assets/` of the skill that emits it** (see
`../authoring.md`). The emitted artifact lands in `work/`
according to `../work/convention.md`. A template and an artifact are different
things: one is consulted, the other is produced.

This governs **artifacts** — a skill's **presented output** (a review's
findings, `integrate`'s result to the developer) is never written to a file,
so it has no template in `assets/`: its shape stays inline, under `## Output`.
