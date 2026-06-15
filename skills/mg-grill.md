> Relentless interrogation session that stress-tests plans, sharpens terminology, and produces PRD + vertical-slice issues

# Deep Grill

Interview the user relentlessly about every aspect of a plan until you reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one by one. For each question, provide your recommended answer.

**Ask questions one at a time, waiting for feedback before continuing.**

If a question can be answered by exploring the codebase, explore the codebase instead of asking.

## Trigger

`/mg-grill [topic]` — if no topic provided, ask: "What are we grilling today?"

---

## Phase 1 — Grill

### Domain Awareness

Before starting, look for existing documentation:

```
/
├── CONTEXT.md          ← glossary of domain terms
├── docs/
│   └── adr/            ← architecture decision records
```

If `CONTEXT-MAP.md` exists, the repo has multiple bounded contexts — find the right one.

### During the Session

**Challenge against the glossary.** When the user uses a term that conflicts with `CONTEXT.md`, call it out immediately: "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

**Sharpen fuzzy language.** When the user uses vague or overloaded terms, propose a precise canonical term: "You're saying 'account' — do you mean the Customer or the User? Those are different things."

**Stress-test with scenarios.** When domain relationships are discussed, invent concrete edge cases that force precision about boundaries between concepts.

**Cross-reference with code.** When the user states how something works, check whether the code agrees. Surface contradictions: "Your code cancels entire Orders, but you said partial cancellation is possible — which is right?"

**Update CONTEXT.md inline.** When a term is resolved, update `CONTEXT.md` immediately — don't batch. The file is a glossary only: no implementation details, no specs, no architectural notes.

**Offer ADRs sparingly.** Only propose an ADR when all three are true:
1. Hard to reverse — cost of changing your mind later is meaningful
2. Surprising without context — a future reader will wonder "why this way?"
3. Real trade-off — genuine alternatives existed and one was chosen for specific reasons

If any of the three is missing, skip the ADR.

---

## Phase 2 — PRD

After the grill session is complete (or when the user says "generate PRD"), synthesize what you know into a PRD. **Do not re-interview** — use what the conversation already established.

Explore the repo to understand the current codebase state. Use the project's domain glossary throughout. Respect any ADRs in the area being touched.

Sketch the seams at which you'll test the feature. Prefer existing seams over new ones. Use the highest seam possible. Check with the user that these seams match expectations before writing.

Then write and save `PRD.md`:

```markdown
## Problem Statement

[The problem from the user's perspective — not "we need to build X" but "users currently can't Y"]

## Solution

[The solution from the user's perspective]

## User Stories

A numbered list covering all aspects of the feature:

1. As a <actor>, I want <feature>, so that <benefit>

[Be extensive — cover happy paths, edge cases, error states]

## Implementation Decisions

- Modules to build or modify
- Interface changes
- Architectural decisions
- Schema changes
- API contracts

No specific file paths or code snippets unless a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, schema, type shape) — trim to decision-rich parts only.

## Testing Decisions

- What makes a good test here (behavior, not implementation)
- Which modules to test
- Prior art in the codebase (similar test patterns to follow)

## Out of Scope

[Explicit non-goals]

## Open Questions

- [ ] Question — owner: ?
```

---

## Phase 3 — Issues

After PRD is approved (or when user says "break into issues"), create vertical slice issues.

### Vertical Slices, Not Horizontal

Each issue is a thin slice that cuts through **all** integration layers end-to-end — schema, business logic, API, tests. Not "add database column" + "add service method" + "add endpoint" as separate issues.

A completed issue is **demoable or verifiable on its own**.

Prefer many thin slices over few thick ones.

Issues are either:
- **AFK** — can be implemented and merged without human interaction
- **HITL** — requires human decision (architectural choice, design review, external dependency)

Prefer AFK over HITL where possible.

### Present the Breakdown First

Show the proposed issues as a numbered list before creating anything:

```
1. [AFK] Title
   Blocked by: none
   User stories: 1, 3

2. [HITL] Title
   Blocked by: #1
   User stories: 2
```

Ask:
- Does the granularity feel right?
- Are the dependencies correct?
- Should any be merged or split?
- Are HITL/AFK labels correct?

Iterate until approved.

### Issue Template

For each approved issue, create (or output for GitHub):

```markdown
## Parent

[Reference to parent issue or PRD, if applicable]

## What to Build

[Concise description of the end-to-end behavior of this slice. No file paths. No code snippets unless they encode a decision more precisely than prose — trim to decision-rich parts.]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked By

[Issue reference or "None — can start immediately"]
```

Publish issues in dependency order (blockers first) so you can reference real identifiers in "Blocked by" fields.
