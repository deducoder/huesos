# Work — Convention

> Work-log conventions — where each work item's directory lives, how it is
> named, and how the hierarchy is expressed on disk. Restrictions and guards
> live in `rules.md`.
>
> A work item's identity (`{ISSUE-KEY}`) is the same one that appears in the
> commit scope (`../git/`) and, when a tracker exists, originates there
> (`../tracker/`).
>
> **Scope:** this section covers **the directory only** — its name, its
> location and its hierarchy. It does **not** cover the files inside it: the
> names, owners and content of the `.md` artifacts are fixed by
> `../artifacts/`.

## Rule 1 — One work item = one directory of its own

Every work item has **its own directory** (the container), instead of flat
files carrying an identity prefix (`s{N}.{M}-*.md`) inside the epic's folder:

```
{work item dir}/
  ...artifacts emitted by that work item's skills...
```

This removes the asymmetry between types — no more "epic and bug get a folder,
story gets flat prefixed files" — and matches the nested layout that
`story-implement` already assumes. Identity lives exactly once, in the
directory path. **Which files go inside and what they are called is not
decided here** (see `../artifacts/`).

## Rule 2 — Directory name: `{ISSUE-KEY}-{slug}`

The same pattern applies to all four types (epic, story, bug, spike):

- `{ISSUE-KEY}`: derived exactly like the commit scope (`../git/`) — the
  tracker issue key if the item is published to a tracker; otherwise the local
  id (`e{N}`, `s{N}.{M}`, `b{N}.{M}`, `sp{N}.{M}`) as fallback.
- `{slug}`: the **same summary the issue carries in the tracker**
  (`../tracker/`), **kebab-cased** — not a locally invented name, and never a
  local compression: it is short because the summary already is (the tracker
  convention's operative test), English because the summary is. Same slug as
  the branch (`{type}/{key}/{slug}` ↔ directory `{key}-{slug}`).

Examples: `AB-3-search-indexing/`, `AB-12-results-endpoint/`,
`AB-31-index-rebuild-timeout/`. Local fallback: `e3-search-indexing/`,
`s3.2-results-endpoint/`, `b3.1-index-rebuild-timeout/`.

## Rule 3 — The hierarchy is physical: children sit under their parent

All four types can appear at two levels, under one and the same rule:

- **With a container** → subdirectory of the parent, grouped by type:
  `work/epics/{EPIC-KEY}-{slug}/stories/{KEY}-{slug}/`, `.../bugs/…`,
  `.../spikes/…`.
- **Standalone** (no container) → per-type root: `work/epics/`,
  `work/stories/`, `work/bugs/`, `work/spikes/`.

A single rule ("does it have a container? → under the parent; if not → the
per-type root"). Where a tracker exists, it remains the source of truth for
the parent-child relationship (epic link, `../tracker/`).

### Where a spike goes

The spike applies the same rule, according to its **nature**:

- **Exploratory spike / spike preceding** an epic or any higher-level
  container (you investigate *in order to decide whether* to do something) →
  **standalone**, its own directory at the root, exactly like a standalone
  story: `work/spikes/{KEY}-{slug}/`.
- **Internal-validation spike** for a container that already exists (you
  investigate *inside* an epic or story already in flight) → **child**:
  `work/epics/{EPIC-KEY}-{slug}/spikes/{KEY}-{slug}/`.

Same directory mechanism as every other type; the only thing that decides the
level is whether the spike is born before its container or inside it.

## Layout summary (directory structure only)

```
work/
  epics/
    {EPIC-KEY}-{slug}/
      stories/{STORY-KEY}-{slug}/
      bugs/{BUG-KEY}-{slug}/
      spikes/{SPIKE-KEY}-{slug}/     # internal-validation spike
  stories/{STORY-KEY}-{slug}/        # standalone story
  bugs/{BUG-KEY}-{slug}/             # standalone bug
  spikes/{SPIKE-KEY}-{slug}/         # exploratory / preceding spike
```

`{KEY}` = the tracker issue key where a tracker exists; the local id (`e{N}`,
`s{N}.{M}`, `b{N}.{M}`, `sp{N}.{M}`) where none does (Rule 2). The contents of
each directory (the `.md` files) are defined by `../artifacts/`.

## Outside this section

- **The artifacts a work item emits** — the names, owners and content of the
  internal `.md` files (`scope.md`, `plan.md`, `retrospective.md`, …) are fixed
  by `../artifacts/`. This section stops at the directory.
- **Not work items:** `work/debug/`, `work/research/`, `work/problem-briefs/`,
  `work/sessions/`. These are techniques and auxiliary flows: they have no key,
  no branch and no lifecycle. `work/sessions/` already honours the spirit
  (identity in the name: date + slug), and research is identified by `{topic}`.
  A **spike is** a work item and lives in `work/spikes/` — see Rule 3 above.
