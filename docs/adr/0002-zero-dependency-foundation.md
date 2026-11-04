# ADR 0002 — Zero-dependency foundation, optional future .NET API

- Status: Accepted for M0; revisit at M2
- Date: 2026-11-04

## Context

The first publicly useful demo should be easy to clone, run, test and contribute to, even on machines without a cloud account. The current execution environment also lacks the .NET SDK and access to npm package registries.

## Decision

Implement the M0 model in standard JavaScript ES modules with Node's built-in HTTP server and test runner. Keep the pure engine isolated from the UI and HTTP transport. Define JSON scenarios so a .NET implementation or adapter can later consume equivalent contracts.

## Alternatives considered

- ASP.NET Core simulator immediately: strong fit for backend engineers, but the current environment cannot compile or verify it.
- Full Next.js + hosted backend immediately: adds installation, hosting and authentication complexity before the model is validated.

## Consequences

- `npm run dev` requires only Node 20+ and no network install.
- Initial UI has no large framework runtime.
- Future provider-specific or .NET work needs conformance tests against versioned fixtures; no silent dual-engine drift.
- Production hosting will require a separate hardening ADR and authentication design.
