# PAWSYNC

**One Community. Every Life.**

PAWSYNC is a community-powered animal rescue platform connecting citizens who discover animals in need with verified volunteers, veterinary resources, shelters, foster homes, donors and adoption networks.

This repository contains **Phase 1** of the full-stack build: a production-structured Node.js/Express/MongoDB backend and a premium React frontend covering the core rescue-to-recovery pipeline end to end, plus the foundational systems (auth, RBAC, payments, notifications, audit logging) that every later phase builds on.

---

## What's implemented in this phase

| Area | Status |
|---|---|
| Brand system, typography, premium floating nav with hover mega-menus, mobile menu | ✅ Done |
| Full-screen animated logo intro on load — entrance, hold, then a dramatic zoom-in before the site is revealed (skips instantly with `prefers-reduced-motion`) | ✅ Done |
| Sign In / Sign Up — split-screen premium layout, icon inputs, password visibility toggle, demo-account autofill, optional "Continue with Google" / "Continue with Facebook" | ✅ Done (social sign-in needs your own OAuth credentials — see below) |
| Landing page (hero, scroll storytelling, how it works, live cases, map preview, donation/adoption/volunteer/lost&found previews, animated impact counters, partner network, CTA, footer) | ✅ Done |
| Auth (JWT, bcrypt, RBAC: citizen/volunteer/vet/shelter/organization/admin, Google/Facebook social sign-in) | ✅ Done |
| Report an Animal → verification → Rescue Case timeline | ✅ Done |
| Donation system: Razorpay order creation, server-side signature verification, webhook handling, idempotency, transparent expense ledger, receipts | ✅ Done |
| Volunteer application + "I Can Help" / "Request Professional Assistance" | ✅ Done (profile + assignment; full nearby-matching dashboard is Phase 2) |
| Adoption marketplace + animal profile | ✅ Done (browsing + interest capture; full application workflow is Phase 2) |
| Contribution points + levels (awarded only after verification) | ✅ Done (backend service; badge/reward marketplace UI is Phase 2) |
| Notifications (in-app) | ✅ Done (email is a logged stub — wire a real provider for production) |
| Admin dashboard: summary cards, report verification queue, case management, donations table | ✅ Done |
| Security: RBAC, rate limiting, Helmet, CORS, NoSQL-injection/XSS sanitization, upload validation, audit logs | ✅ Done |
| Privacy: approximate public locations, exact coordinates restricted to privileged roles | ✅ Done |
| Demo/seed data | ✅ Done — clearly flagged `isDemo: true` |

### Phase 2+ roadmap (not yet built)

Foster network module, Lost & Found matching, full veterinary/shelter directories with admin verification UI, reward marketplace + redemption, volunteer expense reimbursement workflow, full adoption application review pipeline, community moderation/report-a-post tools, email delivery integration, push notifications, and a real interactive map (Mapbox/Google Maps) in place of the current stylized preview. The admin sidebar and this README both flag these clearly so nothing is presented as more finished than it is.

---

## Tech stack

- **Backend:** Node.js, Express, MongoDB + Mongoose, JWT auth, bcrypt, Razorpay SDK, Cloudinary (optional), Multer
- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Framer Motion, Axios, lucide-react icons

---

## Project structure

```
pawsync/
├── backend/
│   ├── config/          # DB + Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # auth, RBAC, rate limiting, validation, uploads, errors
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── services/        # payments, uploads, notifications, points, audit
│   ├── scripts/seed.js  # demo data seeder
│   ├── app.js / server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/  # layout, ui, home, rescue, admin components
    │   ├── pages/        # route-level pages (incl. admin/)
    │   ├── context/      # AuthContext
    │   ├── hooks/        # useFetch, useCountUp
    │   ├── services/     # axios instance
    │   └── styles/       # Tailwind entry + design tokens
    └── vite.config.js
```

---

## Getting started

### Prerequisites

- Node.js 18+
- **MongoDB — you don't need to install anything.** If `backend/.env` still has the default `MONGO_URI` and no local MongoDB is found running, the backend automatically starts a real, built-in MongoDB for you (see "Zero-setup MongoDB" below). You only need your own local `mongod` or an [Atlas](https://www.mongodb.com/atlas) cluster if you specifically want one.
- (Optional) Razorpay test-mode API keys from the [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) — the donation flow works without them via a built-in demo/mock payment simulator
- (Optional) Cloudinary account for image hosting — without it, uploads fall back to local disk storage automatically

### 1. Backend

