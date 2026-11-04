# Roadmap and issue-sized increments

Each milestone must produce runnable tests and docs before expanding scope. The roadmap is a proposal, not a promise of release dates.

## M0 — Runnable foundation (implemented)

- [x] Deterministic engine with seed and validation.
- [x] Topic → queue → worker → DLQ topology demonstration.
- [x] Failure, retry and duplicate-copy simulation.
- [x] Metrics, trace and accounting invariants.
- [x] Accessible browser dashboard and preset examples.
- [x] Local API, smoke test, CI, contributor and AI instructions.

## M1 — Topology graph contracts

- [ ] Define `ScenarioGraph` JSON Schema: nodes, edges, policies, version.
- [ ] Validate acyclicity or explicitly model cycles and hop limits.
- [ ] Route logical messages across user-defined node graphs.
- [ ] Build accessible node/edge editor (keyboard first).
- [ ] Import/export graphs and canonical fixtures.
- **Acceptance:** graph version, seed and input reproduce the same trace; invalid graphs fail with actionable errors.

## M2 — Provider model plug-ins

- [ ] Write ADR for SQS Standard and FIFO semantics; cite provider docs.
- [ ] Model visibility timeouts, receive counts and dead-letter redrive policies.
- [ ] Model SNS subscription filters/fan-out, with explicitly tested rules.
- [ ] Add concurrency scheduler, backoff and virtual time.
- [ ] Add `ProviderModel` interface and conformance suites.
- **Acceptance:** fixture-based behavior matches a documented supported subset; unsupported provider behavior is visible in UI and outputs.

## M3 — Resilience experiments

- [ ] Simulate downstream outages and throttling.
- [ ] Model bounded worker concurrency and queue-depth growth.
- [ ] Add idempotency-key strategies and duplicate-effect warnings.
- [ ] Compare two strategies side-by-side with reproducible inputs.
- **Acceptance:** metrics expose assumptions and can be derived from traces.

## M4 — Collaboration and CI

- [ ] Versioned scenario file contracts and CLI runner.
- [ ] Markdown/JSON report generation and PR artifact publishing.
- [ ] Scenario diffing and regression thresholds.
- [ ] Contributor example packs for retail/finance/workflow cases using synthetic data only.
- **Acceptance:** headless CI yields exit codes and deterministic artifacts.

## M5 — Optional adapters and .NET track

- [ ] Prototype read-only import from Terraform, CDK and serverless.yml.
- [ ] Evaluate .NET 8/10 typed SDK or service adapter with OpenAPI.
- [ ] Sandbox cloud APIs behind explicit dry-run and least-privilege policies.
- [ ] Add multi-language UI when translation review capacity exists.
- **Acceptance:** local mode remains fully operational offline and no deployment executes cloud writes by default.

## Backlog hygiene

Start from [TASKS](ai/TASKS.md), open focused GitHub issues, record significant decisions under `docs/adr/`, and update [HANDOFF](ai/HANDOFF.md) whenever work spans sessions.
