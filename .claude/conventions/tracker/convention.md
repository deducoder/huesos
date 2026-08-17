# Tracker — Convention

> Tracker conventions — how a work item is created in the issue tracker, and
> how its key, summary and description are shaped. Restrictions and guards
> live in `rules.md`.
>
> The identity of a work item (`{ISSUE-KEY}`) is born here, in the tracker,
> and from there it is consumed by the commit scope (`../git/`) and by the
> branch and directory names (`../work/`).

## Canonical order: tracker → local

Every work item is created **in the tracker first**, and the tracker returns
the `{ISSUE-KEY}`. That key then feeds:

- branch name: `{type}/{ISSUE-KEY}/{slug}`
- directory name: `work/.../{ISSUE-KEY}-{slug}/`
- commit scope: `<type>({ISSUE-KEY}): ...`

The key is the **single source of truth** for identity. (The local id `e{N}`,
`s{N}.{M}` applies only in the no-tracker mode — `{N}` alone as a flat
counter for a standalone story, `{N}.{M}` only for an epic's child — see
`../work/rules.md` R4.)

## Single creation template

Every type is created in the `*-start` step of its pipeline, always with the
same structure. Creation goes through the tracker's MCP adapter (e.g. the
Atlassian MCP for Jira), with these fields:

```
project      {PROJECT}       # the tracker project this work item belongs to
issue type   {IssueType}     # Epic | Story | Bug | Spike
parent       {PARENT-KEY}    # only if the work item has a container
summary      {summary}
description  {description}
```

No labels — see `rules.md`.

| Field | Shape |
|---|---|
| `{summary}` | **Clean title, in English, with no type prefix.** E.g. `Products endpoint` (not `Story: ...`, not `S3.2 — ...`). It is the source of the `{slug}` — see "Summary — shape rules" for the operative test. |
| `{IssueType}` | The type resolves the nature of the item; **it is not repeated in the summary**. |
| `{PARENT-KEY}` | Parent link to the container. Omitted if the work item is standalone. |
| `{description}` | **The declared working language** (the core's `## Language` rule), 1–2 lines at creation time (objective/symptom). **It does not list child issues.** |

## Examples

The example descriptions below are in Spanish because the example project
declares Spanish as its working language — the value follows the declaration,
it is not fixed by the method.

Epic (`epic-start`):

```
project      AB
issue type   Epic
summary      Search indexing
description  Indexar el catálogo para habilitar búsqueda de texto completo.
```

→ the tracker answers `AB-3` → `story/…`,
`work/epics/AB-3-search-indexing/`

Story under that epic (`story-start`):

```
project      AB
issue type   Story
parent       AB-3
summary      Results endpoint
description  Endpoint REST para consultar los resultados del índice.
```

→ `AB-12` → `work/epics/AB-3-search-indexing/stories/AB-12-results-endpoint/`

Standalone bug (no epic):

```
project      AB
issue type   Bug
summary      Index rebuild timeout
description  La reconstrucción del índice excede el timeout del worker.
```

→ no parent link.

## Summary — shape rules

- **No type prefix** (`Epic:`, `Story:`, `E1`, `S3.2`, `[Bug]`). The issue
  type already resolves that; the key gives identity; the summary gives
  meaning.
- **Always in English**, the same standard as the commit description
  (`../git/`). It is the source of the branch/directory `{slug}`
  (`../work/`).
- **A title, not a sentence** — a short noun phrase naming the thing
  (`Index rebuild timeout`), never the diagnostic or narrative sentence
  describing it (`index rebuild exceeds the worker timeout when...`). The
  symptom or objective prose is the description's first line, never the
  summary — a bug arrives as a sentence; filing it means titling it.
- **The operative test:** kebab-case the summary. If the result is not the
  slug you would put on the branch and directory, the summary is not
  finished. `Index rebuild timeout` → `index-rebuild-timeout` holds; a
  sentence kebab-cases into something no one would name a branch.

## Description — shape rules

- **The working language** (`CLAUDE.md`'s Language rule) — a deliberate
  asymmetry against the summary/commit, which are always English: the
  description is context prose, read inside the project, not consumed
  outside it.
- **It does not reference child issues.** Every child already exists as its
  own issue and the relationship is expressed by the parent link — listing
  them duplicates the parent link and drifts out of sync. The hierarchy is
  declared exactly once, in the parent link.
- **Two stages:** 1–2 lines at creation; the detail (scope, criteria,
  analysis) is added later, by updating the issue in the design/analysis
  skill. Even in the full scope, it still does not list children.

## Hierarchy: parent link at creation time

If the work item has a container, creation includes the parent link to
`{PARENT-KEY}`. This is what makes the assumption of the other two layers
true ("the tracker knows the parent-child relationship"): it knows it because
it was written at creation time, not reconstructed afterwards.
