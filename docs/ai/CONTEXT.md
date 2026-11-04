# QueueTwin working context

## Why it exists

QueueTwin is an open-source simulator that helps backend engineers understand how failures propagate through event-driven architectures. Explainability and reproducibility matter more than visual complexity.

## Technical and business vocabulary

- **Logical message**: the original event identified by `messageId`.
- **Delivery copy**: one independently processed copy; duplicates retain the original logical ID.
- **Attempt**: a worker processing attempt for one delivery copy.
- **Retry**: a scheduled subsequent attempt after a failed one, without delay in M0.
- **DLQ**: conceptual terminal destination when that delivery copy exhausts attempts.
- **Trace**: ordered transition list with deterministic logical offsets.
- **Seed**: integer controlling the pseudorandom sequence.

## Current state

- The v0.1 engine, local API and browser UI exist.
- No AWS integrations, .NET runtime or cloud deployment are implemented.
- Architecture and roadmap deliberately separate abstract model behavior from provider-specific future behavior.

## Paths

- `packages/simulator/src/index.mjs`: validation, pseudo-random generator and transitions.
- `apps/web/`: dashboard.
- `scripts/dev.mjs`: local host.
- `tests/`: invariants and edge cases.
- `docs/adr/`: architectural decisions.

Use this document as brief context, then read exact code/docs before modifying behavior.
