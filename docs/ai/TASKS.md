# Task board

This file tracks implementation scope across sessions. GitHub Issues should become the external source of task assignments once the repository is published.

## Completed — M0

- [x] M0-001 — Create repository structure, docs and license.
- [x] M0-002 — Build deterministic core with reproducibility/invariant tests.
- [x] M0-003 — Expose local simulation and scenario endpoints.
- [x] M0-004 — Build responsive interactive dashboard.
- [x] M0-005 — Add contributor/AI workflows and CI configuration.

## Next candidates — do not start all at once

- [ ] M1-001 — Draft `ScenarioGraph` JSON Schema, example graph, versioning and validation tests.
- [ ] M1-002 — Design deterministic event scheduler with explicit virtual time and tie-break rules.
- [ ] M1-003 — Add an editable topology prototype after graph contract approval.
- [ ] M1-004 — Add headless CLI to run a JSON scenario and write stable JSON output.
- [ ] M1-005 — Introduce exhaustive property-based invariant tests without weakening current contracts.

## Blockers / decisions

- Repository publication requires an empty public repository `jjeanevenx/queuetwin` to be created or browser authorization for repository creation.
- Model semantics for real SQS Standard/FIFO require a new research-backed ADR and test plan.
- The .NET adapter is deferred; no uncompiled .NET code should be presented as verified.
