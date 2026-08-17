# Gates — the contract, and why it's convention, not enforcement

> What a gate is and where it lives. Every skill step that says "run the
> gates" refers to this. How skills are written is in `authoring.md`.

## There is currently no automated enforcement

Two mechanisms were tried and dropped — a Claude Code `PreToolUse` plugin
hook, then a native git `pre-commit` hook via `core.hooksPath`. Both were
abandoned after the first proved unreliable across session types, and
building the second produced a real, damaging mistake (an agent working in
the wrong directory across separate tool calls, accidentally committing
broken state) that made the added complexity look worse than the problem
it solved. The full account is ADR-002 (drop hard gate
enforcement), recorded in gemba's own repository under
`records/decisions/`.

Gates are, for now, discipline — the same as everything else in this
method: **written down and followed**, not technically prevented from being
skipped.

## The contract

A project **opts into gates** by providing an executable entry point:

```
./scripts/check      any language, any toolchain
```

One entry point, deliberately. A project whose gates live in a Makefile points
`scripts/check` at `make check` in a single line — cheaper than every skill
having to know two paths.

Contract rules:

| Rule | Why |
|---|---|
| **Exit 0 = green, non-zero = red** | Keep the signal binary and scriptable, even without a hook consuming it today |
| The project **owns its commands** | Gates are agnostic: they don't know whether this is pytest, vitest or `go test` |
| **No entry point → nothing to run** | A skill or an agent following this convention has nothing to invoke; it is not a failure, it is opt-out |
| **Fast gates only** | Meant to run on *every* commit; if it drags, the discipline gets abandoned |

## What belongs inside, and what doesn't

**Inside** (fast, no services, seconds):

- lint · format · type check
- **unit tests**

**Outside** (needs services, network, or minutes):

- **integration** / E2E tests → `./scripts/check-integration`, run at push or
  pull-request time.

That second entry point is **optional, and its absence is the normal case** —
not every project has one. A project with no tests that need services running
has nothing to put in it, and writing an empty one buys nothing. It is not part
of the contract above: that contract is one entry point, and `./scripts/check`
is it.

So a skill that reaches the push gate runs `./scripts/check-integration` **when
the project provides it**, and otherwise carries on. A missing second entry
point is the same opt-out the contract's **No entry point → nothing to run**
rule already grants a missing first one — **never a defect to report**, and never a reason to go looking for
one outside the project.

This is the policy the skills already declare: gates **scoped** per task
(`story-implement`, `bug-fix`) and the **full suite at each path to
remote** — the `integrate` technique, invoked by whichever close ships the
work item (the set is R6's, in [`git/rules.md`](git/rules.md)).

## Who is expected to run it, absent a hook

The agent, as part of the task discipline each skill already states
(`story-implement`, `bug-fix`: "run the quality gates after each task").
This is now the **only** mechanism — nothing technical catches a skipped
gate. Treat that as a real, standing cost, not a solved problem.

## Example entry point

For a Python project managed with `uv` — a reference for the **shape**, not
for the commands:

```bash
#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

set -a; [ -f .env ] && . ./.env 2>/dev/null; set +a   # tests read config from .env

fail=0
run() { printf '\n· %s\n' "$*"; "$@" || fail=1; }

run uv run ruff check .
run uv run ruff format --check .
run uv run mypy services/api
run uv run pytest -q --ignore=services/api/tests/integration

[ "$fail" -eq 0 ] || { printf '\n✗ gates failed\n'; exit 1; }
printf '\n✓ gates passed\n'
```

Note the `run()` pattern: it **runs all four gates and then fails**, instead
of aborting on the first one. Seeing all four results at once is worth more
than discovering them one commit at a time.

## The one declared exception

A **spike** carries no tests (throwaway code — see `../skills/spike/SKILL.md`
and the TDD non-negotiable in `../core-template.md`). Its branch is deleted without
merging, so its code never reaches a commit gates should have protected.
