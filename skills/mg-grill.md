---
name: mg-grill
description: Relentless Spec-Driven interrogation session with pre-flight ai-memory + Catalog pattern-fit checks that stress-tests plans, sharpens terminology, and produces PRD, ADRs, and vertical-slice issues.
---

> Relentless Spec-Driven interrogation session that checks `ai-memory` + existing Catalog/Block patterns first, stress-tests plans, sharpens terminology, and produces PRD + vertical-slice issues

# Deep Grill (Spec-Driven Development + Context Engineering Gate)

Interview the user relentlessly about every aspect of a plan until you reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one by one. For each question, provide your recommended answer (**always recommending the highest-quality, highest-performance architectural option regardless of implementation effort**).

**Ask questions one at a time, waiting for feedback before continuing.**

If a question can be answered by exploring the codebase or `ai-memory`, explore the codebase and `ai-memory` instead of asking.

## Trigger

`/mg-grill [topic]` — if no topic provided, ask: "What are we grilling today?"

---

## Phase 0 — Mandatory Pre-Flight Context, `ai-memory` & Existing Pattern Gate

Before asking a single question or proposing any design:

1. **Query `ai-memory` (`ai-memory-retrieval`):**
   - Read `.ai-memory.toml` (or derive `workspace` + `project`) and query `ai-memory` (`memory_briefing` and `memory_query`) for prior decisions, `gotchas/`, `_rules/`, and standing `feedback_*` notes.
2. **Read Domain Glossary & ADRs:**
   - Read `CONTEXT.md` (and `CONTEXT-MAP.md` if present).
   - Search `docs/adr/` (via `python -m scripts.adr_search.cli search "<topic>"` if available, or reading `docs/adr/README.md` and top matching ADR files). Surface any conflict with an existing ADR explicitly.
3. **Existing Architecture & Catalog Reuse Check (Anti-Bespoke-Hack Gate):**
   - Inspect existing capabilities/blocks in the codebase (e.g., `mg-fabric-catalog/capabilities/*`, `app/<domain>/`, `crates/*`).
   - Classify every requested feature strictly into:
     - **A. Catalog Capability / Pipeline Block:** Must live inside the Catalog/Block layer (`mg-fabric-catalog/capabilities/<id>/` with `manifest.toml`, JSON Schemas, `SKILL.md`, and isolated `src/` handler) and be invoked, scheduled, and rendered dynamically via existing generic interfaces.
     - **B. Generic Control-Plane Primitive:** Must be 100% capability-agnostic inside the orchestrator (`mg-fabric-orchestrator`) and UI shell (`studio-ui`), operating over any capability in the Catalog.
   - **NEVER propose or allow a bespoke capability button in the UI, a capability-specific endpoint in the generic orchestrator, or hardcoded fake data arrays.** If a user asks for a new agent/tool (like GitTrend), it MUST be designed as a standard Catalog Agent/Capability integrated with generic Orchestrator primitives.

---

## Phase 1 — Grill

### During the Session

**Enforce Pattern-Fit & Reuse.** Immediately map user requests onto the existing Catalog / Block / Orchestrator architecture and confirm how they reuse existing contracts, UI catalogs, and MCP tool-calling.

**Challenge against the glossary.** When the user uses a term that conflicts with `CONTEXT.md`, call it out immediately: "Your glossary defines X as ..., but you seem to mean Y — which is it?"

**Sharpen fuzzy language.** When the user uses vague or overloaded terms, propose a precise canonical term.

**Stress-test with scenarios.** Invent concrete edge cases (crash recovery, lock contention, offline fallback, auth boundaries) that force precision about boundaries between concepts.

**Cross-reference with code.** Check whether the current code agrees with assumptions and surface contradictions immediately.

**Update `CONTEXT.md` inline.** When a term is resolved, update `CONTEXT.md` immediately in English.

**Write ADRs immediately when all three hold:**
1. Hard to reverse — cost of changing your mind later is meaningful
2. Surprising without context — a future reader will wonder "why this way?"
3. Real trade-off — genuine alternatives existed and one was chosen for specific reasons

---

## Phase 2 — Spec-Driven PRD (`PRD.md` / `prd/PRD-NN-...`)

After the grill session is complete (or when the user says "generate PRD"), synthesize what you know into a PRD. **Do not re-interview** — use what the conversation already established.

Sketch the seams at which you'll test the feature. Prefer existing high-level seams (`ExecutionService::dispatch`, `CatalogService`, API/MCP contracts).

Write and save the PRD including the mandatory **Architectural Fit & 4-Way Contract Checklist**:

```markdown
## Problem Statement

[The problem from the user's perspective]

## Solution

[The solution from the user's perspective]

## Architectural Fit & Pattern Reuse (Anti-Drift Contract)

- **Classification:** [Catalog Capability (`mg-fabric-catalog`) | Generic Control-Plane Primitive (`mg-fabric-orchestrator`) | Both]
- **Existing Patterns Reused:** [Which existing catalog capabilities, traits, or UI components this follows]
- **4-Way Capability / Block Checklist:**
  - [ ] 1. Declarative Contract (`manifest.toml`, `schemas/input.json`, `schemas/output.json`, `SKILL.md`, isolated `src/` handler)
  - [ ] 2. Generic API Reachability (`POST /api/v1/dispatch`, generic scheduler/routines — zero bespoke capability routes)
  - [ ] 3. MCP & Chat/Voice Parity (`expose_as_mcp_tool = true` so Agent Core & Personas can invoke it via chat/voice)
  - [ ] 4. Dynamic UI Observability (rendered automatically from Catalog in Sidebar, 2D Grid, Holo-Deck, and Inspector — zero hardcoded capability buttons)

## User Stories

1. As a <actor>, I want <feature>, so that <benefit>

## Implementation Decisions

- Modules to build or modify
- Interface & schema contracts

## Testing Decisions

- Behavioral & contract tests across public interfaces
- Real runtime / UI verification steps

## Out of Scope

[Explicit non-goals]
```

---

## Phase 3 — Vertical-Slice Issues

After PRD is approved (or when user says "break into issues"), create vertical slice issues.

### Vertical Slices, Not Horizontal

Each issue is a thin slice that cuts through **all** integration layers end-to-end — contract/schema, domain logic, generic API/MCP, and behavioral tests. A completed issue is **demoable and verifiable on its own**.

Issues are either:
- **AFK** — can be implemented and validated without human interaction
- **HITL** — requires human decision
