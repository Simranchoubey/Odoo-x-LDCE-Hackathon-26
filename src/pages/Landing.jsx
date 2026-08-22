import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe2,
  MapPin,
  Wallet,
  Search,
  Share2,
  ArrowRight,
  Star,
  CalendarRange,
  Route,
} from 'lucide-react';
import { api } from '../api/client';
import { useCurrency } from '../context/CurrencyContext';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80';

const FEATURES = [
  {
    icon: Route,
    title: 'Multi-City Itinerary Builder',
    text: 'Chain together stops across the globe, assign dates to each leg, and reorder your journey as plans evolve.',
  },
  {
    icon: Wallet,
    title: 'Smart Budget Tracking',
    text: 'Every activity carries a cost. Get instant breakdowns by transport, stay, meals and experiences — plus over-budget day alerts.',
  },
  {
    icon: Search,
    title: 'City & Activity Discovery',
    text: 'Search 20+ destinations with cost indexes and popularity scores, then browse curated activities by category and difficulty.',
  },
  {
    icon: Share2,
    title: 'Share & Copy Trips',
    text: 'Publish any itinerary with one link. Friends can view the full plan — or copy it straight into their own account.',
  },
];

const STEPS = [
  { icon: MapPin, title: 'Pick your stops', text: 'Search cities, check living costs, and build your route.' },
  { icon: CalendarRange, title: 'Fill your days', text: 'Add activities with times and costs into a visual timeline.' },
  { icon: Globe2, title: 'Share the plan', text: 'Track budget, publish your itinerary, and inspire other travelers.' },
];

export default function Landing() {
  const [cities, setCities] = useState([]);
  const { fmt, currency, setCurrency } = useCurrency();

  useEffect(() => {
    api('/cities').then((c) => setCities(c.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Nav */}
      <header className="fixed top-0 w-full z-50 glass border-b border-[var(--color-outline-variant)]/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-16 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center shadow-sm">
              <Globe2 size={18} className="text-white" />
            </div>
            <span className="text-lg font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              GlobeTrotter
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Display currency"
              className="text-xs font-semibold px-2 py-2 rounded-xl bg-white/10 border border-white/30 text-white focus:outline-none cursor-pointer [&>option]:text-black"
            >
              {['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AED'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-on-primary-fixed-variant)] transition-colors primary-shadow"
            >
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img src={HERO_IMAGE} alt="Traveler overlooking mountains" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-[var(--color-background)]" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-16 pt-32 pb-24 w-full">
          <p className="text-white/90 text-sm font-semibold uppercase tracking-[0.3em] mb-4">
            ✦ Odoo x LDCE Hackathon '26
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] max-w-3xl mb-6"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Plan journeys as exciting as <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-rose-300">the trip itself</span>
          </h1>
          <p className="text-white/85 text-lg md:text-xl max-w-xl mb-10">
            GlobeTrotter turns multi-city trip chaos into a beautiful, budget-aware itinerary — discover places, schedule days, and share your plan with the world.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-base hover:bg-[var(--color-on-primary-fixed-variant)] hover:shadow-2xl transition-all duration-300 active:scale-95 primary-shadow"
            >
              Start Planning <ArrowRight size={20} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-base hover:bg-white/20 transition-all duration-300"
            >
             Register
            </Link>
          </div>
          <div className="flex gap-8 mt-14 text-white">
            {[
              ['20+', 'Cities'],
              ['24+', 'Activities'],
              ['6', 'Currencies supported'],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>{value}</p>
                <p className="text-white/70 text-xs uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="max-w-7xl mx-auto px-5 lg:px-16 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[var(--color-primary)] text-sm font-semibold uppercase tracking-widest mb-2">Explore</p>
            <h2 className="text-3xl md:text-4xl font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Popular destinations
            </h2>
          </div>
          <Link to="/register" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:gap-2 transition-all">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cities.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl skeleton" />
              ))
            : cities.map((city) => (
                <article
                  key={city.id}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={city.imageUrl}
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {city.name}
                    </h3>
                    <p className="text-white/70 text-xs">{city.country}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-white/90">
                      <span>~{fmt(city.costIndex)}/day</span>
                      <span className="flex items-center gap-1">
                        <Star size={11} className="text-amber-300" fill="currentColor" /> {city.popularity.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[var(--color-surface-container-lowest)] border-y border-[var(--color-outline-variant)]/30">
        <div className="max-w-7xl mx-auto px-5 lg:px-16 py-24">
          <p className="text-[var(--color-primary)] text-sm font-semibold uppercase tracking-widest mb-2">Everything in one place</p>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--color-on-surface)] mb-12 max-w-xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            From dream to departure board
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-[var(--color-background)] rounded-2xl p-6 border border-[var(--color-outline-variant)]/30 hover:border-[var(--color-primary)]/40 card-shadow hover:card-shadow-hover transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="font-bold text-[var(--color-on-surface)] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {title}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-5 lg:px-16 py-24">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div>
            <p className="text-[var(--color-primary)] text-sm font-semibold uppercase tracking-widest mb-2">How it works</p>
            <h2 className="text-3xl md:text-4xl font-black text-[var(--color-on-surface)] mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Three steps to your perfect itinerary
            </h2>
            <p className="text-[var(--color-on-surface-variant)] mb-8">
              No spreadsheets, no lost bookmarks. Build, budget and broadcast your next adventure in minutes.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-on-primary-fixed-variant)] transition-colors primary-shadow"
            >
              Create your free account <ArrowRight size={18} />
            </Link>
          </div>
          <ol className="flex flex-col gap-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex gap-4 items-start bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 border border-[var(--color-outline-variant)]/30">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-[var(--color-on-surface)] flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <Icon size={16} className="text-[var(--color-primary)]" /> {title}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] mt-1">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-outline-variant)]/30 py-10">
        <div className="max-w-7xl mx-auto px-5 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-container)] flex items-center justify-center">
              <Globe2 size={15} className="text-white" />
            </div>
            <span className="font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>GlobeTrotter</span>
          </div>
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            Built for Odoo x LDCE Hackathon '26 · Photos via Unsplash
          </p>
        </div>
      </footer>
    </div>
  );
}
