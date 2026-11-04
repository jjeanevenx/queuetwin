# Claude Code project entrypoint

Follow `AGENTS.md` as the canonical cross-agent contract. Do not rely on conversational memory for architecture decisions: check committed docs on every new session.

## Session startup

1. Read `docs/ai/HANDOFF.md`, `docs/ai/TASKS.md` and `docs/ai/DECISIONS.md`.
2. Identify exactly one issue-sized increment and list acceptance criteria before editing.
3. Read the relevant portions of `docs/architecture.md`, `docs/api.md` and ADRs.
4. For provider modeling, obtain and cite official provider behavior before changing the implementation.

## Useful skills

- `/implement-issue`: implement a narrowly scoped task with tests and handoff.
- `/review-model`: assess simulation semantics, metrics and conformance boundaries.
- `/session-handoff`: record verified work and next steps for another session or coding agent.

## Focused review agents

- `simulation-reviewer`: challenge behavioral assumptions and invariants.
- `test-auditor`: inspect missing cases and reproduce bugs.
- `interface-reviewer`: audit responsive UX, semantics and evidence in screenshots.

Review agents report findings; they should not mutate files while another implementation is in flight unless the human explicitly assigns separate ownership.

## Commands

```bash
npm run check
npm test
npm run smoke
npm run dev
```

No AWS credentials or external packages are needed for M0. See `docs/ai/WORKFLOW.md` for complete handoff discipline.
