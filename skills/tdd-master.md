> Strict vertical-slice TDD — tests verify behavior through public interfaces, never implementation details

# TDD Master

## Philosophy

Tests should verify behavior through public interfaces, not implementation details. Code can change entirely; tests shouldn't.

**Good tests** are integration-style: they exercise real code paths through public APIs. They describe *what* the system does, not *how*. "User can checkout with valid cart" tells you exactly what capability exists. These tests survive refactors because they don't care about internal structure.

**Bad tests** are coupled to implementation. They mock internal collaborators, test private methods, or verify through external means. The warning sign: your test breaks when you refactor, but behavior hasn't changed.

---

## Anti-Pattern: Horizontal Slices

**Never write all tests first, then all implementation.** This is horizontal slicing — treating RED as "write all tests" and GREEN as "write all code."

This produces bad tests:
- Tests written in bulk test *imagined* behavior, not *actual* behavior
- You test the *shape* of things (data structures, signatures) rather than behavior
- Tests become insensitive to real changes — they pass when behavior breaks

```
WRONG (horizontal):
  RED:   test1, test2, test3, test4, test5
  GREEN: impl1, impl2, impl3, impl4, impl5

RIGHT (vertical):
  RED→GREEN: test1→impl1
  RED→GREEN: test2→impl2
  RED→GREEN: test3→impl3
```

---

## Workflow

### 1. Planning (before any code)

When exploring the codebase, use the project's domain glossary so test names match the project's language. Respect ADRs in the area you're touching.

- [ ] Confirm what interface changes are needed
- [ ] Confirm which behaviors to test (prioritize — you can't test everything)
- [ ] Identify opportunities for deep modules (small interface, deep implementation)
- [ ] List the behaviors to test (not implementation steps)
- [ ] Get user approval on the plan

Ask: "What should the public interface look like? Which behaviors matter most?"

### 2. Tracer Bullet

Write ONE test that confirms ONE thing about the system:

```
RED:   Write test for first behavior → fails
GREEN: Write minimal code to pass → passes
```

This proves the path works end-to-end before building out the rest.

### 3. Incremental Loop

For each remaining behavior:

```
RED:   Write next test → fails for the right reason
GREEN: Minimal code to pass → passes
```

Rules:
- One test at a time
- Only enough code to pass the current test
- Don't anticipate future tests
- Keep tests focused on observable behavior

### 4. Refactor

After all tests pass, look for:

- [ ] Duplication → extract function/class
- [ ] Long methods → break into private helpers (keep tests on public interface)
- [ ] Shallow modules → combine or deepen
- [ ] Feature envy → move logic to where data lives
- [ ] Primitive obsession → introduce value objects
- [ ] Existing code the new code reveals as problematic

**Never refactor while RED.** Get to GREEN first.

---

## Test Writing Rules

### What Makes a Good Test

```typescript
// GOOD: Tests observable behavior
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

Checklist per test:
- [ ] Describes behavior, not implementation
- [ ] Uses public interface only
- [ ] Would survive an internal refactor
- [ ] One logical assertion
- [ ] Test name says WHAT, not HOW

### What Makes a Bad Test

```typescript
// BAD: Tests implementation detail
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Red flags:
- Mocking internal collaborators
- Testing private methods
- Asserting on call counts or order
- Test breaks on refactor with no behavior change
- Verifying state through the database instead of through the interface

### When to Mock

**Mock only at system boundaries:** external APIs, databases, time/randomness, file systems.

Never mock your own code or internal collaborators. Better mockability comes from intentional interface design (dependency injection, SDK-style per-operation functions) — not from mocking everything.

```typescript
// GOOD: mock at the boundary
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});

// BAD: bypasses the interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});
```

---

## Per-Cycle Checklist

```
[ ] Planning approved by user
[ ] Test describes behavior, not implementation
[ ] Test uses public interface only
[ ] Test fails for the right reason (logic, not compilation)
[ ] Code is minimal — no speculative features
[ ] All previous tests still pass
```
