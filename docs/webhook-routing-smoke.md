# Webhook routing smoke test

This documentation-only change validates Horizon's signed GitHub push routing
for the `main` branch on 2026-10-01. It does not change application behavior.

Only jobs configured for this repository and `main` should be selected. Jobs
configured for `dev` must not be triggered by this push.
