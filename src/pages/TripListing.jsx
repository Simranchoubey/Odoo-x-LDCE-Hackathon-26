import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MapPin, Frown, Search } from 'lucide-react';
import TopBar from '../components/TopBar';
import SearchFilterBar from '../components/SearchFilterBar';
import TripCard from '../components/TripCard';
import { useTrips } from '../context/TripContext';
import { PrimaryButton } from '../components/Button';

const FILTER_OPTIONS = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name A–Z' },
];

function TripGroup({ title, trips, emoji, emptyMsg, navigate }) {
  if (trips.length === 0) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-[var(--color-surface-container-lowest)] rounded-2xl border border-dashed border-[var(--color-outline-variant)]/40 text-[var(--color-on-surface-variant)]/60 text-sm">
        <Frown size={16} />
        <span>{emptyMsg}</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onView={() => navigate(`/trips/${trip.id}/itinerary`)}
        />
      ))}
    </div>
  );
}

export default function TripListing() {
  const { trips, tripsByStatus } = useTrips();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortValue, setSortValue] = useState('newest');

  const filterTrips = (list) => {
    let result = list;
    if (search) {
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.destination?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sortValue === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sortValue === 'oldest') result = [...result].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    if (sortValue === 'newest') result = [...result].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    return result;
  };

  const groups = [
    { key: 'ongoing', label: 'Ongoing', emoji: '🔴', emptyMsg: 'No ongoing trips right now' },
    { key: 'upcoming', label: 'Upcoming', emoji: '📅', emptyMsg: 'No upcoming trips — time to plan!' },
    { key: 'completed', label: 'Completed', emoji: '✅', emptyMsg: 'No completed trips yet' },
  ];

  const visibleGroups =
    filterValue ? groups.filter((g) => g.key === filterValue) : groups;

  const totalFiltered = visibleGroups.reduce(
    (sum, g) => sum + filterTrips(tripsByStatus[g.key]).length,
    0
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopBar />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                My Trips
              </h1>
              <p className="text-[var(--color-on-surface-variant)] mt-1">
                {trips.length} total trips · {tripsByStatus.upcoming.length} upcoming
              </p>
            </div>
            <Link to="/trips/new">
              <PrimaryButton>
                <Plus size={16} /> New Trip
              </PrimaryButton>
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="mb-8">
            <SearchFilterBar
              searchValue={search}
              onSearchChange={setSearch}
              filterOptions={FILTER_OPTIONS}
              filterValue={filterValue}
              onFilterChange={setFilterValue}
              sortOptions={SORT_OPTIONS}
              sortValue={sortValue}
              onSortChange={setSortValue}
              placeholder="Search trips..."
            />
          </div>

          {/* Empty state when no results */}
          {totalFiltered === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search size={48} className="text-[var(--color-on-surface-variant)]/20 mb-4" />
              <h3 className="text-lg font-bold text-[var(--color-on-surface-variant)] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                No trips found
              </h3>
              <p className="text-sm text-[var(--color-on-surface-variant)]/70 mb-4">
                {search ? `No trips match "${search}"` : 'Start by planning your first trip!'}
              </p>
              <Link to="/trips/new">
                <PrimaryButton>Plan a New Trip</PrimaryButton>
              </Link>
            </div>
          )}

          {/* Trip Groups */}
          {totalFiltered > 0 && (
            <div className="flex flex-col gap-10">
              {visibleGroups.map(({ key, label, emoji, emptyMsg }) => {
                const groupTrips = filterTrips(tripsByStatus[key]);
                return (
                  <section key={key}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">{emoji}</span>
                      <h2 className="text-lg font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {label}
                      </h2>
                      <span className="ml-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]">
                        {groupTrips.length}
                      </span>
                    </div>
                    <TripGroup
                      title={label}
                      trips={groupTrips}
                      emoji={emoji}
                      emptyMsg={emptyMsg}
                      navigate={navigate}
                    />
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
