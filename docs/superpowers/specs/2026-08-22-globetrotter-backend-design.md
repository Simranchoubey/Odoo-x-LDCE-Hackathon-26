# GlobeTrotter Backend Design

**Date:** 2026-08-22 · **Project:** Odoo x LDCE Hackathon '26
**Goal:** Replace mock data in the existing React SPA with a real Express + Prisma + PostgreSQL backend (Approach 1).

## Architecture

```
Odoo-x-LDCE-Hackathon-26/
├── src/                     # existing React SPA
│   ├── api/client.js        # fetch wrapper: baseURL /api, attaches JWT, parses JSON errors
│   └── context/             # AuthContext & TripContext rewritten to call the API
├── server/
│   ├── prisma/schema.prisma # 6-table relational schema
│   ├── prisma/seed.js       # cities, activities, demo user + trips
│   └── src/
│       ├── index.js         # Express app + central error handler
│       ├── middleware/      # requireAuth (JWT), validate helpers
│       └── routes/          # auth, users, cities, activities, trips, public
└── vite.config.js           # dev proxy: /api -> http://localhost:4000
```

Two dev commands: `npm run dev` (frontend, port 5173) and `npm run dev --prefix server` (API, port 4000). Vite proxies `/api`, so no CORS handling is needed in development.

## Data Model (PostgreSQL via Prisma)

| Table | Fields (key ones) | Relations |
|---|---|---|
| User | id, email (unique), passwordHash, name, avatarUrl, bio, languagePref, createdAt | has many Trips |
| City | id, name, country, region, costIndex, popularity, imageUrl | catalog; has many Activities, Stops |
| Activity | id, cityId→City, name, category, description, cost, durationMins, difficulty, imageUrl | catalog |
| Trip | id, userId→User, name, description, startDate, endDate, coverImage, totalBudget, currency, status (`planning\|upcoming\|ongoing\|completed`), shareSlug (unique, nullable), isPublic | has many Stops |
| Stop | id, tripId→Trip, cityId→City, arrivalDate, departureDate, sortOrder | ordered; has many ItineraryItems |
| ItineraryItem | id, stopId→Stop, activityId→Activity (nullable), title, date, time, cost, category (`transport\|stay\|activity\|meal`) | budget breakdown source |

Relational properties: FK constraints on every relation, cascade delete (Trip→Stops→ItineraryItems), unique constraints on `User.email` and `Trip.shareSlug`.

## API Endpoints (all under `/api`)

### Auth
- `POST /auth/register` — {email, password, name} → {token, user}; 409 if email taken
- `POST /auth/login` — {email, password} → {token, user}
- `GET /auth/me` — current user (Bearer token)

### Users
- `GET /users/me`, `PATCH /users/me`, `DELETE /users/me`

### Catalog search
- `GET /cities?search=&country=` — name/country match with meta (costIndex, popularity)
- `GET /activities?cityId=&category=&maxCost=` — filterable activity list

### Trips (owner-only unless noted)
- `GET /trips` — own trips with computed spent totals
- `POST /trips` — create (name, dates, description, coverImage, totalBudget)
- `GET/PATCH/DELETE /trips/:id` — full trip incl. stops + items (nested include)
- Stops: `POST /trips/:id/stops`, `PATCH/DELETE /stops/:id`, `PATCH /trips/:id/stops/order` (array of stop ids → sortOrder)
- Itinerary items: `POST /stops/:id/items`, `PATCH/DELETE /items/:id`
- Budget: `GET /trips/:id/budget` — total by category (transport/stay/activity/meal), per-day average, over-budget day flags

### Sharing
- `POST /trips/:id/share` — toggle isPublic, generate slug → {shareUrl}
- `GET /public/trips/:slug` — read-only itinerary, no auth
- `POST /public/trips/:slug/copy` — deep clone into caller's account

## Auth Flow
bcrypt password hashing → JWT (7-day expiry, `JWT_SECRET` in `.env`). Client stores token in localStorage; `src/api/client.js` adds `Authorization: Bearer <token>` and redirects to `/login` on 401. Existing protected-route wiring in AuthContext is preserved; only its internals change.

## Frontend Integration
- `AuthContext`: real register/login/logout/me calls replacing mock users.
- `TripContext`: same exported state shape where possible; arrays replaced by API fetches on mount, optimistic updates for add/remove/reorder.
- `src/data/*.js` stays as fallback for Community feed and Admin analytics pages (out of scope this iteration).

## Error Handling & Validation
- Central error middleware → `{ error: message }` + correct HTTP status (400 validation, 401 auth, 403 forbidden, 404 missing, 409 conflict, 500 fallback).
- Manual validators for required fields, date sanity (end ≥ start).
- Prisma unique-violation mapped to 409.

## Seeding & Testing
- Seed: ~12 cities, ~40 activities, demo account `demo@globetrotter.app` / `demo1234` with the 6 existing mock trips ported to the schema.
- Tests: smoke script exercising every endpoint against a seeded DB (register→login→CRUD trip→budget→share→copy), plus manual UI walkthrough of login, dashboard, builder, itinerary, budget, share views.

## Out of Scope
Community posts/likes/comments persistence, admin analytics endpoints, file-upload storage (coverImage/avatar stay as URLs), forgot-password email flow.
