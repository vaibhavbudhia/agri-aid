# Week 3 — Ticket Resolution

| Ticket | Description | Status |
|---|---|---|
| AGR-16 | Implement real `user.model.js` query functions | Done |
| AGR-17 | Implement `POST /api/auth/register` with bcrypt hashing | Done |
| AGR-18 | Implement `POST /api/auth/login` with credential check + JWT | Done |
| AGR-19 | Implement `GET /api/profile` (protected route) | Done |

## Notes
Tested the full flow with curl against the real DB: register, duplicate
register (409), login, login with wrong password (401), protected route
without token (401), protected route with token (200, real data). All
verified working, not just written.
