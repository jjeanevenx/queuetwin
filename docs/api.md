# Local HTTP API — v0.1

Base URL: `http://127.0.0.1:4173`. This API is a development convenience; it is not publicly hosted, authenticated, versioned for production compatibility, or stable beyond the v0.x series.

## `GET /api/health`

Returns `{ "status": "ok", "modelVersion": "0.1.0" }`.

## `GET /api/scenarios`

Returns `{ "scenarios": [...] }` from three repository fixtures.

## `POST /api/simulate`

`Content-Type: application/json`; maximum body size 16 KiB.

Request fields:

| Field | Type | Allowed | Default |
| --- | --- | --- | --- |
| `name` | string | 1–120 characters | `Basic retry and DLQ` |
| `messageCount` | integer | 1–1,000 | 10 |
| `maxAttempts` | integer | 1–10 | 3 |
| `failureProbability` | integer | 0–100 (%) | 15 |
| `duplicateProbability` | integer | 0–100 (%) | 10 |
| `seed` | integer | 0–4,294,967,295 | 42 |

All fields are optional, but unknown fields are currently ignored. The full normalized scenario is returned in the result. The model uses a seeded PRNG so the same input yields the same result for a fixed model version.

Response:

```json
{
  "modelVersion": "0.1.0",
  "scenario": { "name": "Test", "messageCount": 1, "maxAttempts": 1, "failureProbability": 0, "duplicateProbability": 0, "seed": 42 },
  "metrics": { "published": 1, "enqueued": 1, "duplicateCopies": 0, "attempts": 1, "delivered": 1, "uniqueDelivered": 1, "failedAttempts": 0, "retriesScheduled": 0, "deadLettered": 0 },
  "trace": [
    { "sequence": 1, "timeMs": 0, "kind": "published", "messageId": "m-001", "copy": 1, "attempt": 0, "outcome": "accepted", "description": "Publish m-001 to topic" },
    { "sequence": 2, "timeMs": 12, "kind": "enqueued", "messageId": "m-001", "copy": 1, "attempt": 0, "outcome": "enqueued", "description": "Enqueue m-001 to queue" },
    { "sequence": 3, "timeMs": 24, "kind": "processed", "messageId": "m-001", "copy": 1, "attempt": 1, "outcome": "delivered", "description": "Process m-001 (copy 1, attempt 1)" }
  ],
  "assumptions": ["..."]
}
```

Errors are JSON `{ "error": "..." }` with HTTP 400 for invalid scenarios/JSON, 413 for oversized payloads, 404 for missing routes, and 500 for unexpected server errors.

## Compatibility

Because v0.1 is an early experimental version, consumers should check `modelVersion` and not infer provider behavior. A formal versioned schema will be introduced before public SDKs.
