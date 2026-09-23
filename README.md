# Visitor Management System

A desk-side visitor management app: walk-in registration, host approval by email, QR pass check-in/out, employee pre-invites, and admin oversight.

## Assignment overview (architecture)

Assignment system flow (original brief):

![Assignment architecture — entry portal, host approval, QR scan, database](docs/assignment-architecture.png)

Implemented flow (includes **check-out**: second pass scan at `/entry/scan` when leaving):

```mermaid
flowchart TB
  subgraph Portal["Public entry"]
    MakeEntry["Make entry — fill details + Request"]
    HavePass["Already have pass — scan QR / pass code"]
    SeeStatus["See status — lookup by email"]
  end

  subgraph Auth["Login"]
    Login["/login"]
    AdminDash["Admin — dashboard"]
    EmpDash["Employee — visitor status + pre-invite"]
  end

  Login --> AdminDash
  Login --> EmpDash

  MakeEntry --> Email["Resend — host email"]
  Email --> HostChoice{"Accept / Decline"}
  HostChoice -->|Accept| Pass["QR + pass code"]
  HostChoice -->|Decline| Reject["Reject"]
  Pass --> SeeStatus

  HavePass --> Scan["Verify at desk — check-in or check-out"]
  MakeEntry --> DB[(Database)]
  Reject --> DB
  Scan --> DB
  HostChoice --> DB
  EmpDash --> DB
  AdminDash --> DB
```

**Checkout (implemented):** same pass scan at `/entry/scan` — first scan **APPROVED → CHECKED_IN**, second scan **CHECKED_IN → CHECKED_OUT** (pass invalidated, `qrCode` cleared). Status page shows exit success after checkout.

Assignment tech stack (original brief):

![Assignment tech stack](docs/assignment-tech-stack.png)

| Area | Choice |
|------|--------|
| Language | TypeScript |
| Frontend / backend | Next.js (App Router) |
| QR + validation | html5-qrcode, Zod |
| State management | Zustand |
| ORM | Prisma |
| Database | PostgreSQL (Docker locally; Neon or other host for deploy) |
| Email | Resend |
| Images | Cloudinary |

## Tech stack

