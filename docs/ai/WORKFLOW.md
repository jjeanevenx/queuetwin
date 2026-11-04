# AI-assisted development workflow

## General rule

The repository is the shared memory. Chat threads, model context windows and hidden agent state are not reliable long-term storage. Work should survive a complete model switch.

## Start a task

1. Read `AGENTS.md`, `CONTEXT.md`, `HANDOFF.md`, `TASKS.md` and relevant ADRs.
2. Pick one issue and write: goal, in-scope, out-of-scope, files likely touched, tests and risks.
3. Inspect the actual working tree, because it may contain another person's changes.
4. If semantics are ambiguous, record the choice in an ADR or ask for human approval.

## During implementation

- Keep one owner per overlapping file region. Separate implementation and reviews.
- Prefer tests and synthetic fixtures over manual examples.
- Log assumptions in code comments or docs where they will be found.
- Never introduce a second calculation of metrics in the UI.
- Never make actual AWS calls in simulator tests.
- If a tool or permission is unavailable, report the exact limitation. Do not fake verification.

## End a task

1. Run tests and smoke checks; browser verification if UI changed.
2. Update `TASKS.md` and `HANDOFF.md` with changed files and observed results.
3. Add or update ADRs, API docs and examples for behavior changes.
4. Provide a concise summary: behavior, evidence, unresolved risks, next issue.
5. If opening a PR, use the template and request human review for architecture/provider behavior changes.

## Recommended change types

- **docs:** clarifications, provider references and examples.
- **test:** regression fixtures or coverage improvement.
- **feat:** one feature and its tests.
- **fix:** minimal reproduction and correction.
- **refactor:** behavior-preserving change with equivalent outputs.

## Definition of ready for a provider-specific model

Official docs for precise behavior, a bounded subset specification, at least one edge-case fixture per rule, explicit unsupported semantics, and a deterministic tie-breaking policy.

## Example Claude Code prompts

**Start:** “Read CLAUDE.md and the current handoff. Propose a plan for M1-001 without editing; include an explicit JSON Schema draft, migration strategy and acceptance tests.”

**Implement:** “Use the implement-issue skill for M1-001 only. Update the JSON contract, tests, ADR and handoff. Do not add provider-specific behavior or deploy anything.”

**Review:** “Use the review-model skill. Find contradictions between the code, metrics, tests and the documented assumptions; report severity and reproduction.”

**Handoff:** “Use the session-handoff skill. Record what actually passed and what the next agent must inspect.”
