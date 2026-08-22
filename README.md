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

**Prerequisites:** Node 20+, PostgreSQL running locally.

```bash
git clone https://github.com/Simranchoubey/Odoo-x-LDCE-Hackathon-26.git
cd Odoo-x-LDCE-Hackathon-26

# ---------- Database ----------
createdb globetrotter          # or: psql -U postgres -c "CREATE DATABASE globetrotter;"

# ---------- Backend ----------
cd server
npm install
# create .env:
#   DATABASE_URL="postgresql://postgres:<YOUR_PASSWORD>@localhost:5432/globetrotter"
#   JWT_SECRET="<any-long-random-string>"
#   PORT=4000
npx prisma migrate dev         # creates tables
npm run db:seed                # seeds cities, activities, demo user + 6 sample trips
npm run dev                    # API on http://localhost:4000

# ---------- Frontend (new terminal) ----------
cd ..
npm install
npm run dev                    # http://localhost:5173 (proxies /api -> :4000)
```

**Demo account:** `demo@globetrotter.app` / `demo1234` — comes with 6 seeded trips.

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