| Layer | Technology | Role in this project |
|--------|------------|----------------------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) | Full application: pages, Server Actions, API routes, `proxy.ts` auth gate |
| **UI** | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) | Components, layout, dark/light theme (`next-themes`) |
| **Language** | TypeScript | End-to-end typing |
| **Database** | [PostgreSQL](https://www.postgresql.org) + [Prisma 7](https://www.prisma.io) | Visits, visitors, employees, admins |
| **Validation** | [Zod](https://zod.dev) | Server Action input checks (login, register, visitor entry, pre-invite) |
| **Client state** | [Zustand](https://zustand.docs.pmnd.rs) | Auth UI, dashboard modals; synced from server via `AuthHydrator` + `/api/auth/session` |
| **Auth** | HTTP-only cookie + `proxy.ts` | Session `role:id`; route protection before render; `lib/auth/session.ts` on login/logout |
| **Images** | [Cloudinary](https://cloudinary.com) | Visitor photos at registration; optional employee profile photos |
| **Email** | [Resend](https://resend.com) | Host approval emails with Approve / Deny links |
| **QR** | [html5-qrcode](https://github.com/mebjas/html5-qrcode) + QR image API | Scan pass at desk; pass encodes check-in URL |
| **Passwords** | bcrypt (via `lib/auth/password.ts`) | Hashed employee and admin passwords |

---

## High-level architecture

```mermaid
flowchart TB
  subgraph Public["Public entry"]
    Home["/ — Entry home"]
    New["/entry/new — Register"]
    Scan["/entry/scan — Pass check-in"]
    Status["/entry/status — Lookup by email"]
  end

  subgraph Auth["Auth"]
    Login["/login"]
    Proxy["proxy.ts — cookie gate"]
  end

  subgraph Employee["Employee"]
    EmpDash["/employee — Dashboard"]
    PreInvite["Pre-invite visitors"]
    ApproveUI["Approve/deny pending visits"]
  end

  subgraph Admin["Admin"]
    AdminDash["/admin — Visits + hosts"]
  end

  subgraph HostEmail["Host email links"]
    ApproveLink["host approve by token"]
    DenyLink["host deny by token"]
  end

  Home --> New
  Home --> Scan
  Home --> Status
  Home --> Login
  Login --> Proxy
  Proxy --> EmpDash
  Proxy --> AdminDash
  New --> Resend["Resend email"]
  Resend --> ApproveLink
  Resend --> DenyLink
  Scan --> PG[(PostgreSQL)]
  New --> PG
  EmpDash --> PG
  AdminDash --> PG
```

---

## Visitor flows

### 1. Walk-in registration → host approval → pass

```mermaid
sequenceDiagram
  participant V as Visitor
  participant App as Next.js app
  participant CL as Cloudinary
  participant DB as PostgreSQL
  participant R as Resend
  participant H as Host (employee)

  V->>App: Submit form at /entry/new (photo, host, window)
  App->>CL: Upload visitor photo
  CL-->>App: photoUrl
  App->>DB: Create Visitor + Visit (PENDING, approvalToken)
  App->>R: sendHostApprovalEmail
  R->>H: Email with Approve / Deny links
  App->>V: Redirect to /entry/status/:visitId (waiting)

  alt Host approves via email or employee dashboard
    H->>App: Approve (token or dashboard action)
    App->>DB: status APPROVED, qrCode UUID
    V->>App: Check status (email lookup or same URL)
    App->>V: Show QR pass + pass code
  else Host denies
    H->>App: Deny
    App->>DB: status REJECTED
    Note over V: Same email blocked from new desk registration 24h
  end
```

**Rules**

- Desk registrations (`preApproved: false`) require host approval before a pass exists.
- **Check request status** (`/entry/status`): visitor enters email → latest desk visit → status page.
- After **decline**, the same email cannot register again for **24 hours** (from visit `updatedAt`).

### 2. QR pass and check-in

Each approved visit gets a unique **`qrCode`** (UUID) stored in the database.

**What the QR contains**

- Not the raw UUID alone in all cases—the displayed QR encodes a **check-in URL**:
  - `{APP_URL}/entry/scan?code={qrCode}`
- Generated in `VisitPassDisplay` using a public QR image service for rendering; scanning opens or resolves that URL.

**Check-in paths**

1. **Scan** — `/entry/scan` uses `html5-qrcode` (camera) → reads URL or code → `POST /api/check-in` or Server Action → `checkInVisit` in `lib/visits/db.ts`.
2. **Manual** — Enter pass code on the same page.
3. **Prefilled link** — Opening `/entry/scan?code=...` auto-runs check-in.

```mermaid
flowchart LR
  QR["QR or pass code"]
  ScanPage["entry scan page"]
  API["POST api check-in"]
  DbFn["checkInVisit in lib visits db"]
  StatusPage["entry status by visit id"]

  QR --> ScanPage
  ScanPage --> API
  API --> DbFn
  DbFn -->|CHECKED_IN| StatusPage
  DbFn -->|CHECKED_OUT second scan| StatusPage
```

On success, status becomes **CHECKED_IN** and the status page shows **Entry successful** (not shown when only approved, before scan).

**Check-out**

- Scan or enter the **same pass** again while **CHECKED_IN** → **CHECKED_OUT**, `checkOutAt` set, **`qrCode` cleared** (pass cannot be reused).
- Redirect to `/entry/status/:id?done=checkout` for exit success UI (`lib/visits/db.ts` → `checkInVisit`).

**Validation at check-in**

- Visit must be `APPROVED`.
- Optional visit window (`windowStart` / `windowEnd`); outside window → expired or rejected check-in.

### 3. Employee pre-invite (no host email)

```mermaid
flowchart TD
  E["Employee dashboard"] --> F["Pre-invite form"]
  F --> VisitDb[("Visit APPROVED with qrCode")]
  VisitDb --> Link["Pass link on dashboard"]
  Link --> V["Visitor opens entry scan"]
```

Pre-invites skip pending approval and daily limits apply (`maxVisitorsPerDay` per employee).

---

## Authentication and authorization

```mermaid
flowchart TD
  subgraph Client
    Z["Zustand auth store"]
    H["AuthHydrator on dashboard pages"]
  end

  subgraph Edge
    P["proxy.ts"]
    C["vms_session cookie role:id"]
  end

  subgraph Server
    S["lib auth session.ts"]
    G["lib auth guards.ts"]
  end

  LoginAction["Server Actions login and register"] --> S
  S --> C
  P --> C
  P -->|no session| LoginPage["Redirect to login page"]
  G --> UserDB[("User exists and employee approved")]
  H --> Z
```

| Piece | Location | Purpose |
|--------|-----------|---------|
| Cookie | `vms_session` = `employee:id` or `admin:id` | HTTP-only, 7 days |
| **Proxy** | Root `proxy.ts` | Next.js 16 network boundary (formerly middleware): protect `/admin/*`, `/employee/*` (except `/employee/register`), redirect logged-in users away from `/login` |
| **Session** | `lib/auth/session.ts` | Set/delete cookie on login, logout, register |
| **Guards** | `lib/auth/guards.ts` | Server pages: load user from DB; unapproved employees → `/employee/pending` |
| **Zustand** | `stores/*`, `hooks/use-auth.ts` | Login role toggle, sign-out clear, dashboard UI state |
| **Validation** | Zod in `app/actions/*.ts` | Email/password, visitor fields, invite fields |

**Login:** single `/login` with Employee / Admin toggle. Legacy `/employee/login` and `/admin/login` redirect to `/login`.

---

## Admin dashboard

- **Visits tab:** stats, status filters, **List** vs **Timeline** toggle (timeline replaces the table; date picker for on-site bars).
- **Hosts tab:** employee directory; approve/decline new employee registrations.
- Notifications for pending employee access requests.

---

## Email (Resend)

Host approval email (`lib/email/host-approval.ts`):

- Visitor details + optional photo (Cloudinary URL in email).
- Buttons: **Approve visit** → `/host/approve/{approvalToken}`, **Deny visit** → `/host/deny/{token}`.
- Host confirms on a web page; Server Actions update the visit.

**Env**

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | API key from Resend |
| `EMAIL_FROM` | Sender — use `onboarding@resend.dev` only for testing |
| `RESEND_TEST_TO` | **Local dev only** — redirects host emails to your inbox when using `onboarding@resend.dev` |
| `EMAIL_APP_URL` | **Local dev only** — optional public URL for approve/deny links when `APP_URL` is `localhost` |

**Common issues**

1. **“Only send testing emails to your own email”** — With `EMAIL_FROM=onboarding@resend.dev`, use `RESEND_TEST_TO` in **local** `.env` only.
2. **Resend Insights: links don’t match sending domain** — Locally, set `EMAIL_APP_URL` to your Vercel URL. On Vercel, set `APP_URL` to your live domain.
3. **Production (Vercel)** — Do **not** set `RESEND_TEST_TO`. Verify a domain in Resend, set `EMAIL_FROM` on that domain, and set `APP_URL` to your live URL so mail goes to real host addresses.

If sending fails after a desk registration, the form shows the Resend error (the visit is still saved in the database).

Test send: `npx tsx scripts/test-resend.ts`

---

## Project structure (main areas)

```
app/
  page.tsx                 # Entry home
  login/                   # Unified login
  entry/                   # new, scan, status
  employee/                # Dashboard, register, pending
  admin/                   # Admin dashboard
  host/                    # Email approve/deny + result
  actions/                 # Server Actions (auth, visits, employee, admin)
  api/auth/session/        # JSON session for client
  api/check-in/            # Pass check-in API
components/                # UI, dashboards, visit forms, QR scanner
hooks/                     # use-auth, use-*-dashboard
stores/                    # Zustand stores
lib/
  auth/                    # constants, session, guards, password
  visits/                  # index.ts (helpers), db.ts (Prisma)
  email/                   # Resend templates
  visitors/photos.ts         # Cloudinary upload
proxy.ts                   # Auth proxy (Next.js 16)
prisma/                      # Schema, migrations, seed
```

---

## Getting started

### Prerequisites

- Node.js 20+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended for local Postgres)

### Setup

1. Clone and install:

   ```bash
   npm install
   ```

2. Start local Postgres:

   ```bash
   npm run db:up
   ```

   Uses `docker-compose.yml` — user `postgres`, password `postgres`, database `postgres`, port `5432`.

3. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Keep the default `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres` for Docker.

   | Variable | Purpose |
   |----------|---------|
   | `DATABASE_URL` | Docker Postgres locally; Neon (or other) on Vercel |
   | `CLOUDINARY_URL` | Visitor / employee image uploads |
   | `APP_URL` | Public site URL for email + QR links |
   | `RESEND_API_KEY` | Outbound email |
   | `EMAIL_FROM` | Verified sender in Resend |
   | `RESEND_TEST_TO` | Local `.env` only (omit on Vercel) |

4. Database:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Run:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

   Stop Postgres: `npm run db:down`

   For **Neon** (deploy only), replace `DATABASE_URL` in Vercel — not needed for local Docker.

### Deploy on Vercel (with Neon)

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Add a **Neon** integration (or paste env vars manually from the Neon dashboard).
3. Set these **Environment Variables** for Production (and Preview if you want):

   | Name | Value |
   |------|--------|
   | `DATABASE_URL` | Your Neon PostgreSQL connection string |
   | `APP_URL` | `https://visitor-management-system-assignmen.vercel.app` (your live URL — **not** `localhost`) |
   | `CLOUDINARY_URL` | Your Cloudinary URL |
   | `RESEND_API_KEY` | Resend API key |
   | `EMAIL_FROM` | Verified sender on your domain (not `onboarding@resend.dev` for real hosts) |
   | `SESSION_SECRET` | Long random string for production cookies |

   Do **not** add `RESEND_TEST_TO` or `EMAIL_APP_URL` on Vercel — those apply only when running locally.

   After adding or changing env vars, **Redeploy**.

4. Deploy. The build runs `prisma generate` (postinstall) and `prisma migrate deploy` before `next build`.
5. Seed admin/employee **once** against Neon from your machine (seed file is gitignored):

   ```bash
   npm run db:seed
   ```

6. In Resend, use a sending domain that matches production; set `APP_URL` to the live URL so approval emails and QR codes point to Vercel, not localhost.

**Notes**

- Session cookies use `secure` + `sameSite: lax` in production (required for HTTPS on Vercel).
- If Vercel build fails on `migrate deploy` with a pooler URL, use Neon’s direct connection string as `DATABASE_URL` instead.
- `VERCEL_URL` is used as a fallback for links when `APP_URL` is not set, but you should set `APP_URL` explicitly for emails and QR codes.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run db:seed` | Seed demo admin/employee (see `prisma/seed.ts`) |

---

## Visit status lifecycle

```mermaid
stateDiagram-v2
  [*] --> PENDING: Walk-in registered
  PENDING --> APPROVED: Host approves
  PENDING --> REJECTED: Host denies
  APPROVED --> CHECKED_IN: Pass check-in
  APPROVED --> EXPIRED: Window passed
  CHECKED_IN --> CHECKED_OUT: Checkout
  REJECTED --> [*]
```

Pre-invited visits are created directly in **APPROVED** with a `qrCode`.

---

## Key routes (quick reference)

| Route | Who | Purpose |
|-------|-----|---------|
| `/` | Public | Entry options |
| `/entry/new` | Public | Walk-in registration |
| `/entry/scan` | Public | QR scan / pass code check-in |
| `/entry/status` | Public | Lookup visit by email |
| `/entry/status/:id` | Public | Visit detail, pass, success after check-in |
| `/login` | Public | Employee / admin sign-in |
| `/employee/register` | Public | New employee (pending admin) |
| `/employee/pending` | Employee | Awaiting admin approval |
| `/employee` | Employee | Visits, pre-invite, approve visitors |
| `/admin` | Admin | All visits, hosts, timeline |
| `/host/approve/:token` | Host | Confirm approval from email |
| `/host/deny/:token` | Host | Confirm denial from email |

---

## License

Private assignment project.
