# 🌍 GlobeTrotter — Smart Travel Planning & Itinerary Web App

**Odoo x LDCE Hackathon '26**

GlobeTrotter is a full-stack travel planning application: a React SPA backed by a real relational PostgreSQL database via an Express + Prisma REST API. Users register, build multi-city itineraries with stops and activities, track budgets with category breakdowns, and share trips publicly with one link.

---

## 🛠 Tech Stack

**Frontend**

- React 19 (Functional Components, Context API)
- React Router v7 (protected routes & SPA navigation)
- Tailwind CSS v4 (theme tokens, glassmorphism, responsive grid)
- `lucide-react` icons · `recharts` charts · Vite

**Backend** (`server/`)

- Node.js + Express (REST API under `/api`)
- Prisma ORM + PostgreSQL (6-table relational schema)
- JWT bearer auth (`jsonwebtoken`) + `bcryptjs` password hashing

---

## 🗄 Database Schema

```
User ──< Trip ──< Stop >── City        (catalog)
                  │
                  └──< ItineraryItem >── Activity   (catalog)
```

| Table | Purpose |
| --- | --- |
| `User` | accounts (email, bcrypt hash, profile prefs) |
| `City` | catalog: name, country, region, cost index, popularity |
| `Activity` | catalog per city: category, cost, duration, difficulty |
| `Trip` | name, dates, budget, status, public share slug |
| `Stop` | ordered city stop within a trip (arrival/departure) |
| `ItineraryItem` | scheduled activity with date, time, cost, budget category |

Cascade deletes: deleting a trip removes its stops and items; unique constraints on `User.email` and `Trip.shareSlug`.

---

## 🚀 Features & Screen Directory

1. **Login** (`/login`) — JWT auth against the API, client-side validation.
2. **Registration** (`/register`) — creates a real account in PostgreSQL.
3. **Main Dashboard** (`/`) — hero banner, top regional selections, recent trips from the database.
4. **Create New Trip** (`/trips/new`) — live city search against `/api/cities`, activity picker from `/api/activities`; creates trip + first stop + chosen items.
5. **Build Itinerary** (`/trips/:id/build`) — sections persist as stops in the DB.
6. **My Trips** (`/trips`) — Ongoing / Upcoming / Completed, all server-backed.
7. **Profile** (`/profile`) — edits persist via `PATCH /api/users/me`.
8. **Activity Search** (`/search`) — catalog browsing with wishlist toasts.
9. **Itinerary View + Budget** (`/trips/:id/itinerary`) — day-by-day plan, spent vs remaining from `/api/trips/:id/budget`.
10. **Shared Itinerary** (`/shared/:slug`) — public read-only view of any shared trip.
11. **Calendar View** (`/calendar`) — multi-day trip ranges.
12. **Admin Panel** (`/admin`) — analytics charts (mock data).

### API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | create account → `{token, user}` |
| POST | `/api/auth/login` | login → `{token, user}` |
| GET | `/api/auth/me` | current user |
| GET/PATCH/DELETE | `/api/users/me` | profile management |
| GET | `/api/cities?search=&country=` | city search |
| GET | `/api/activities?cityId=&category=&maxCost=` | activity filter |
| CRUD | `/api/trips`, `/api/trips/:id` | owner-only trip management |
| POST/PATCH/DELETE | `/api/trips/:id/stops…`, `/api/trips/stops/:id`, `.../items/:id` | stops & itinerary items |
| PATCH | `/api/trips/:id/stops/order` | reorder stops |
| GET | `/api/trips/:id/budget` | totals by category, per-day avg, over-budget days |
| POST | `/api/trips/:id/share` | toggle public share link |
| GET | `/api/public/trips/:slug` | read-only shared itinerary (no auth) |
| POST | `/api/public/trips/:slug/copy` | clone someone's trip into your account |

---

## 💻 Getting Started Locally

### Option A — PostgreSQL via Docker (recommended)

