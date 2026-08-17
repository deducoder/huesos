# Sequencing strategies — deep dive

> Reference for `epic-plan` step 2. The skill has the decision table; this is
> the rationale and the anti-patterns behind each strategy.

## Risk-first (default)

**Why:** uncertainty falls as you learn. Early stories teach you the codebase,
the problem, and your velocity. Doing the risky work early buys time to recover
from surprises, lets learning inform later stories, and grows confidence
through the epic.

**Risky signals:** new/unfamiliar technology, integration with external
systems, requirements still unclear after design, performance/scale unknowns,
nothing similar done before.

**Anti-pattern:** "easy features first for momentum." It feels good but
front-loads certainty and back-loads risk — you hit the hard parts exactly when
deadline pressure is highest.

## Walking skeleton

**Why:** prove the architecture before investing in it. The smallest end-to-end
path that shows the key decisions are valid, the integration points work, and
the environment/pipeline function.

**Shape:** minimal but complete input→output path, touching all layers,
demonstrable (not just "it compiles"), a foundation for the rest.

**Anti-pattern:** building all of layer 1 before touching layer 2 — it delays
the discovery of integration risk to the worst possible moment.

## Quick wins

**Why:** early, visible success builds momentum and validates the process.
Features completable in one session, with demonstrable value, that block
nothing.

**Use when:** new codebase/technology, morale or stakeholder visibility needs a
boost, or you're validating the development process.

**Anti-pattern:** *only* quick wins — indefinitely avoiding the hard features.
Quick wins support risk-first; they do not replace it.

## Dependency-driven

**Why:** when hard blockers exist, order to unblock the critical path — do the
work others wait on before the work that waits on nothing.
