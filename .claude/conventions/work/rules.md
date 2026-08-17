# Work — Rules

> Restrictions and guards that surround the work-log layout without being the
> layout itself — what it forbids and what it guarantees. The positive form
> (naming, location, hierarchy) lives in `convention.md`.

## R1 — Slug in English, kebab-case

The directory's `{slug}` is **in English**, kebab-case — short because its
source already is, not by local compression — and it is the
**same slug as the branch** (`{type}/{key}/{slug}` ↔ `{key}-{slug}/`). Its
source: the issue summary in the tracker wherever one exists; in local-only
mode, the **English title of the work item** (R4). A Spanish
slug would break coherence with `../git/` (commit descriptions in English) and
`../tracker/` (summaries in English).

> The names of the **internal artifacts** (the `.md` files inside the
> directory) are fixed by `../artifacts/`, not here. This section constrains
> the directory only.

## R2 — One place per work item (never duplicated across two levels)

A work item lives in **one** directory: under its parent if it has a
container, or at the per-type root if it is standalone — never both. The
parent-child relationship is expressed exactly once (the physical path),
consistent with the tracker's epic link and with the commit scope.

## R3 — The directory is versioned in the repo

Directories under `work/` go into git (`git add` + commit) alongside the code
they document. They are neither temporary nor ignored: a work log that is not
committed is lost at merge time, and the next session starts blind.

## R4 — No-tracker mode: local id

With no published tracker, the directory's `{ISSUE-KEY}` uses the local id
(`e{N}`, `s{N}.{M}`, `b{N}.{M}`, `sp{N}.{M}`). Same branching as `../git/`
(scope) and `../tracker/` (tracker-first).

**Standalone story, bug, or spike (no epic):** `{N}` alone is a flat
counter for that type — `s3`, `b5`, `sp2` — distinct from `{N}.{M}`, which
only applies to an epic's child (`{N}` = the epic's number, `{M}` = the
story's number within it). The two can look visually similar (`s1` vs.
`s1.1`) — that similarity is a known, accepted tradeoff, disambiguated by
directory: a standalone instance lives at `work/{stories,bugs,spikes}/`,
an epic's child at `work/epics/{epic}/{stories,bugs,spikes}/`.

In that mode directories read `{local-id}-{slug}` (e.g. `e3-search-indexing/`)
and the slug has no tracker summary to mirror: its source is the **English
title of the work item** (R1 in local mode). Which mode is active is declared
by the adopting project, not here — see `../git/` R7.

## The spike is a work item — research is not

The fourth type (spike) is a **full work item**, driven by the `spike` skill: a
time-boxed experiment in throwaway code that answers *"can we do this, how, at
what cost?"*. It gets a key, a branch and a directory like any other type
(`{KEY}-{slug}/`), and its **location** is fixed by `convention.md` → "Where a
spike goes": standalone at the per-type root when it is exploratory or precedes
a container, a child when it validates something inside an existing container.
Its internal **content** is fixed by `../artifacts/`.

Do not confuse it with **research**, which is a *technique*: it reads external
sources to inform a decision, has no key, no branch and no lifecycle, and lives
under `work/research/{topic}/`. Research reads; a spike experiments.

## Boundary with `../artifacts/`

Artifact naming — one canonical name per lifecycle moment, one owner per
artifact, and no identity prefixes in filenames (`s{N}.{M}-plan.md`), since the
directory path already carries the identity — is fixed by `../artifacts/`. This
section governs the directory; that one governs its contents.
