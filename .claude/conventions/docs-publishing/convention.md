# Docs publishing — Convention

> The shape of publishing a curated artifact (an ADR, a spike's
> `findings.md`, an epic's `retrospective.md`) to the connected docs
> system. Shared by `adr`, `spike`, and `epic-close` (see
> [`../authoring.md`](../authoring.md)'s "swapping a tool means editing a
> `references/` file, not the `SKILL.md`" — this doc is that shared
> reference, so none of the three restates it). Restrictions and guards
> live in [`rules.md`](rules.md). Decided in ADR-020 (the published page
> tree's shape), recorded in gemba's own repository under
> `records/decisions/`.

## When this applies

Only when a docs system is connected (`tracker-bind`'s "Docs space"
binding exists in the project's `conventions/tracker/instance.md`). No
docs system → publish steps are skipped, same as every other
best-effort/non-blocking tracker touchpoint in the method.

## The five templates

Every page's title always includes its unique key — see `rules.md` R3.
`{…}` placeholders are filled per `authoring.md`'s convention; a
placeholder's *value* follows the project's working language, the
template's own scaffolding never does (`CLAUDE.md`'s `## Language`).

**Epic root** — created the first time anything needs to nest under it:

```
# {EPIC-KEY} — {epic name}

Epic tracked in the connected tracker: {EPIC-KEY}. Documentation, decisions, and spike
findings for this epic live as child pages below.
```

**Decisions index** — child of the epic root, or of Standalone:

```
# Decisions

| ADR | Title | Date | Status |
|---|---|---|---|
| [{ADR-NNN}]({link}) | {title} | {date} | {accepted | superseded by ADR-NNN | rejected} |
```

**Spikes index** — child of the epic root, or of Standalone:

```
# Spikes

| Spike | Question | Verdict | Date |
|---|---|---|---|
| [{SPIKE-KEY}]({link}) | {one-line question} | {can we / how / at what cost} | {date} |
```

**Research index** — child of Standalone only; research is never
epic-scoped (identified by `{topic}`, not a work-item key):

```
# Research

| Report | Topic | Confidence | Date |
|---|---|---|---|
| [{report}]({link}) | {topic} | {High | Medium | Low} | {date} |
```

**Standalone root** — the project-level home for anything with no epic:

```
# Standalone

Decisions, spikes, and research not tied to a specific epic.
```

## Find or create a parent

Every parent's title is unique across the whole space by construction
(`rules.md` R3), so resolving one is always the same single step,
root or grouping page alike:

1. Build the fully-qualified title: a root page is `{EPIC-KEY} — {epic
   name}` or the literal `Standalone`; a grouping page under an epic
   root is `{EPIC-KEY} — {GroupName}` (e.g. `e2 — Decisions`); a
   grouping page under `Standalone` is the bare `{GroupName}`.
2. Search the space by that exact title.
3. **Found** → use that page's id. **Not found** → create it from the
   matching template above, then use the new page's id.

Never cache the resulting id anywhere (`rules.md` R2) — resolve it fresh
on every publish.

## Publish and append

1. Create the artifact's own page (ADR, spike finding, or epic
   retrospective) as a child of the resolved parent — title follows the
   artifact's own H1 convention (`authoring.md`), body is the artifact's
   content.
2. Append **one row** to the parent index's table — read the current
   body, add the row, write the whole body back. Never regenerate the
   table from scratch (`rules.md` R4).
3. Present the published page's URL.

## Cross-references

When published content needs to reference anything under `work/`, it names
it — a work item by its tracker issue key (`b15`, `s15`, `E2`), a research
report or session log by its own name and date — never a git-relative path
(`rules.md` R5).
