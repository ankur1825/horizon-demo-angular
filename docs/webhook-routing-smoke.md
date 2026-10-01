# Webhook routing smoke test

This documentation-only change validates Horizon's signed GitHub push routing
for the `dev` branch on 2026-10-01. It does not change application behavior.

The expected job is selected from its configured repository and branch, not
from a hard-coded job name or a manually configured Jenkins trigger.
