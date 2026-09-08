# Week 4 (Phase 3, compressed to 4-day prototype push) — Ticket Resolution

| Ticket | Description | Status |
|---|---|---|
| AGR-38 | Write real `resource.model.js` query functions | Done |
| AGR-39 | Write real `booking.model.js` with FOR UPDATE conflict lock | Done |
| AGR-40 | Write real `breakdown.model.js` + nearby-mechanic query | Done |

## Notes
Resource/booking/breakdown tables were already migrated back in Week 3,
so this week was just the query layer on top. Nearby-mechanic matching
is a simple "same type=service listing" join for now — real distance
calculation needs lat/lng on every listing, which is flagged as a
follow-up (matches R3 in the risk register).
