# Product requirements — QueueTwin

## Problem

Engineers often reason about asynchronous failure handling through diagrams, ad-hoc scripts and anecdotal incidents. A reproducible simulation makes assumptions explicit and exposes retry storms, duplicates and DLQ outcomes in a reviewable trace.

## Users

1. Backend engineers learning or reviewing event-driven architectures.
2. Solution architects teaching failure-mode tradeoffs.
3. SREs preparing non-production incident exercises.
4. Open-source contributors improving provider-specific model accuracy.

## North star

**From scenario to explainable trace in under one minute, without connecting to production.**

## Current user story (M0)

As an engineer, I can choose a sample or enter failure parameters, run a seeded simulation, inspect chronological transitions and compare delivered copies, unique logical messages, retries and DLQ outcomes.

### Acceptance criteria

- Identical model version, input and seed produce identical JSON output.
- Invalid data is rejected, not silently clamped.
- Trace includes a stable sequence number and logical time offset.
- Copy-level accounting is unambiguous and tested.
- App works without any database, AWS account or LLM API.
- UI provides a compact, accessible mobile view.

## Non-goals for M0

- Production monitoring or replacement for integration testing.
- AWS billing estimates, reliability guarantees or real infrastructure changes.
- Execution of arbitrary scripts uploaded by users.
- Multi-user authentication, persistence, telemetry, payments or cloud hosting.
- Modeling ordering, batch semantics, concurrency, visibility timeouts or delays.

## Product principles

- **Model truthfulness:** label every abstraction and document provider limitations.
- **Deterministic first:** no hidden clocks, uncontrolled randomness or network-dependent results.
- **Safe by default:** local examples, no production credentials, no side effects.
- **Evidence over scores:** every metric should be derivable from trace records.
- **Composability:** provider adapters are explicit extensions, not hidden assumptions.
- **Accessible UI:** keyboard control, semantic tables, status and contrast.

## Success measures for later public beta

- First-run completion (open app → simulation outcome).
- Percentage of scenarios reproducible from exported JSON.
- Number of externally contributed scenario fixtures with tests.
- Reported model discrepancies accompanied by minimal reproductions.

No user or revenue metrics have been measured yet.
