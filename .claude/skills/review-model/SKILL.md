---
name: review-model
description: Review QueueTwin simulation behavior for invariant violations, hidden assumptions and provider-model overclaims.
---

1. Read `docs/architecture.md`, `docs/api.md`, `docs/ai/DECISIONS.md` and simulator source.
2. Inspect published metrics, event transitions, seed use, edge cases and input validation.
3. Compare claims against actual tests and supported behavior. Do not conflate abstract M0 semantics with AWS.
4. Run deterministic fixtures and report findings by severity with reproduction steps.
5. Do not modify source during review unless the requesting human explicitly asks for a fix.
