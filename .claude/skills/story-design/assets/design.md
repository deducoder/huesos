# Story {scope}: {title} — Design

> Complexity: {simple | moderate | complex}

## 1 · What & why

**Problem:** {1-2 sentences — the gap this fills}
**Value:** {1-2 sentences — why it matters, observable or measurable}

## 2 · Approach

{solution in 1-2 sentences — WHAT you're building, not detailed HOW}

**Components affected:**

- {component}: {create | modify | delete — what changes}

**Legacy sweep:** {what existing code becomes orphaned when this lands, or "nothing — net-new"}

## 3 · Interface / examples

Concrete and runnable — real values and real syntax, not placeholders.

### Usage (API / CLI)

```{language}
{how the feature is invoked}
```

### Expected output (success + error)

```
{what it produces, both paths}
```

### Key data structures (if applicable)

```{language}
{models, schemas, types}
```

## 4 · Acceptance criteria

**Distinct from** the scope's `Acceptance criteria`, which owns the base and
stays authoritative. This is the **delta** the gemba walk produced — what
reading the code added, sharpened or ruled out.

- **Must:** {3-5 specific, testable outcomes}
- **Should:** {1-3 nice-to-haves}
- **Must NOT:** {explicit anti-requirements}

### Scenarios (delta over the scope)

Only what the gemba walk **added or corrected** relative to the scenarios in
`scope.md` — the scope stays the owner of the base criteria. Nothing changed →
"none — scope scenarios stand".

```gherkin
Given {context}   # new or corrected scenario
When {action}
Then {outcome}
```
