# Week 4 (Phase 3, compressed to 4-day prototype push) — Ticket Resolution

| Ticket | Description | Status |
|---|---|---|
| AGR-30 | Implement `resources.controller.js` (list + create, real DB) | Done |
| AGR-31 | Implement `bookings.controller.js` (create, accept/reject, list) | Done |
| AGR-32 | Implement transactional conflict-detection in `booking.model.js` | Done |
| AGR-33 | Implement `breakdown.controller.js` (report + nearby mechanics) | Done |

## Notes
Conflict detection uses `SELECT ... FOR UPDATE` inside a transaction to
avoid a race condition where two farmers could both get a "success"
response for the same overlapping slot if they hit the endpoint at the
same instant. Tested this directly: booked a tractor 8am-6pm, accepted
it, then tried to book an overlapping window as a different farmer —
correctly got a 409. A non-overlapping booking the next day succeeded.
