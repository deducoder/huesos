# Git — Convention

> Git conventions — the shape of every commit, branch and merge in this
> project. Restrictions and guards live in `rules.md`.
> The work item identity (`{scope}`) is the same one used by the tracker
> (`../tracker/`, where the key is born when a tracker exists) and by the
> directory and branch (`../work/`).

## Generic structure

Base: [Conventional Commits](https://www.conventionalcommits.org/), reduced to
**a single line** — no body, no footer.

```
<type>(<scope>): <description>
```

No component references "epic", "story" or "bug" — that is a later
application layer.

**No body, no footer:** the extended detail (acceptance criteria, context,
root cause) already lives in the tracker or in the local scope/plan artifact.
The reference to the parent container needs no footer because the **scope
already encodes it**, or, when the scope is an issue key, because the tracker
already knows the relationship (epic link).

Co-author trailers are discarded by the same simplification: the one-line rule
leaves no room for them, and they are not wanted in the history.

## Type rule

The type describes **the technical nature of the change**, not the work
container. Standard vocabulary:

| Type | When it applies |
|---|---|
| `feat` | New observable functionality |
| `fix` | Correction of incorrect behavior |
| `refactor` | Internal change with no behavior change |
| `test` | Only adds or adjusts tests |
| `docs` | Documentation only |
| `chore` | Process/tooling maintenance (init scope, close with retro, persist state) |
| `style` | Formatting, no logic change |
| `build` / `ci` | Build system or pipelines |

Custom types (`epic`, `bug`) are never invented to signal the container — that
signal lives in the scope.

## Scope rule

The scope is the **unique identifier of the work item**, and the only place
where the parent-child hierarchy lives (there is no footer any more).
Derivation is agnostic to the work item type:

1. If there is a **published** external tracker → the scope is the **issue
   key**. The relationship with the parent is resolved by the tracker (epic
   link).
2. Otherwise → a local identifier that encodes the hierarchy: type prefix +
   epic number + sub-number. `e{N}` (epic), `s{N}.{M}` (story), `b{N}.{M}`
   (bug), `sp{N}.{M}` (spike). The epic number stays embedded.

**Three roles of the scope, depending on the moment:**

1. **Container commits** (opening, triage, plan, close) — work item metadata.
   Scope = work item (issue key or local id).
2. **Task commits** inside a branch that is already associated with a work
   item (`test`/`feat`/`fix`/`refactor` during implement/fix) — the branch
   already identifies the work item, so the scope goes back to its literal
   meaning: **the area of code affected**. Example:
   `fix(payment): guard against duplicate submission on retry`.
3. **Commits with no work item at all** — project setup, session handoffs,
   anything outside a lifecycle. There is no id to name, so the scope is the
   **area affected**, like role 2: `chore(governance): initialize`,
   `chore(session): close 2026-08-03`. The scope is never omitted; `initial
   commit` below is the one total exception in the method.

## Description rule

- **Always in English** — never in Spanish, regardless of the working
  language. The commit lives permanently in the history and is consumed
  outside the project's context.
- Imperative, lowercase, no trailing period. Target ~72 characters.
- Describe the observable effect, not the internal process.

## Derivations by lifecycle moment (type-agnostic)

| Moment | Type | Note |
|---|---|---|
| Opening / scope init | `chore` | Process metadata |
| Classification / triage | `chore` | |
| Task plan | `chore` | |
| Task commit (TDD) | `test`/`feat`/`fix`/`refactor` by phase | Scope = area of code |
| Close with retrospective | `chore` | |
| Integration merge | merge message, not a conventional commit | See below |

**Merge:** the message is **git's default, with no embellishment**:
`Merge branch 'story/{scope}/{slug}' into {dev-branch}`. No `Tracker:` line
and no hand-written summary — both are redundant with the branch name.

`{dev-branch}` is the project's integration branch — the one every story, bug
and spike branches from and merges back into. Its actual name (`develop`,
`dev`, `main`…) is a property of the adopting project, declared once in its
`CLAUDE.md`; every skill and rule here refers to it by this placeholder and
never hardcodes a name.

## Integration mode

**How a branch reaches its target** is the third project declaration, next to
`{dev-branch}` and the tracker mode in the adopting project's `CLAUDE.md`:

- **`request`** — push the branch and open a merge/pull request on the VCS
  host. The team default: the request is where someone else reads the change
  before it lands.
- **`direct`** — merge into the target locally with `--no-ff` and push the
  result. The solo default: with no reviewer on the other side, a request is
  ceremony — the full gate at push time *is* the review, and `--no-ff`
  preserves the same branch history a request would have.

The method never names a host or its CLI: "open a request" binds to whatever
the project uses (GitHub, GitLab, Gitea…), and direct mode needs no host
tooling at all. **If no mode is declared, ask before the first push** — do not
assume either.

The exact message each phase produces is **not listed here**. It lives in the
skill that emits it, which is the only place that can keep it true: a table of
per-flow commit messages in this document would be a second copy of thirteen
skills, and the copy is what goes stale. The rules above are what let you derive
a correct message for a phase this document has never heard of.

## Initial project commit

Right after project setup (scaffolding of `.claude/`, `CLAUDE.md`,
`conventions/`), the first commit of the repository is:

```
initial commit
```

This is a **total exception** to the generic structure — no type and no scope:
it is the "zero" commit, with no work item and no nature of change to
classify.
