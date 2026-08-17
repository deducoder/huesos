---
name: research
description: "Investigate a question rigorously before a decision — triangulating 3+ independent sources per claim, rating evidence quality, and stating confidence with the contrary evidence acknowledged — then land a recommendation that feeds an ADR or backlog item. Use it before an ADR, when comparing competing approaches, when entering an unfamiliar domain, or when evaluating a new dependency. Skip it when the decision is low-risk and reversible, or prior research already exists. Never present a single source as consensus; the answer to 'can WE build this' is a spike, not research."
---

# Research (technique)

Stand on the shoulders of giants instead of reinventing. Research answers
**"what does the world already know?"** — it is a technique you apply to inform
a decision, not a work item with its own lifecycle. It opens no branch and gets
no commit of its own naming — the report rides in the commit stream of whatever
invoked it, or under scope role 3 when nothing is in flight (`../../conventions/git/`
R8). Its product is a recommendation someone can act on.

Not to be confused with a **[spike](../../spike/)**, which answers *"can we do
this, how, and at what cost?"* by writing throwaway code. Research reads; a
spike experiments.

## When

- **Use:** before an ADR, comparing competing approaches, entering an
  unfamiliar domain, evaluating a new dependency, or resolving a parking-lot
  item.
- **Skip:** the decision is low-risk and reversible, or research already exists
  in `work/research/`.

## 1 · Frame the question

State the **primary question** (specific and **falsifiable**), the secondary
questions, and **which decision this informs**. A vague question yields vague
research — if you can't falsify it, decompose it into sub-questions first.

Size the depth to the stakes:

| Depth | Effort | Sources | When |
|---|---|---|---|
| Quick scan | 1-2 h | 5-10 | Low risk, familiar domain |
| Standard | 4-8 h | 15-30 | Most ADRs, technology evaluation |
| Deep dive | 2-5 d | 50-100+ | Strategic decisions, unknown domain |

## 2 · Gather and rate the evidence

**Delegate the search itself to the deep-research capability** — it fans out
across sources, fetches them, and verifies claims adversarially. Your job is
the epistemic discipline around it:

- **Seek disconfirming evidence.** Actively look for what would refute the
  answer you expect, not just support for it.
- **Prefer primary over secondary over tertiary** sources.
- Rate each source's evidence level and keep the rating visible:

| Level | Criteria |
|---|---|
| Very High | Peer-reviewed, or proven in production at scale |
| High | Expert practitioners at established companies |
| Medium | Community-validated, emerging consensus |
| Low | Single source, unvalidated |

**Evaluating a dependency?** Assess its supply-chain health explicitly: release
history and yanks, adoption, last release, maintainer count (bus factor),
lighter alternatives or a <50-LOC DIY, and whether it can be confined to one
module. *Consumer reputation is not package stability* — a popular package can
still be a single-maintainer risk. State "N/A" when no package is in scope.

## 3 · Triangulate and state confidence

Per major claim: find **3+ independent confirmations**, note consensus vs
disagreement, and assign confidence:

- **HIGH** — 3+ converging high-quality sources, no significant contrary
  evidence.
- **MEDIUM** — 2-3 sources, some convergence, minor conflicts.
- **LOW** — fewer than 2 sources, significant disagreement, or mostly weak
  evidence.

**Acknowledge contrary evidence explicitly** — never hide it, and never present
a single-source finding as consensus. Fewer than 3 confirmations means lower the
confidence or mark it "emerging/unconfirmed", not silence.

## 4 · Recommend and link to governance

Produce a recommendation with its confidence level, the trade-offs, the
implementation implications, and the risks. Then connect it to where decisions
live: create or reference an [**ADR**](../adr/SKILL.md) if architectural, add a
**backlog item** if actionable, or update the **parking lot** if deferred.
Research that lands nowhere was wasted.

## Output

`work/research/{topic}/report.md`, following
[`assets/report.md`](assets/report.md) — the frame, the recommendation up front,
the claims with their confidence, the supply-chain block, the rated sources, and
where it landed. The template is a **wrapper**: let the deep-research synthesis
fill the findings body; the wrapper carries the parts it can't know (our
evidence levels, the supply-chain check, the governance hook).

The source table lives **inside** the report by default. Only on a **deep dive**,
when it outgrows the report, does it graduate to
`sources/evidence-catalog.md` — depth scales the ceremony, same as step 1.

Commit it — everything under `work/` is versioned. The commit belongs to
whatever invoked the research; standalone, it takes scope role 3:
`docs(research): {topic}`.

Publish to the docs system when the decision is shared
([`../../conventions/tracker/`](../../conventions/tracker/convention.md)). Identified by `{topic}`, not
by a work-item key — research is not a work item.

## Checklist

- [ ] Question specific and falsifiable; depth sized to the stakes.
- [ ] Disconfirming evidence actively sought.
- [ ] Major claims have 3+ independent sources; evidence levels rated.
- [ ] Confidence stated; contrary evidence acknowledged, never hidden.
- [ ] Single-source findings never presented as consensus.
- [ ] Recommendation lands somewhere: ADR, backlog, or parking lot.
