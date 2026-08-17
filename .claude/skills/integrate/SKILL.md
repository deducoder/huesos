---
name: integrate
description: "Ship a branch to its target: run the full test/lint/format/types suite plus the integration suite, sync with the target if behind, then integrate per the project's declared mode — push and open a merge/pull request (request mode) or merge into the target locally with --no-ff and push (direct mode, for solo work). Works for any work item: epic-close ships the dev branch with it, bug-close ships a bug's branch with it, and a standalone story's story-close ships its own branch with it (no epic to ride). The full suite runs only here, at push time; every other check is scoped. Never use it for per-task or per-story-under-an-epic checks, never ship with the gate red, and never assume a mode that is not declared."
---

# Integrate (technique)

Ship a branch to its target — the one gate before remote. Run the **full**
suite, make sure the branch is current with its target, and integrate it: as a
request when someone else will read it, as a direct merge when the project
declares solo mode. Every other check in the lifecycle is package-scoped; this
is where the whole thing runs green before it lands.

A technique, not a work item: it has no branch or artifact of its own. It is
invoked by a closing skill and acts on **that work item's** branch — the merge
or push it produces is the work item's trace. Callers and their parameters:

| Caller | Source → target | Title |
|---|---|---|
| `epic-close` | `{dev-branch}` → `{dev-branch}` | `{scope}: {epic name}` |
| `bug-close` | `bug/{scope}/{slug}` → `{dev-branch}` | `fix({scope}): {summary}` |
| `story-close` (standalone) | `story/{scope}/{slug}` → `{dev-branch}` | `{scope}: {story title}` |

Never for a story that belongs to an epic — that one merges locally in
`story-close` and rides the epic's integration (see
[`../../conventions/git/`](../../conventions/git/rules.md), R6). A
**standalone** story (no epic) has no later close to ride, so it ships
immediately here instead, the same reasoning R5 already states for a bug.

## When

- **Use:** immediately before shipping any branch to remote.
- **Not for:** per-task or per-story verification — those use scoped gates.

## 1 · Full gate

Run the fast gates, `./scripts/check`. Then run the suite the commit gate
deliberately leaves out — `./scripts/check-integration` (integration/E2E, which
needs the stack running) — **if the project provides one**. The integration
suite runs only here, at push time.

Most projects have no second entry point, and that is opt-out, not a finding
(see [`../../conventions/gates.md`](../../conventions/gates.md)): a
project with no tests that need services running has nothing to put in one.
When it is absent, run the fast gates and carry on. **Do not report the absence
as a gap, and do not go looking for the file outside the project.**

- All pass → continue.
- Tests fail → fix; CI will reject the same errors.
- Lint/format fail → fix (often auto-fixable).
- Types fail → fix; type errors block merge.

(If the full package suite already ran on this exact commit in this session,
you may skip re-running tests and run only lint/format/types — gate on the
commit hash, not on elapsed time.)

## 2 · Sync with the target if behind

Fetch the target and check how far behind the branch is. If behind, merge the
target in and resolve conflicts. **Then re-run the full gate — always.** A
clean merge does not guarantee compatibility: the target may carry new tests
that exercise APIs your branch changed. This is not hypothetical — clean merges
have produced dozens of failures this way.

## 3 · Ship per the declared integration mode

The project's `CLAUDE.md` declares the mode (see
[`../../conventions/git/`](../../conventions/git/convention.md)). **If it
declares none, ask** — do not assume either.

**`request`** — push the branch (on a non-fast-forward rejection,
`git pull --rebase` and re-push), then open the request via the VCS host's CLI
or web UI with the given title and body. If no CLI is available, hand the push
URL to the developer to open it manually.

**`direct`** — switch to the target, merge the branch with `--no-ff` (git's
default merge message, unadorned), and push the target. No request: the full
gate above was the review, and `--no-ff` keeps the same branch history a
request would have left.

## Output

A **presented output**: rendered to the human, never written to a
file.

```
Full gate: PASS
Mode: direct
Result: main updated to a1b2c3d (merge --no-ff of story/s3.2/checkout-api)
```

`Full gate` is always shown first. `Mode` and `Result` are mode-specific: in
`direct` mode, the target branch and the merge commit it now points at; in
`request` mode, the opened request's URL in place of the merge line.

## Checklist

- [ ] Full gate (tests + lint + format + types) green before shipping — no
      exceptions.
- [ ] Branch up to date with its target; full gate re-run after any merge.
- [ ] Mode read from the project's declaration — asked, never assumed.
- [ ] Request opened and URL presented, or target merged `--no-ff` and pushed.
- [ ] Never run the full gate for per-task/story scoped checks.
