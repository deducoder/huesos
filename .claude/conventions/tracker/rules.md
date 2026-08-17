# Tracker — Rules

> Restrictions and guards around work item creation in the issue tracker —
> what is forbidden, what must hold before creating, how the convention
> behaves when there is no tracker, and what happens when a call fails after
> creation. The positive shape of creation itself lives in `convention.md`.

## R1 — A single creation point per type

Every type is created in **exactly one** skill (the `*-start` of its
pipeline), never in two places with different shapes:

| Type | Creation point |
|---|---|
| Epic | `epic-start` |
| Story | `story-start` |
| Bug | `bug-start` |
| Spike | `spike` |

A bug filed opportunistically — you notice a workaround or a piece of tech debt
mid-work and decide to track it — uses **the same template** from
`convention.md` with issue type `Bug`, not a loose shape of its own. There is no
second, lighter way to file a bug.

## R2 — Verified tracker access before creating (hard precondition)

Access to the tracker is checked at **every** creation point, not only at
epic start:

> Verify that the tracker's MCP connection is authenticated and that the
> target project is reachable. If it is not, stop and ask. **Never create
> without verified access** — a failed remote creation leaves a local entry
> behind that later syncs as a duplicate.

## R3 — No labels

**Labels are not used.** A label is only justified for a dimension that no
other vehicle can express, and no such dimension remains:

| Dimension | Native vehicle |
|---|---|
| Type (epic/story/bug/spike) | **Issue type** |
| Grouping under an epic | **Parent link** |
| Area/module (`api`, `auth`, `cache`) | **Components** |

Components are the native mechanism for orthogonal dimensions (they carry an
owner, and they drive filters and reports) and they do not drift out of sync
the way a loose label does. If a dimension appears that none of the three
covers, this is re-evaluated — today none does.

## R4 — No-tracker mode: creation is an explicit logged no-op

With no tracker published (adapter not configured), creation in the tracker
is a **logged no-op**, not an error; the work item runs with a local id
(`e{N}`, `s{N}.{M}`) as its fallback identity. This is an **explicit
degraded mode**, not the default path. With a tracker connected,
tracker-first is mandatory.

Whether a tracker is connected is declared by the **adopting project** in its
`CLAUDE.md` (see `../git/` R7). Where none is, everything in this section
(tracker-first, the parent link, summary/description in the tracker) stays as
the general convention and is simply inactive: what applies is the local id and
the `../work/` layout.

## R5 — Custom fields: binding, not identity

Custom fields are classification applied **after** creation, not identity —
they are not part of the creation template in `convention.md`. Bug triage
(see `../skills/bug-triage/`) is reduced to **two dimensions**:
**Severity** (priority) and **Origin** (prevention); Bug Type and Qualifier
were dropped.

The **mapping** of those dimensions onto the real fields of the instance —
field names, allowed values and their quirks (a priority field whose values
are named differently, a field name carrying a legacy typo) — is an
**instance binding** and lives
here, in the tracker convention, not in the skill. The skill speaks in terms
of "Severity/Origin"; this layer translates to whatever the concrete tracker
instance expects. Epics and stories have no classification custom fields, and
none are proposed for them.

## R6 — A failed post-creation call never blocks the work

Creation is a hard precondition (R2): without verified access, stop and ask.
**Every tracker call after creation is the opposite** — updating a
description, moving a status, setting a classification field. These are
**best-effort and non-blocking**: if the call fails, log it and carry on with
the work. Never halt a lifecycle phase, and never leave an artifact unwritten,
because a remote call did not land.

The asymmetry is deliberate. A failed *creation* costs identity — the work
item has no key, and a retry later produces a duplicate. A failed *update*
costs only freshness: the local work log is the source of truth and the
tracker catches up. Paying for the second with a stalled phase is the wrong
trade.

**This governs the call failing, not what a successful call reveals.** A phase
may still stop on what it reads back: `epic-close` deliberately refuses to
proceed while child stories have drifted out of Done, because that is a
finding about the work itself, not a transport failure. Blocking on a fact is
not the same as blocking on a network error.

Skills state this in line, at the touchpoint, rather than relying on a reader
having this file in context — the conventions are not loaded by default.

## Instance bindings to settle when a tracker is connected

These depend on the concrete instance and can only be answered against it:

- Which issue types actually exist (does "Spike" exist as a type, or is it
  modelled as Story/Task?). Settled during tracker setup.
- Whether the instance supports a native parent link or requires an epic-link
  custom field (a per-version quirk).
- Which Components to define, and whether they can be assigned at creation
  time or only afterwards.