```bash
cd backend
cp .env.example .env      # then fill in MONGO_URI, JWT_SECRET, etc.
npm install
npm run seed               # populates realistic demo data (safe to re-run)
npm run dev                 # starts the API on http://localhost:5000
```

Demo login accounts (password for all: `Password123!`):

| Role | Email |
|---|---|
| Admin | `admin@demo.pawsync.org` |
| Organization | `org@demo.pawsync.org` |
| Volunteer | `rehan@demo.pawsync.org`, `priya@demo.pawsync.org`, `karan@demo.pawsync.org` |
| Citizen | `citizen@demo.pawsync.org` |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # starts the app on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so no `.env` file is required for local development. The only thing frontend env vars are used for is enabling the optional "Continue with Google/Facebook" buttons — copy `.env.example` to `.env` only if you're setting those up (see "Social sign-in" below).

### 3. Try it out

1. Visit `http://localhost:5173` and explore the landing page.
2. Click **Report an Animal**, submit a report (a Case ID is generated immediately).
3. Sign in as `admin@demo.pawsync.org`, go to **Admin → Rescue Reports**, and verify the report — it becomes a public Rescue Case.
4. In **Admin → Rescue Cases**, approve a donation campaign for that case.
5. Visit the case's donate page and complete a donation — since no live Razorpay keys are configured by default, you'll see a **demo payment simulator** that exercises the exact same server-side verification path a real payment would.

---

## Zero-setup MongoDB (no install needed)

You do **not** need to install MongoDB or create an Atlas account to run this project. If `backend/.env` has the default `MONGO_URI` (or no `.env` at all) and the backend can't find a MongoDB already running on `127.0.0.1:27017`, it automatically starts a real, built-in MongoDB server for you — no extra command, it just happens on `npm run dev`.

What you'll see in the backend terminal the first time:

```
[PAWSYNC] No local MongoDB found on 127.0.0.1:27017.
[PAWSYNC] Starting a built-in MongoDB instead (zero setup - this is a real MongoDB, just running inside this project).
[PAWSYNC] First run downloads the MongoDB binary (~70MB, needs internet) - this can take a minute. Later runs are instant.
[PAWSYNC] Embedded MongoDB connected: 127.0.0.1:<some port>/pawsync
[PAWSYNC] Run `npm run seed` in a new terminal (once) if you have not already, then use the app normally.
```

That one-time download needs internet access. After that first run, it starts instantly, and your data is saved in `backend/.local-mongo-data` (a real database on disk — it survives backend restarts, exactly like a normal local MongoDB would). If you'd rather use your own local `mongod` or an Atlas cluster, just set `MONGO_URI` in `backend/.env` to point at it — the automatic fallback only kicks in when you're using the default local URI and nothing answers on port 27017.

---

## Troubleshooting: "Network Error" / "Request failed with status code 500" on sign in / sign up / donate

These are two different failure modes — here's how to tell them apart and fix each.

### Step 1: check `http://localhost:5000/api/health` in your browser

This endpoint always responds, even if the database is down, and now tells you the database's exact state:

```json
{ "success": true, "service": "pawsync-backend", "status": "ok", "db": "connected", "time": "..." }
```

- **You can't load this page at all** → the backend isn't running/reachable. Go to "Network Error" below.
- **It loads, but `"db"` is `"disconnected"` (or anything other than `"connected"`)** → the backend is up but MongoDB isn't. This is what causes the "Request failed with status code 500" you were seeing on Sign Up and the Donate page. Go to "500 errors" below.

### "Network Error" — the frontend can't reach the backend at all

1. **Backend isn't running, or it crashed on startup.** Check the backend terminal. If `npm run dev` doesn't end with `🐾 PAWSYNC API running on http://localhost:5000`, scroll up — you'll likely see `MongoDB connection error`. Fix `MONGO_URI` in `backend/.env` (a local `mongod` must be running, or your Atlas cluster/connection string must be correct and your IP whitelisted), then restart `npm run dev`.
2. **Frontend wasn't started with `npm run dev`.** The `/api` proxy to `:5000` (configured in `vite.config.js`) only exists in the Vite dev server — opening a built `dist/index.html` directly won't have it.
3. **Wrong port already in use.** If something else is already on port 5000 or 5173, one of the servers may have silently bound to a different port — check the exact URL each terminal prints.

### "Request failed with status code 500" — the backend answered, but errored

As of this update, every route that touches the database now fails fast with a clear **503** and an explicit message ("...cannot reach the database right now...") instead of a generic 500, specifically so this is no longer a mystery. If you're still on an older build, or you see a 500 anywhere, it almost always means **the backend connected to MongoDB successfully at startup, but the connection was lost afterwards** — most commonly:

