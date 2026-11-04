# Planned .NET integration — not yet implemented

QueueTwin's pure M0 engine is JavaScript, with JSON input/output described in `docs/api.md`. A future .NET adapter or separate engine requires a design ADR and shared conformance fixtures before implementation.

Candidate components:

- `QueueTwin.Contracts` — versioned JSON Schema and .NET DTOs.
- `QueueTwin.Application` — simulation-use-case boundaries.
- `QueueTwin.Adapters.Http` — optional ASP.NET Core API.
- `QueueTwin.Adapters.Aws` — explicitly read-only AWS topology importer.

Do not publish a .NET package or claim behavior parity until the implementation is compiled and tested with a supported .NET SDK.
