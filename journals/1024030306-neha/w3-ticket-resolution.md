# Week 3 — Ticket Resolution

| Ticket | Description | Status |
|---|---|---|
| AGR-10 | Write migration 001: users, farmer_profiles | Done |
| AGR-11 | Write migration 002: resources, resource_availability | Done |
| AGR-12 | Write migration 003: bookings, booking_group_members, breakdown_reports | Done |
| AGR-13 | Write migration 004: labour_requests, ledger_entries | Done |
| AGR-14 | Write migration 005: schemes, scheme_applications, insurance_claims, claim_documents | Done |
| AGR-15 | Run migrations against a real local Postgres instance and verify all 13 tables | Done |

## Notes
Ran `node migrate.js` against a real local Postgres 16 install and confirmed
all 13 tables via `\dt` — not just written SQL, actually executed and
verified. Used UUID primary keys with `gen_random_uuid()` (pgcrypto) and
CHECK constraints for enum-like fields since we're not using an ORM.
