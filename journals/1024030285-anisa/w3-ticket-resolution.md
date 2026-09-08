# Week 3 — Ticket Resolution

| Ticket | Description | Status |
|---|---|---|
| AGR-25 | Set up real Vite + React build (replacing static stubs) | Done |
| AGR-26 | Build working `Login.jsx` and `Register.jsx` against the live API | Done |
| AGR-27 | Build working `Dashboard.jsx` fetching real profile data | Done |
| AGR-28 | Wire routing in `App.jsx`, root redirects to `/login` | Done |

## Notes
Verified the whole flow in an actual browser (Playwright), not just by
reading the code: root redirects to /login, filled out the register form,
submitted, landed on /dashboard, and it displayed the exact name/region
that was typed in — round-tripped through the real backend and DB.
No styling yet — that's next, once Foundation is fully wired.
