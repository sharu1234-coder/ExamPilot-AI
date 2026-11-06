# ExamPilot AI

> Your entire semester. One intelligent workspace.

**Status: Milestone 1 — Android development foundation.** The public-facing product is a **React Native Android application** in `mobile/`, now containing four premium native screens, interactive tasks, a focus timer and attendance projections. `frontend/` is an optional responsive **design reference** rather than the Android app. Backend health checks and tests are present. Student authentication, persistent records, AI assistants and payment flows are **not implemented yet**. It is not ready for public users or payments.

## Product direction

ExamPilot is an India-first, academic operating system that connects semester scheduling, attendance, assignments, exams and learning tools. Core academic calculations will be deterministic; AI features will be source-grounded and strictly metered.

## Stack

- Android app: React Native, Expo SDK 58, TypeScript, Expo Router, Lucide icons.
- Design reference only: React, TypeScript, Vite.
- Backend: Python 3.12, FastAPI, SQLAlchemy 2, PostgreSQL, Pydantic Settings, Pytest.
- Database: PostgreSQL 16+ (18 supported) with migrations added in the next milestone.

## Start on Windows (PowerShell / VS Code)

Open this `exampilot-ai` folder in VS Code, then use two terminals. **Android is the primary project**.

**Android prerequisite:** Node.js **22.13+** is required by Expo SDK 58. If you still have Node 20.17.0, upgrade Node first and confirm with `node -v`.

**First-time PostgreSQL setup** (PowerShell; enter your own password at the prompt):

```powershell
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE exampilot_db;"
```

If PowerShell cannot find `psql`, use the full path to your installed PostgreSQL `psql.exe`. If the database already exists, skip this command.

**Terminal 1 — backend**

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
# Edit backend/.env with your own local PostgreSQL password (never commit it).
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Visit http://127.0.0.1:8000/health/live and http://127.0.0.1:8000/docs. Readiness checks require a running database and correct `DATABASE_URL`.

**Terminal 2 — Android app**

```powershell
cd mobile
npm ci
npx expo start
```

For SDK 58, use an Android emulator or a compatible development build; see `mobile/README.md` for device setup and APK builds. The app currently runs with local demonstration data, so it does not need the backend server to show the screens.

**Optional — visual design reference (not Android)**

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Visit http://127.0.0.1:5173 only if you want to review the earlier browser design. It is not what we will publish to Google Play.

## Checks

```powershell
# From backend with .venv active
python -m pytest -q

# From frontend
npm run typecheck
npm run build

# From mobile
npx tsc --noEmit
npx expo lint
npm test
```

## Roadmap and product constraints

1. Review Android UI, tap targets and usability on multiple real phone sizes; create original app icon and splash artwork.
2. Add Alembic migrations, secure account identity and user-owned academic terms.
3. Connect timetable, attendance, assignments, exams and grade calculations to API.
4. Add private uploaded study materials and source-grounded retrieval.
5. Add measured AI quiz generation, study plans, billing and public release gates.

See [`docs/architecture.md`](docs/architecture.md) for entity relations, API boundaries, and acceptance criteria.

## Quality bar

- No fake data outside clearly marked preview/demo screens.
- Never trust client-provided user IDs, payment status, or attendance formulas.
- No paid subscriptions or real student uploads until privacy controls, access isolation, backups, quotas and support channels have been verified.
- Automated tests and peer visual QA are required before public launch.