- A local `mongod` you had running was stopped (Sign Up and the Donate page both hit the database, which is why both broke at the same time).
- An Atlas cluster paused itself (free-tier clusters do this after inactivity), or your IP was removed from the Atlas Network Access allow-list.

Fix: make sure MongoDB is actually running/reachable again, then **restart the backend** (`Ctrl+C`, then `npm run dev`) — check the backend terminal for `[PAWSYNC] MongoDB connected: ...`, and re-check `/api/health` to confirm `"db": "connected"` before retrying Sign Up.

The app's own error messages now say this directly instead of a bare "Network Error" or "500" — if you still see a generic message, do a hard refresh after restarting both servers.

---

## Social sign-in: "Continue with Google" / "Continue with Facebook"

Both buttons on Sign In / Sign Up are **fully optional and safe to leave unconfigured** — without credentials, Google's button shows as disabled and Facebook's button is disabled with a tooltip explaining why; the whole "Or continue with" block hides itself if neither is set up. Regular email/password sign-in is unaffected either way.

To turn them on, you need your **own** OAuth credentials (these can't be shared/pre-filled for you, since they're tied to your own app identity and domain):

**Google** — from the [Google Cloud Console credentials page](https://console.cloud.google.com/apis/credentials):
1. Create an OAuth client ID of type **Web application**.
2. Under "Authorized JavaScript origins", add `http://localhost:5173`.
3. Copy the Client ID into **both**: `GOOGLE_CLIENT_ID` in `backend/.env` and `VITE_GOOGLE_CLIENT_ID` in `frontend/.env` (same value in both places).

**Facebook** — from [Meta for Developers](https://developers.facebook.com/apps):
1. Create an app, add the **Facebook Login** product.
2. Under Facebook Login → Settings, add `http://localhost:5173` to the allowed domains.
3. Copy the App ID into `FACEBOOK_APP_ID` in `backend/.env` **and** `VITE_FACEBOOK_APP_ID` in `frontend/.env`. Optionally also set `FACEBOOK_APP_SECRET` in `backend/.env` — this lets the server double-check every Facebook token was really issued for your app.

Restart both `npm run dev` processes after editing either `.env` file (Vite and Node only read env files at startup). The first person to sign in with a given Google/Facebook account gets a new PAWSYNC account automatically; if that email already has a password-based account, the two get linked instead of creating a duplicate.

---

## Payments: how the demo/mock mode works

`services/paymentService.js` checks whether `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` are set. If not, `createOrder` returns a realistic mock order and `verifySignature` accepts a deterministic mock signature (`mock_sig_<orderId>_<paymentId>`) — this lets the entire donation UI, server-side verification, idempotency and campaign-funding-update logic run end-to-end without live credentials. Drop in real test-mode keys in `.env` and the same code path talks to the real Razorpay APIs and Checkout widget instead — no frontend changes required.

The **webhook** (`POST /api/payments/webhook`) is the authoritative source of truth for payment status in production, independent of anything the browser reports — this matches spec requirement to never trust frontend-only payment success.

---

## Security & privacy notes

- Passwords are hashed with bcrypt (configurable salt rounds); JWTs are used for stateless auth with role-based middleware guarding every privileged route.
- `express-rate-limit` protects auth and public write endpoints from abuse; `helmet`, `express-mongo-sanitize` and `xss-clean` harden every request.
- File uploads are validated by MIME type, extension and size before being accepted (see `middleware/upload.js`).
- Exact GPS coordinates on reports/cases are only ever returned to `admin`, `organization`, `volunteer` and `vet` roles; the public API always receives a randomly-fuzzed approximate point (`utils/geo.js`).
- Every state-changing admin/org action is written to the `AuditLog` collection with actor, before/after snapshots, IP and user agent.
- Contribution points are only ever awarded server-side after verification — never automatically on upload.

---

## A note on this build environment

This project was generated in a cloud sandbox without outbound access to the npm registry, so dependencies could not be installed or executed here to produce a live running screenshot. Every file was written by hand against the documented library APIs, and:

- All 54 frontend `.js`/`.jsx` files were syntax-checked with esbuild.
- The full frontend entry point (`src/main.jsx`) was bundled end-to-end with esbuild to confirm every import path resolves correctly.
- All 52 backend `.js` files were syntax-checked with `node --check`.

You'll still want to run `npm install` yourself in both `backend/` and `frontend/` as the first step — that's expected and normal for any freshly-delivered Node project.
