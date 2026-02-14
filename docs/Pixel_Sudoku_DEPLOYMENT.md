# Pixel Sudoku — Deployment & Hosting Spec (Replit → Vercel Path)
Version 0.1  
Author: Alex M  
Project Path: /home/amoldove/projects/pixel-sudoku  
Purpose: Deployment addendum for Pixel Sudoku, matching the preferred workflow: **Replit for prototyping**, then **Vercel for production + backend/APIs**.

---

## 0. Goals

1. **Prototype fast** with a shareable URL (Replit).
2. Keep **GitHub as the source of truth**.
3. Ensure the repo can “graduate” to Vercel with **minimal changes**.
4. Support future “tiny backend” features (daily puzzle, telemetry, optional cloud saves).

Non-goals (early phases):
- Full authentication system
- Complex databases on day 1
- Multi-region infra

---

## 1. Phased Hosting Strategy

### Phase A — Replit Prototype
- Host the playable web app with a public URL.
- Optionally run a lightweight API for future-proofing (can be stubbed).
- Push changes frequently to GitHub.

Success criteria:
- A single link opens the latest build.
- Builds locally on Windows 11 + WSL.
- No secrets required for MVP.

### Phase B — Vercel Deploy
- Import GitHub repo into Vercel.
- Production deploys from `main`.
- Preview deploys for PRs.

Success criteria:
- `main` auto-deploys.
- PR previews work.
- SPA routing works on refresh.
- `/api/*` endpoints work in preview + prod (when introduced).

---

## 2. Recommended Repo Layout (B-Ready)

```
pixel-sudoku/
  apps/
    web/                 # React + Vite frontend
    api/                 # Optional local API dev server (Node) for parity
  packages/
    shared/              # shared types (Puzzle schemas), validators
  data/
    puzzles/             # shipped puzzle packs (classic/killer/pixel)
  docs/
    Pixel_Sudoku_SPEC.md
    DEPLOYMENT.md        # this file
```

**Critical rule:** Frontend uses relative API paths:
- `fetch("/api/daily")`
- `fetch("/api/events")`

No hardcoded hostnames.

---

## 3. Build/Dev Commands (Contract)

Root scripts must exist:

- `npm run dev`  
  Starts frontend (and optionally API server).

- `npm run build`  
  Builds production assets.

- `npm run test`  
  Runs unit tests (Sudoku validation, cage constraints, schema parsing).

- `npm run lint`  
  Lints TypeScript.

Implementation suggestion:
- Use `concurrently` so `npm run dev` starts `apps/web` and `apps/api` in one command.

---

## 4. SPA Routing

### Replit
- Ensure the dev server serves the SPA correctly.
- Document which port is exposed to the public Replit URL.

### Vercel
- Configure rewrites so any non-asset route maps to `index.html` (React Router support).
- Confirm refresh on `/classic/1` or `/killer/2` works.

---

## 5. Environment Variables

MVP should require none.

When backend features are introduced:

- `NODE_ENV`
- `DAILY_SEED_SECRET` (deterministic daily puzzle rotation)
- `TELEMETRY_ENABLED` (`true|false`)

Rules:
- `.env.local` gitignored for local dev.
- Replit uses Secrets manager.
- Vercel uses Project Environment Variables.

---

## 6. Replit Setup (Phase A)

### Requirements
- A single “Run” action starts the app.
- Public URL loads and is playable.
- Provide a short doc: `docs/REPLIT.md` explaining:
  - how to run
  - which port
  - expected dev command

### GitHub Flow
- Replit project is connected to GitHub repo.
- Work happens on feature branches:
  - Pull `main`
  - Branch
  - Commit
  - Push
  - PR

Avoid “Replit-only” state that can’t be reproduced locally.

---

## 7. Vercel Setup (Phase B)

### Import
- Import GitHub repo in Vercel dashboard.
- Set build command to your monorepo conventions (examples below).

### Typical settings (example)
If `apps/web` is the frontend:
- Root directory: `apps/web`
- Build command: `npm run build`
- Output directory: `dist`

If using monorepo tooling (e.g., npm workspaces / pnpm), document the exact commands in `docs/VERCEL.md`.

### Previews
- Verify PR preview URL works.
- Verify SPA routing works on preview.

---

## 8. Future Backend Features (Optional)

Pixel Sudoku is primarily a client-side game. Backend should stay tiny.

### B1 — Daily Sudoku Rotation
**Endpoint**
- `GET /api/daily?mode=classic|killer|pixel`

**Response**
```json
{
  "date": "YYYY-MM-DD",
  "mode": "classic",
  "puzzleId": "classic-002"
}
```

Rules:
- Deterministic selection using `DAILY_SEED_SECRET + date + mode`.
- Start with a curated allowlist of puzzle IDs.

### B2 — Anonymous Telemetry (Optional)
**Endpoint**
- `POST /api/events`

**Payload**
```json
{
  "event": "puzzle_complete",
  "mode": "killer",
  "puzzleId": "killer-003",
  "seconds": 512,
  "hintsUsed": 1,
  "mistakes": 0,
  "clientVersion": "0.1.0"
}
```

Rules:
- No PII.
- Respect opt-out.
- Store minimally (log-only first).

### B3 — Cloud Saves (Later)
Only if cross-device continuity is needed.
- `GET /api/progress`
- `PUT /api/progress`

Requires auth — defer until the game has strong retention.

---

## 9. Persistence Strategy (Don’t Commit Early)

For backend, use an abstraction in `packages/shared`:

- `getDaily(date, mode)`
- `putDaily(date, mode, puzzleId)`
- `appendEvent(event)`

Implementations:
- in-memory (dev)
- JSON file (dev-only)
- managed KV/Redis
- Postgres (later)

---

## 10. Testing & QA Checklist

### Unit tests
- Classic sudoku constraint validation
- Killer cage uniqueness + sum validation
- Puzzle schema parsing

### Smoke tests
- Replit URL loads and plays
- Local `npm run dev` works (WSL)
- Vercel preview loads for PR
- SPA refresh works (no 404)
- (When added) `/api/daily` returns valid puzzleId

---

## 11. Deliverables for Coding Agent

1. `docs/DEPLOYMENT.md` (this file) added to repo.
2. `docs/REPLIT.md` with run instructions.
3. `docs/VERCEL.md` with deployment configuration (no secrets).
4. A minimal CI check (optional) that runs lint + test on PRs.

---

End of DEPLOYMENT.md
