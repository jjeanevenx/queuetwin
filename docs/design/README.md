# QueueTwin v0.1 dashboard design reference

The generated UI concept at `dashboard-concept.jpg` is a visual direction reference, not a screenshot of the actual application. It inspired the code-native interface under `apps/web/`.

## Design intent

- Full-page midnight navy workspace with cool neutral panel surfaces.
- Slim sidebar and one clear primary action.
- Topology centered in the largest area; trace directly below.
- Settings inspector at the right on wide viewports and above topology on narrow screens.
- Cyan for successful transitions and actions; amber for retries/duplicates; red for failed/dead-letter outcomes.
- Tight but readable tabular event data, no decorative performance charts or unsupported metrics.

## Design tokens used in current implementation

| Token | Value |
| --- | --- |
| Background | `#0b1220` |
| Panel | `#111c2d` |
| Muted text | `#a9b6c7` |
| Border | `#34445a` |
| Primary accent | `#38c7da` |
| Retry | `#ffc048` |
| Failure | `#ff6d73` |

## Verification limitation

The current execution environment can run the local Node server, but the connected browser lives on another machine and cannot reach its `127.0.0.1` address. A Chromium binary is unavailable locally. The actual UI render has **not** been visually compared to the concept yet; treat visual fidelity as unverified until a contributor runs it and attaches desktop/mobile screenshots.
