# 🌍 GlobeTrotter — Smart Travel Planning & Itinerary Web App
**Odoo x LDCE Hackathon '26**

GlobeTrotter is a modern, responsive, component-driven travel planning web application built with React 18, React Router v6, Tailwind CSS, Lucide icons, and Recharts.

---

## 🚀 Features & Screen Directory

1. **Login Screen** (`/login`) — Clean authentication card with avatar placeholder, show/hide password, and client-side validation.
2. **Registration Screen** (`/register`) — 2-column registration flow with profile photo upload and traveler bio.
3. **Main Dashboard** (`/`) — Dynamic hero banner, search & filters, top regional selections, recent trips, and quick action "+ Plan a Trip" FAB.
4. **Create New Trip** (`/trips/new`) — Destination search with autocomplete, date pickers, and selectable activity recommendation cards.
5. **Build Itinerary** (`/trips/:id/build`) — Dynamic section builder (hotels, flights, activities) with budgets, date ranges, and reorder/delete capability.
6. **User Trip Listing** (`/trips`) — Organized into *Ongoing*, *Upcoming*, and *Completed* trip sections with search and sorting.
7. **User Profile** (`/profile`) — Editable profile details, traveler statistics, and lists of preplanned & past trips.
8. **Activity Search** (`/search`) — Explore activities by category and difficulty (Easy / Moderate / Challenging) with instant wishlist add toasts.
9. **Itinerary View with Budget** (`/trips/:id/itinerary`) — Day-by-day collapsible sequence with activity step flow and sticky budget tracker (spent vs remaining progress).
10. **Community Feed** (`/community`) — Traveler stories feed with likes, comments, photo sharing, and community sidebar.
11. **Calendar View** (`/calendar`) — Monthly view with highlighted multi-day trip ranges and direct links to itineraries.
12. **Admin Panel** (`/admin`) — Analytics overview with Recharts (User Growth line chart, Trip Category pie chart, Popular Activities bar chart) + User Management table.

---

## 🛠 Tech Stack

- **Framework:** React 18 (Functional Components, Custom Hooks, Context API)
- **Routing:** React Router v6 (Protected routes & SPA navigation)
- **Styling:** Tailwind CSS (Theme tokens, glassmorphism, responsive grid)
- **Icons:** `lucide-react`
- **Charts:** `recharts`
- **Build Tool:** Vite

---

## 💻 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/Simranchoubey/Odoo-x-LDCE-Hackathon-26.git
cd Odoo-x-LDCE-Hackathon-26

# Switch to the frontend branch
git checkout frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:5173** in your browser.

