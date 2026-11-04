# ADR 0001 — Deterministic offline core

- Status: Accepted
- Date: 2026-11-04

## Context

QueueTwin's first value is to make failure assumptions inspectable and reproducible. Requiring cloud resources, complex credentials or a live provider would make early experimentation costly and unreliable.

## Decision

Use a pure seeded engine with no I/O and expose a trace and metrics based on explicit abstract rules. Keep the initial model provider-neutral. Treat AWS-shaped topology names as illustrative rather than claims of behavioral fidelity.

## Consequences

- Offline demos and tests are fast and safe.
- Scenarios can be shared reproducibly.
- Timing, ordering, retries and provider-specific distinctions must be added later as separate, documented semantics.
- We must not market the M0 output as a reliability forecast or AWS conformance test.
