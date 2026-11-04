# Security policy

## Reporting

Please use GitHub's private vulnerability reporting feature for the QueueTwin repository when available. Avoid publicly disclosing exploitable security details before a coordinated fix. If private reporting is not yet configured, open a minimal issue requesting a private contact method **without sharing exploit payloads**.

## Supported versions

QueueTwin is experimental and has no production-supported releases yet. Fixes will normally target the latest `main` branch.

## Scope

The v0.1 local server is a development tool bound to loopback by default. It does not implement authentication, tenant isolation or public-service abuse controls. Do not expose it directly to the internet, upload untrusted code, or connect production cloud credentials.

Potential security concerns include parsing untrusted scenario files, denial of service through unusually large inputs, and XSS in future trace display features. These concerns should be covered by security review before any public hosted service.
