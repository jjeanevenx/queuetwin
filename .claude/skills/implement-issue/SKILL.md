---
name: implement-issue
description: Implement one scoped QueueTwin task with deterministic tests, docs and a verified handoff.
---

1. Read `AGENTS.md`, `docs/ai/TASKS.md`, `docs/ai/HANDOFF.md`, relevant ADRs and current source.
2. Identify a single issue ID and list acceptance criteria, explicit non-goals and likely files.
3. Obtain clarification before altering provider semantics or changing a public contract.
4. Add a regression test or fixture, then implement the smallest safe change.
5. Run `npm run check`, `npm test`, `npm run smoke`; verify browser UI when relevant.
6. Update docs/ADRs if behavior changed. Mark task evidence and next steps in `docs/ai/HANDOFF.md`.
7. Summarize factual results, remaining risks and files changed. Do not claim passing checks that were not run.
