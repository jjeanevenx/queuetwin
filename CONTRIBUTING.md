# Contributing to QueueTwin

Thanks for helping make asynchronous systems easier to reason about.

1. Search open issues and discussions before starting major changes.
2. Propose provider-specific behavior with official documentation links and a clear list of supported/unsupported semantics.
3. Prefer small PRs with focused tests. Avoid unrelated reformatting.
4. Do not commit secrets, production payloads, customer data, private traces or `.env` files.
5. Run `npm run check`, `npm test` and `npm run smoke` before opening a PR.
6. Update docs, examples and trace accounting when the simulation behavior changes.
7. Introduce an ADR for significant architectural choices.

## First good contributions

- Add a small deterministic scenario fixture with a targeted test.
- Improve keyboard navigation and semantic descriptions.
- Clarify unsupported provider semantics and documentation.
- Write a benchmark for 1,000 messages with bounded trace size.

## Review standards

- A change to a metric must include a definition and invariant test.
- Random values must come from a seed passed into the engine.
- No wall-clock timestamps or network calls are allowed in the pure core.
- Run code and tests locally; do not claim unverified cloud compatibility.
- Browser UI must remain usable on small viewports.

## Pull requests

Use the PR template, reference the relevant issue, list the tests performed and record any intentional limitations. AI-assisted contributions are welcome, but authors are responsible for correctness, safety and licensing.
