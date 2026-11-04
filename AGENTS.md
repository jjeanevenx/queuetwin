# QueueTwin — shared AI agent instructions

These instructions apply to Claude Code, Codex, GitHub Copilot and other coding assistants. Human contributors remain responsible for the work they accept.

## Read first

1. `README.md` and `docs/product.md` for product intent and scope.
2. `docs/architecture.md` for precise M0 semantics and invariants.
3. `docs/ai/TASKS.md` to pick a bounded task.
4. `docs/ai/DECISIONS.md` and the relevant ADR before changing boundaries.
5. `docs/ai/HANDOFF.md` to continue unfinished work.

## Core invariants

- The pure simulator does not perform I/O, use wall-clock time or call cloud services.
- Same model version, input and seed must produce identical output.
- `delivered` counts *copies*; `uniqueDelivered` counts logical IDs.
- Every scenario change must preserve or explicitly revise the accounting equations in `docs/architecture.md`, with tests.
- Unsupported AWS/SNS/SQS/Kafka semantics must never be claimed as implemented.
- Synthetic fixtures only. Never commit or print secrets or real customer event payloads.

## Change protocol

1. State the task, scope, files affected, acceptance criteria and explicit non-goals.
2. Make the smallest safe increment. Prefer tests for a failing model case before implementation.
3. Record major decisions in a new numbered ADR; do not silently replace an accepted decision.
4. Run `npm run check`, `npm test`, `npm run smoke`, and visual checks for UI work.
5. Update `docs/ai/TASKS.md` and `docs/ai/HANDOFF.md` with factual status and test evidence.
6. Leave the tree clean or document exactly which files and work remain uncommitted.

## Safety and authority

- Do not provision or mutate AWS resources, install paid dependencies, deploy publicly or publish releases without the requesting human's permission.
- Do not upload documents or logs to third-party models unless the user authorized it.
- Do not disable CI, delete tests, weaken input bounds, force-push or rewrite git history to make checks pass.
- Production integrations must use least privilege, dry-run defaults and an explicit trust-boundary review.

## Code conventions

- Keep source comments and canonical technical docs in English; translate user-facing material separately.
- Prefer pure functions, explicit contracts and boring dependencies.
- Use `node:test` and `assert/strict` in M0.
- Use `textContent`/DOM nodes for untrusted strings; avoid `innerHTML` for dynamic inputs.
- Avoid adding infrastructure or frameworks until a milestone requires them.

## Definition of done

The behavior works as described, failure cases are tested, model claims are accurate, docs/handoff are updated and changes have an auditable reviewable diff.
