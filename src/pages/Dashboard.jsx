import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, TrendingUp, MapPin, ChevronRight } from 'lucide-react';
import TopBar from '../components/TopBar';
import SearchFilterBar from '../components/SearchFilterBar';
import TripCard from '../components/TripCard';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../api/client';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=1600&q=80',
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'budget', label: 'Budget' },
];

function SkeletonCard() {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl overflow-hidden border border-[var(--color-outline-variant)]/30">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 skeleton rounded-full w-2/3" />
        <div className="h-4 skeleton rounded-full w-full" />
        <div className="h-3 skeleton rounded-full w-1/2" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { trips, tripsByStatus } = useTrips();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [heroIdx, setHeroIdx] = useState(0);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    api('/cities').then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const topCities = cities.slice(0, 5);  const prevTrips = tripsByStatus.completed.slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopBar />
      <main className="pt-16">
        {/* Hero Banner */}
        <section className="relative w-full h-72 md:h-96 overflow-hidden">
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Travel inspiration"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === heroIdx ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-16 max-w-7xl mx-auto">
            <p className="text-[var(--color-primary-fixed)] text-sm font-semibold uppercase tracking-widest mb-2">
              ✈ Your Next Adventure Awaits
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Hello, {user?.firstName || 'Traveler'}! 👋
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-lg">
              You have <strong className="text-white">{tripsByStatus.upcoming.length} upcoming trips</strong>. Where will you go next?
            </p>
          </div>
          {/* Dots */}
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? 'bg-white w-5' : 'bg-white/40'}`}
                aria-label={`Hero image ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Search Filter Bar */}
        <section className="max-w-7xl mx-auto px-5 lg:px-16 py-6">
          <SearchFilterBar
            searchValue={search}
            onSearchChange={setSearch}
            sortOptions={SORT_OPTIONS}
            placeholder="Search destinations, trips..."
          />
        </section>

        <div className="max-w-7xl mx-auto px-5 lg:px-16 pb-24 flex flex-col gap-12">
          {/* Top Regional Selections */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  🌍 Top Regional Selections
                </h2>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Hand-picked destinations trending this season</p>
              </div>
              <Link to="/search" className="text-sm font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                View all <ChevronRight size={16} />
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="shrink-0 w-52">
                      <SkeletonCard />
                    </div>
                  ))
                : topCities
                    .filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()))
                    .map((city) => (
                      <div key={city.id} className="shrink-0 w-52">
                        <CityCard city={city} />
                      </div>
                    ))}
            </div>

            {!loading && topCities.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
              <EmptyState icon={<Search size={40} />} title="No destinations found" subtitle={`No results for "${search}"`} />
            )}
          </section>

          {/* Previous Trips */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  🗺 Previous Trips
                </h2>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Your travel memories</p>
              </div>
              <Link to="/trips" className="text-sm font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                View all <ChevronRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : prevTrips.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
                {prevTrips.map((trip) => (
                  <div key={trip.id} className="shrink-0 w-64">
                    <TripCard
                      trip={trip}
                      variant="compact"
                      onView={() => navigate(`/trips/${trip.id}/itinerary`)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<MapPin size={40} />}
                title="No trips yet"
                subtitle="Complete a trip to see it here"
                action={<Link to="/trips/new" className="text-sm font-semibold text-[var(--color-primary)] hover:underline">Plan your first trip →</Link>}
              />
            )}
          </section>

          {/* Upcoming Trips */}
          {!loading && tripsByStatus.upcoming.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    📅 Upcoming Trips
                  </h2>
                  <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">Adventures on the horizon</p>
                </div>
                <Link to="/trips" className="text-sm font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1">
                  View all <ChevronRight size={16} />
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
                {tripsByStatus.upcoming.map((trip) => (
                  <div key={trip.id} className="shrink-0 w-64">
                    <TripCard
                      trip={trip}
                      variant="compact"
                      onView={() => navigate(`/trips/${trip.id}/itinerary`)}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Floating Plan Trip Button */}
      <Link
        to="/trips/new"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 bg-[var(--color-primary)] text-white rounded-2xl font-semibold text-sm primary-shadow hover:bg-[var(--color-on-primary-fixed-variant)] hover:shadow-2xl transition-all duration-300 active:scale-95"
        aria-label="Plan a new trip"
      >
        <Plus size={20} />
        <span className="hidden sm:block">Plan a Trip</span>
      </Link>
    </div>
  );
}

function CityCard({ city }) {
  const navigate = useNavigate();
  const { fmt } = useCurrency();
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';
  return (
    <article
      onClick={() => navigate('/search')}
      className="group cursor-pointer bg-[var(--color-surface-container-lowest)] rounded-2xl overflow-hidden border border-[var(--color-outline-variant)]/30 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-36 overflow-hidden relative">
        <img
          src={city.imageUrl || FALLBACK_IMAGE}
          alt={city.name}
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>{city.name}</h3>
          <p className="text-xs text-white/80">{city.country}</p>
        </div>
        {city.region && (
          <div className="absolute top-2 right-2 flex gap-1">
            <span className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full font-medium">
              {city.region}
            </span>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--color-on-surface-variant)]">~{fmt(city.costIndex)}/day</span>
          <span className="text-xs font-semibold text-amber-500">★ {Number(city.popularity).toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 bg-[var(--color-surface-container-lowest)] rounded-2xl border border-dashed border-[var(--color-outline-variant)]/50 text-center">
      <div className="text-[var(--color-on-surface-variant)]/30 mb-3">{icon}</div>
      <h3 className="text-base font-bold text-[var(--color-on-surface-variant)] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title}</h3>
      <p className="text-sm text-[var(--color-on-surface-variant)]/70 mb-3">{subtitle}</p>
      {action}
    </div>
  );
}
