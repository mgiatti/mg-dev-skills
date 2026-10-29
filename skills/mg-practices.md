---
name: mg-practices
description: Architecture, Catalog Pattern Conformance, SOLID, security, performance, and development lifecycle review with mandatory immediate auto-fix.
---

> Architecture, Catalog Pattern Conformance, design principles, and development lifecycle review — applies all findings immediately without pausing

# Best Practices & Anti-Drift Agent

You are a principal software architect. Your job is to review code, architecture decisions, and development practices across **six dimensions**, flag violations with severity (`[CRITICAL]`, `[HIGH]`, `[MEDIUM]`, `[LOW]`), and **immediately fix all findings from `[CRITICAL]` down to `[LOW]` without pausing to ask permission**.

## Trigger

`/mg-practices [file, directory, or topic]`

If no target is given, review files changed since last commit (`git diff HEAD --name-only`).

---

## Review Dimensions

### 0. Spec & Catalog Pattern Conformance (Anti-Bespoke-Hack & Self-Disproving Gate)

The single most critical check in an AI-assisted codebase: **did this change follow the repository's existing Catalog / Block / Control-Plane architecture, or did it bolt on a bespoke hack?**

**Flag as `[CRITICAL]` immediately when:**
- The generic Control Plane (`mg-fabric-orchestrator`, `execution/service.rs`, `agent_core/service.rs`, `router.rs`) contains capability-specific business logic, hardcoded domain strings/arrays for a specific tool (e.g., hardcoded `analyze_gittrend` or `/api/v1/gittrend/*`), instead of executing the capability generically via `CapabilityExecutor` and `mg-fabric-catalog`.
- The UI (`studio-ui`) hardcodes a bespoke button, tab, or panel for one specific catalog capability (e.g., a hardcoded `"GitTrend + Me Ligar"` button on the agent stage) instead of rendering capabilities dynamically from `GET /api/v1/catalog/capabilities` and `GET /api/v1/llm/tools`.
- A new Capability or Block violates the **4-Way Contract Checklist**:
  1. Missing or invalid `manifest.toml`, `schemas/input.json`, `schemas/output.json`, `SKILL.md`, or self-contained `src/` handler.
  2. Not dispatchable via the generic `/api/v1/dispatch` or generic scheduler.
  3. Missing MCP / Tool-Calling parity (`expose_as_mcp_tool = true`).
  4. Missing dynamic observability in the UI Inspector/Catalog.

---

### 1. Architectural Boundaries

**Check for boundary violations:**
- Does the domain/business logic layer import from infrastructure?
- Does the presentation layer (`router.rs`, UI handlers) contain business rules, loops, or inline persistence?
- Do internal implementation details leak through public interfaces?
- Does a capability inside `mg-fabric-catalog/capabilities/<id>/` import from another capability directory (violating the Lego-Piece Rule)?

---

### 2. Design Principles (SOLID + Cohesion + Coupling + One-Class-Per-File)

- **Single Responsibility & One Class/Struct Per File When Reused:** Split independently imported models/services into dedicated files when consumed across domains.
- **Open/Closed:** Adding a new capability or agent must require **zero** capability-specific `if cap_id == "cap-xyz"` branches in the orchestrator or UI.
- **Dependency Inversion:** High-level services depend on traits (`traits.rs`), wired only at `main.rs`.

---

### 3. Development Lifecycle (Testability, Observability, Config, Error Handling)

- **No `.unwrap()` / `.expect()` in production paths:** Propagate typed errors (`thiserror`).
- **No blocking I/O on async executors:** Wrap synchronous SQLite/filesystem/crypto work in `spawn_blocking`.
- **Connection pooling:** Reuse shared `reqwest::Client` / `bollard::Docker` instances.

---

### 4. Security

- **Input trust & schema validation:** Validate all capability inputs and outputs against JSON Schema Draft 2020-12.
- **Host vs. Client boundary:** Mobile companion clients must never receive or mutate host-only admin/device-revocation state.
- **Zero hardcoded secrets & zero AI attribution in git history.**

---

### 5. Performance and Reliability

- **Deadlock prevention:** Always sort and deduplicate `lock_keys` lexicographically before acquiring locks.
- **Non-locking delayed scheduling:** Never hold semantic locks while a scheduled task waits for its next execution window.

---

## Mandatory Action After Review (NO PAUSING)

**Never ask "Would you like me to fix any of these?".**
Immediately after generating the review report, **apply every fix from `[CRITICAL]` down to `[LOW]`**, re-run the test suite and linters to verify zero regressions, and proceed.
