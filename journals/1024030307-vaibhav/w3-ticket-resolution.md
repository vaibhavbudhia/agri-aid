# Week 3 — Ticket Resolution

| Ticket | Description | Status |
|---|---|---|
| AGR-20 | Wire `db.js` to a real Postgres connection pool | Done |
| AGR-21 | Implement real `auth.middleware.js` (JWT verification) | Done |
| AGR-22 | Add `.env.example` and `migrate.js` runner script | Done |
| AGR-23 | Write real `node --test` smoke tests | Done |
| AGR-24 | Fill in real CI workflow (Postgres service, migrate, test) | Done |

## Notes
CI now spins up an actual Postgres service container, runs migrations
against it, then runs the test suite — not placeholder echo steps
anymore. Couldn't test the GitHub Actions run itself outside of GitHub,
but every step in it is the same command verified locally.
