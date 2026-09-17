# PAWSYNC

**One Community. Every Life.**

PAWSYNC is a community-powered animal rescue platform connecting citizens who discover animals in need with verified volunteers, veterinary resources, shelters, foster homes, donors and adoption networks.

This repository contains **Phase 1** of the full-stack build: a production-structured Node.js/Express/MongoDB backend and a premium React frontend covering the core rescue-to-recovery pipeline end to end, plus the foundational systems (auth, RBAC, payments, notifications, audit logging) that every later phase builds on.

---

## What's implemented in this phase

| Area | Status |
|---|---|
| Brand system, typography, premium floating nav, mobile menu | ✅ Done |
| Landing page (hero, scroll storytelling, how it works, live cases, map preview, donation/adoption/volunteer/lost&found previews, animated impact counters, partner network, CTA, footer) | ✅ Done |
| Auth (JWT, bcrypt, RBAC: citizen/volunteer/vet/shelter/organization/admin) | ✅ Done |
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
- A MongoDB instance — local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
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

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`, so no extra frontend env configuration is needed for local development.

### 3. Try it out

1. Visit `http://localhost:5173` and explore the landing page.
2. Click **Report an Animal**, submit a report (a Case ID is generated immediately).
3. Sign in as `admin@demo.pawsync.org`, go to **Admin → Rescue Reports**, and verify the report — it becomes a public Rescue Case.
4. In **Admin → Rescue Cases**, approve a donation campaign for that case.
5. Visit the case's donate page and complete a donation — since no live Razorpay keys are configured by default, you'll see a **demo payment simulator** that exercises the exact same server-side verification path a real payment would.

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

- All 51 frontend `.js`/`.jsx` files were syntax-checked with esbuild.
- The full frontend entry point (`src/main.jsx`) was bundled end-to-end with esbuild to confirm every import path resolves correctly.
- All backend `.js` files were syntax-checked with `node --check`.

You'll still want to run `npm install` yourself in both `backend/` and `frontend/` as the first step — that's expected and normal for any freshly-delivered Node project.