**Prerequisites:** Node 20+, [Docker Desktop](https://www.docker.com/products/docker-desktop/) (no local Postgres install needed).

```bash
git clone https://github.com/Simranchoubey/Odoo-x-LDCE-Hackathon-26.git
cd Odoo-x-LDCE-Hackathon-26

# ---------- 1. Start PostgreSQL in Docker ----------
docker compose up -d --wait        # pulls postgres:16-alpine, waits until healthy
#   (or: cd server && npm run docker:up)
#   stop later with:  docker compose down        (data persists in a named volume)
#   wipe data:        docker compose down -v

# ---------- 2. Backend ----------
cd server
npm install
cp .env.example .env               # defaults match docker-compose.yml; edit if you changed credentials
npx prisma migrate dev             # creates tables
npm run db:seed                    # seeds cities, activities, 8 users + 22 sample trips (8 public)
npm run dev                        # API on http://localhost:4000

# ---------- 3. Frontend (new terminal) ----------
cd ..
npm install
npm run dev                        # http://localhost:5173 (proxies /api -> :4000)
```

Login with the demo account below — all seeded data is loaded by step 2's `db:seed`.

### Option B — Existing local PostgreSQL install

```bash
createdb globetrotter              # or: psql -U postgres -c "CREATE DATABASE globetrotter;"

cd server
npm install
# create .env:
#   DATABASE_URL="postgresql://postgres:<YOUR_PASSWORD>@localhost:5432/globetrotter"
#   JWT_SECRET="<any-long-random-string>"
#   PORT=4000
npx prisma migrate dev             # creates tables
npm run db:seed
npm run dev                        # API on http://localhost:4000

cd ..
npm install
npm run dev                        # http://localhost:5173
```

**Demo account:** `demo@globetrotter.app` / `demo1234` — comes with 6 seeded trips. All seeded users share the same password (`demo1234`).

---

## 🌱 Seeded Data

Running `npm run db:seed` fills the database with everything needed to explore the app immediately:

**8 users** (all password `demo1234`)

| Email | Name | Persona |
|---|---|---|
| `demo@globetrotter.app` | Demo Traveler | General demo account, 6 trips |
| `aria.winters@example.com` | Aria Winters | Solo backpacker |
| `marco.bellini@example.com` | Marco Bellini | Food-first traveler |
| `priya.sharma@example.com` | Priya Sharma | Adventure junkie (INR/CHF/NZD budgets) |
| `tom.okafor@example.com` | Tom Okafor | Photographer, desert & aurora trips |
| `elena.petrova@example.com` | Elena Petrova | History teacher, heritage itineraries |
| `jack.thompson@example.com` | Jack Thompson | Diver, reef & balloon trips |
| `sofia.mendes@example.com` | Sofia Mendes | Remote designer / digital nomad |

Multiple currencies (USD, EUR, CHF, NZD, AUD, INR, TRY) are exercised across user budgets.

**20 cities** (catalog for city search & stops)

| Region | Cities |
|---|---|
| Europe | Paris, Santorini, Barcelona, Interlaken, Seville, Tromsø, Rome, Bordeaux |
| Asia | Tokyo, Bali, Kyoto, Cappadocia, Agra |
| Africa | Marrakech, Cape Town, Merzouga |
| Americas | New York, Manaus |
| Oceania | Queenstown, Cairns |

Each city carries `country`, `region`, a description, a **cost index** (avg $/day) and a **popularity rating** used by the City Search screen.

**24 activities** (catalog per city, e.g.)

- Adventure: Hot Air Balloon Ride (Cappadocia), Paragliding over Alps (Interlaken), Bungee Jump – Kawarau Bridge (Queenstown), Sahara Desert Camel Trek (Merzouga)
- Culture/Heritage: Eiffel Tower Skip-the-line & Louvre Museum (Paris), Colosseum Underground Tour (Rome), Fushimi Inari Shrine (Kyoto), Taj Mahal Sunrise Visit (Agra)
- Food: Sushi Making Class (Tokyo), Vineyard Wine Tasting (Bordeaux), Jemaa el-Fnaa Food Tour (Marrakech)
- Nature/Water/Nights: Amazon Jungle Trek (Manaus), Northern Lights Viewing (Tromsø), Scuba Diving – Great Barrier Reef (Cairns)

Each activity has a category, cost ($), duration (minutes), difficulty (Easy / Moderate / Challenging), and description.

**6 demo trips** (owned by the demo user, with stops + itinerary items)

| Trip | Destination | Dates | Status | Budget |
|---|---|---|---|---|
| NYC Winter Break | New York, USA | Aug 1–7, 2026 | ongoing | $3,500 |
| Santorini Honeymoon | Santorini, Greece | Jun 10–17, 2026 | completed | $5,000 |
| Paris Getaway | Paris, France | Sep 15–20, 2026 | completed | $2,400 |
| Kyoto Retreat | Kyoto, Japan | Oct 11–14, 2026 | upcoming | $1,800 |
| Bali Beach Escape | Bali, Indonesia | Nov 20–28, 2026 | upcoming | $2,000 |
| Morocco Souk Adventure | Marrakech, Morocco | Dec 5–10, 2026 | planning | $1,500 |

**6 demo trips** (owned by the demo user, with stops + itinerary items) + **16 community trips** across the 7 other users.

**Public / shareable trips** (visible via `/trip/:slug`, with a "Copy Trip" flow):

| Trip | Owner | Share URL |
|---|---|---|
| Paris Getaway | demo | `/trip/paris-getaway-2026` |
| Santorini Honeymoon | demo | auto-generated slug |
| Southeast Asia Loop | Aria | `/trip/sea-backpacker-loop` |
| Iberian Tapas Trail | Marco | `/trip/iberian-tapas-trail` |
| Swiss Alps Adventure | Priya | `/trip/swiss-alps-adventure` |
| Sahara Expedition | Tom | `/trip/sahara-expedition` |
| Classical Italy Grand Tour | Elena | `/trip/classical-italy-tour` |
| Barrier Reef Liveaboard | Jack | `/trip/barrier-reef-liveaboard` |
| Morocco Remote Retreat | Sofia | `/trip/morocco-remote-retreat` |

Trips include real itinerary items (e.g. Fushimi Inari Shrine, Central Park Bike Tour, Monkey Forest Sanctuary) so the Itinerary View, Budget Breakdown, and Calendar screens show live data on first login. The seed script is idempotent — re-running it won't duplicate cities or trips.

---

## 📁 Project Structure

```
├── src/                     # React SPA
│   ├── api/client.js        # fetch wrapper (JWT attach, error handling)
│   ├── context/             # AuthContext, TripContext (API-backed)
│   ├── pages/               # 13 screens
│   ├── components/
│   └── data/                # mock fallbacks for Community/Admin only
├── server/
│   ├── prisma/              # schema.prisma, migrations, seed.js
│   └── src/
│       ├── index.js         # Express app
│       ├── middleware/      # requireAuth (JWT), central error handler
│       ├── lib/prisma.js
│       └── routes/          # auth, users, cities, activities, trips, public
└── docs/superpowers/        # design spec + implementation plan
```
