# Planned AWS integration — not yet implemented

There is **no AWS access in M0**. Labels such as SNS and SQS in the UI refer to abstract topology roles.

Potential future model scope, pending research and tests:

1. SQS Standard vs FIFO and their distinct ordering/deduplication guarantees.
2. Visibility timeout, receive-count boundaries, batching and partial-batch responses.
3. SNS fan-out and filter policies.
4. DLQ redrive rules and operational safety boundaries.

An optional infrastructure importer must be read-only, opt-in, least-privilege, and should never ask for credentials in issue comments or in the repository.
