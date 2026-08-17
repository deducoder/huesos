# Epic {scope}: {title} — Plan

## Sequence

| Order | Story | Strategy | Depends on | Enables |
|:-----:|-------|----------|------------|---------|
| 1 | {scope}.{n} | {risk-first / skeleton / quick-win / dependency} | {ids or —} | {what it unblocks} |

**Rationale:** {why this order — riskiest first unless noted}

## Milestones

- [ ] **Walking skeleton** — {stories} — {verifiable success criterion}
- [ ] **Core MVP** — {stories} — {criterion}
- [ ] **Feature complete** — {stories} — {criterion}
- [ ] **Epic complete** — done criteria met
- [ ] **E2E integration checkpoint** (multi-component epics) — real infra, cross-story contracts verified

## Parallel streams

{stories with no mutual dependency that can run concurrently, or "none"}

## Progress

Updated by `story-close` as each story lands — the only cross-artifact write.

| Story | Status | Est. | Actual |
|-------|:------:|:----:|:------:|
| {scope}.{n} | {todo / doing / done / dropped} | {size} | {actual} |

A `dropped` row carries the reason for abandoning the story — `story-close`
records it here, never in the epic's `scope.md`.

## Sequencing risks

- {top risk} → {mitigation}
