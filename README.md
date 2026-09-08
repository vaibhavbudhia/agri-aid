# AgriAid — Digital Community Resource & Farm Management System

**Course project for UCS503P**, Thapar Institute of Engineering and
Technology.

## Team

| Name | Roll No. |
|---|---|
| Anisa Arora | 1024030285 |
| Lovish Bansal | 1024030297 |
| Neha Bansal | 1024030306 |
| Vaibhav Budhia | 1024030307 |

## Start here
[`docs/PLAN.md`](docs/PLAN.md) — the one planning doc: problem, process,
folder structure, ownership.

## What's working right now
- **`code/frontend/landing.html`** — finished landing page, open directly
  in a browser.
- **Real auth, end-to-end** — register → login → JWT-protected profile
  route.
- **Real Community Resource Network, end-to-end** — list a resource,
  search/filter by type, request a booking, provider accept/reject,
  and transactional conflict detection (two overlapping booking
  requests on the same resource correctly return a 409 — tested).
  Breakdown reporting with nearby-mechanic matching also works.
- **Real frontend** — Vite + React. Login, Register, Dashboard,
  ResourceSearch, Bookings, and BreakdownReport pages all call the
  backend and render real data.

Labour matching, farm ledger, schemes, claims, and admin are still
scaffolded but not implemented — Phases 4-5.

---

## Running it

### 1. Get a Postgres database

You need a running Postgres instance and its connection string. Two options:

**Option A — Supabase (recommended, no local install)**
This is what we're using in production anyway, so it's worth setting up
now instead of a throwaway local DB:
1. Go to [supabase.com](https://supabase.com) → New Project (free tier)
2. Once it's created: **Project Settings → Database → Connection string**
   → copy the "URI" one (looks like
   `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres`)
3. That's your `DATABASE_URL`.

**Option B — Local Postgres on your machine**
- **Mac:** `brew install postgresql@16 && brew services start postgresql@16`,
  then `createdb agriaid`
- **Windows/Linux:** install from [postgresql.org/download](https://www.postgresql.org/download/),
  then `createdb agriaid`
- Your `DATABASE_URL` will be:
  `postgresql://postgres:<your-password>@localhost:5432/agriaid`

Whoever is **not** running Postgres locally just needs the Supabase
connection string shared with them (e.g. via `.env`, kept out of git) —
same database, everyone's backend points at it. No one else needs
Postgres installed at all.

### 2. Backend

```bash
cd code/backend
npm install
cp .env.example .env
# edit .env and paste your real DATABASE_URL, set any JWT_SECRET

npm run migrate     # creates all 13 tables
npm start            # runs on http://localhost:4000
```

Sanity check:
```bash
curl http://localhost:4000/api/health
# {"status":"ok"}
```

### 3. Frontend

```bash
cd code/frontend
npm install
npm run dev           # runs on http://localhost:5173
```

Open `http://localhost:5173` — it redirects to `/login`. Register a new
account, and you'll land on a dashboard showing your real name/role/region,
pulled live from the database.

### 4. Run backend tests
```bash
cd code/backend
npm test
```

---

## Repository Structure
```
project-proposal/    Formal proposal (LaTeX + PDF)
docs/
  PLAN.md              The single planning doc
journals/              Per-person weekly logs
code/
  backend/
    server.js             Entry point
    migrations/            5 SQL files, run in order by migrate.js
    migrate.js              Migration runner
    src/routes/              9 route files (auth, resources, bookings, ...)
    src/controllers/          auth + profile implemented; rest stubbed (501)
    src/models/                user.model.js implemented; rest are shape comments
    src/middleware/             auth.middleware.js — real JWT verification
    test/                        node --test smoke tests
  frontend/
    landing.html               Finished, working landing page
    src/
      pages/Login.jsx            Working
      pages/Register.jsx         Working
      pages/Dashboard.jsx        Working
      pages/*.jsx                 Everything else — stubs, not yet built
.github/workflows/ci.yml    Runs migrations + tests against a real Postgres service
```

## Tech Stack
React + Vite (frontend) · Node.js + Express (backend) · PostgreSQL via
Supabase (database) · Vercel/Render (planned deployment)
