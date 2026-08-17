# Story {scope}: {title} — Plan

> Size: {XS | S | M | L}

## Tasks

One commit per task, in execution order (riskiest first).

### T1 · {description}

- **Files:** {create / modify}
- **TDD:** RED {failing test} → GREEN {minimal code} → REFACTOR
- **Satisfies:** {acceptance scenario — from the scope, or the design's delta}
- **Verify:** {gate commands scoped to the change — tests + lint/format/types}
- **Commit:** {type}({area}): {description}

### T2 · {description}

- **Files:** …
- **TDD:** …
- **Verify:** …
- **Commit:** …

### T{n} · Manual integration test

- Validate end-to-end with the software actually running.
- **Verify:** {what "working" looks like from the outside}

## Order & risks

- **Execution order:** {sequence — riskiest first} — {why}
- **Dependencies:** {sequential / parallel; must be acyclic}
- **Risks:** {risk → mitigation}
