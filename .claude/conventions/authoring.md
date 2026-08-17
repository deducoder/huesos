# Authoring skills

> How a skill is written, so that it activates when it should and stays cheap
> when it doesn't. The process each skill describes is in its own `SKILL.md`;
> the gate contract is in `gates.md`.

## Directory structure

```
skill-name/
├── SKILL.md      (required)
├── scripts/      → executable code for deterministic, repetitive work
├── references/   → docs loaded only when needed
└── assets/       → templates of artifacts the skill writes to a file
```

A **command** (`commands/{name}.md`, a single file — no directory of its
own) has no `assets/` equivalent: the platform scans every `.md` file under
`commands/` (including in subdirectories) as its own separate invokable
command, confirmed by `claude plugin validate` flagging a command-owned
template dropped there for missing frontmatter — there is no skill-style
exemption for supporting files. A command that needs a fixed template
(instead of freehand prose generated fresh each invocation) puts it
outside `commands/` entirely — under `conventions/{topic}/`, alongside
other shipped, non-invokable reference content.

## SKILL.md — two parts

1. **YAML frontmatter** — `name` + `description`, and **nothing else** by
   default.
   - The **`description` is the activation mechanism**: it must say **what the
     skill does, when to use it, and when NOT to** (disambiguating it from
     neighbouring requests), in a slightly **insistent** tone — agents tend to
     *under*-activate skills. It is the only part always in context, so
     activation has to be earned here. Write it as a **quoted string**, not a
     `>` block.
   - **`allowed-tools` is not a supported attribute** in this runtime — the
     linter rejects it. Do not use it. Valid attributes, if ever needed:
     `argument-hint`, `compatibility`, `context`, `disable-model-invocation`,
     `license`, `metadata`, `user-invocable`. By default, only `name` +
     `description`.
2. **Markdown body** — the instructions, ideally **under 500 lines**.

## Three-level loading (progressive disclosure)

| Level | What | When it loads |
|---|---|---|
| Metadata (`name`+`description`) | ~100 words | **always** in context |
| The `SKILL.md` body | the instructions | when the skill **activates** |
| `scripts/` `references/` `assets/` | heavy resources | **on demand**, no size limit |

This is what makes the structure scale: light metadata always visible, heavy
content loaded only when it applies. It is also what keeps a skill honest — if
something belongs in a reference, moving it there costs nothing at rest.

## Language

Skills are written **in English** (frontmatter and body), for portability. The
conventions that govern them are in English too. Prose written for humans about
the working process may be in the working language; anything an agent or another
team consumes out of context goes in English — the same reasoning as the commit
description rule in `git/`.

## Writing practices

- **Imperative mood** in instructions, not passive explanation.
- A skill's output is one of two kinds, and the kind decides where its shape
  lives:
  - **Artifact** — written to `work/` or the repo, versioned, single-owned.
    Its template is an **exact template**: inline under ~5 lines, else
    `assets/`.
  - **Presented output** — rendered to the human as the skill's result,
    never written to a file. Its shape is **always inline**, under
    `## Output`; the length threshold does not apply — `assets/` loads on
    demand, and a shape the skill prints must already be in context.
  Every skill states a `## Output` section naming what it produces, of
  either kind.
- If a skill spans **several domains or frameworks**, split it into
  `references/` per variant (`aws.md`, `gcp.md`) instead of inflating the
  `SKILL.md`.
- Prioritise **explaining why** over bare "you MUST do X" — it generalises
  better, because the agent then decides well in cases the skill never
  anticipated.

## Template style

Every template — `assets/` file or inline block — follows one style, so the
artifacts a project accumulates read as one voice:

- **H1 of a work-item artifact:** `# {Kind} {scope}: {title} — {Artifact}`
  (`# Story s3.2: Results endpoint — Plan`). Every emitted artifact has an H1,
  inline templates included; sections start at `##`. Technique artifacts
  without a scope use `# {Artifact}: {topic}` (`# Research: …`).
- **Headings in sentence case** (`## Done when`, `## Success metrics`) —
  capitals only for acronyms and proper names.
- **Placeholders always `{…}`**, never `<…>`. Dates are `{YYYY-MM-DD}`.
- **Alternatives** (pick-one values) go inside the braces: ` | ` as separator
  in prose and code blocks (`{XS | S | M | L}`), ` / ` inside table cells,
  where a pipe would break the row (`{L / M / H}`).
- The canonical field name is **`Done when`** — no hyphen; uppercase
  (`DONE WHEN:`) only where sibling fields are uppercase.

## Where each kind of content goes

| Folder | Content |
|---|---|
| `SKILL.md` body | The method: what to do, in what order, and why |
| `references/` | Material the skill **consults** on demand and does not emit |
| `scripts/` | Deterministic runners (the gate entry point lives in the *project*, not here — see `gates.md`) |
| `assets/` | The **template** of an **artifact** the skill writes to a file (brief, design, scope, plan, retrospective) — never a presented output, which stays inline under `## Output` |

Consequence worth keeping in mind: **swapping a tool means editing a
`references/` file, not the `SKILL.md`.** The method stays stable; the binding
is interchangeable. A skill that names a specific CLI in its body has fused the
two.

## Frontmatter target

```yaml
---
name: bug-analyse
description: "Find the root cause of a reproduced bug and decide the fix approach… Use it when… Never implement the fix from here — this skill only diagnoses."
---
```

Only `name` + `description`. What looks like it belongs in frontmatter —
`when-to-use`, `inputs`, `outputs`, `after`, `gate` — does **not**: the *when*
(and the *when not*) folds into the `description`; inputs, outputs, sequence and
gates are described in the **body**, as imperative prose rather than metadata.

## Checklist before closing a skill

- [ ] Frontmatter = **only** `name` + `description` (what + when + when-not,
      insistent, as a quoted string). No `allowed-tools`.
- [ ] Body under 500 lines, imperative, and it explains the *why* of the method.
- [ ] Tool bindings live in `references/`, not embedded in the body.
- [ ] Every output is classified — artifact (template under ~5 lines stays
      inline, longer moves to `assets/`) or presented output (always inline,
      under `## Output`, no length threshold) — and every skill has a
      `## Output` section.
- [ ] The skill describes **what to do**, never *with which vendor's tool*.
