import { useState } from 'react';
import { Search, SlidersHorizontal, Plus, Star, Clock, DollarSign } from 'lucide-react';
import TopBar from '../components/TopBar';
import SearchFilterBar from '../components/SearchFilterBar';
import { activities } from '../data/activities';
import { cities } from '../data/cities';
import { useTrips } from '../context/TripContext';

const CATEGORY_OPTIONS = [
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Food & Culture', label: 'Food & Culture' },
  { value: 'Nature', label: 'Nature' },
  { value: 'Heritage', label: 'Heritage' },
  { value: 'Water Sports', label: 'Water Sports' },
  { value: 'Culture', label: 'Culture' },
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low–High' },
  { value: 'price_desc', label: 'Price: High–Low' },
  { value: 'name', label: 'Name A–Z' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Challenging', label: 'Challenging' },
];

function ActivityRow({ activity, onAdd, added }) {
  return (
    <div className="group flex items-center gap-4 bg-[var(--color-surface-container-lowest)] rounded-2xl p-4 border border-[var(--color-outline-variant)]/30 card-shadow hover:card-shadow-hover transition-all duration-200">
      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="text-base font-bold text-[var(--color-on-surface)] line-clamp-1 flex-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {activity.name}
          </h3>
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium">
            {activity.category}
          </span>
        </div>
        <p className="text-xs text-[var(--color-on-surface-variant)] mb-2 line-clamp-1">{activity.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-[var(--color-on-surface-variant)]">
          <span className="flex items-center gap-1">
            <Star size={11} className="text-amber-400" fill="currentColor" /> {activity.rating}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} /> {activity.duration}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign size={11} /> ${activity.cost}
          </span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${activity.difficulty === 'Easy' ? 'bg-emerald-400' : activity.difficulty === 'Moderate' ? 'bg-amber-400' : 'bg-red-400'}`} />
            {activity.difficulty}
          </span>
        </div>
      </div>
      <button
        onClick={() => onAdd(activity)}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
          added
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
            : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white'
        }`}
        disabled={added}
      >
        {added ? '✓ Added' : <><Plus size={14} /> Add</>}
      </button>
    </div>
  );
}

export default function ActivitySearch() {
  const { trips } = useTrips();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortValue, setSortValue] = useState('rating');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [addedIds, setAddedIds] = useState([]);
  const [addedNotice, setAddedNotice] = useState('');

  const handleAdd = (activity) => {
    if (addedIds.includes(activity.id)) return;
    setAddedIds((p) => [...p, activity.id]);
    setAddedNotice(`"${activity.name}" added to your wishlist!`);
    setTimeout(() => setAddedNotice(''), 3000);
  };

  let filtered = activities.filter((a) => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase()) || a.country.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || a.category === categoryFilter;
    const matchDifficulty = !difficultyFilter || a.difficulty === difficultyFilter;
    return matchSearch && matchCategory && matchDifficulty;
  });

  if (sortValue === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  else if (sortValue === 'price_asc') filtered = [...filtered].sort((a, b) => a.cost - b.cost);
  else if (sortValue === 'price_desc') filtered = [...filtered].sort((a, b) => b.cost - a.cost);
  else if (sortValue === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopBar />
      <main className="pt-16">
        <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              🔍 Explore Activities
            </h1>
            <p className="text-[var(--color-on-surface-variant)] mt-1">
              Discover unique experiences from around the world
            </p>
          </div>

          {/* Search + Filter */}
          <div className="mb-6">
            <SearchFilterBar
              searchValue={search}
              onSearchChange={setSearch}
              filterOptions={CATEGORY_OPTIONS}
              filterValue={categoryFilter}
              onFilterChange={setCategoryFilter}
              sortOptions={SORT_OPTIONS}
              sortValue={sortValue}
              onSortChange={setSortValue}
              placeholder="Search activities, cities..."
            />
          </div>

          {/* Difficulty filter pills */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <span className="text-xs font-semibold text-[var(--color-on-surface-variant)] self-center mr-1">Difficulty:</span>
            {['', ...DIFFICULTY_OPTIONS.map((d) => d.value)].map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  difficultyFilter === d
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
                }`}
              >
                {d || 'All'}
              </button>
            ))}
          </div>

          {/* Toast notification */}
          {addedNotice && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[var(--color-inverse-surface)] text-[var(--color-inverse-on-surface)] px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium">
              ✓ {addedNotice}
            </div>
          )}

          {/* Results */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Results <span className="text-[var(--color-on-surface-variant)] font-normal text-base">({filtered.length})</span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search size={48} className="text-[var(--color-on-surface-variant)]/20 mb-4" />
              <h3 className="text-lg font-bold text-[var(--color-on-surface-variant)] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                No activities found
              </h3>
              <p className="text-sm text-[var(--color-on-surface-variant)]/70">
                {search ? `No results for "${search}"` : 'Try adjusting your filters'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((activity) => (
                <ActivityRow
                  key={activity.id}
                  activity={activity}
                  onAdd={handleAdd}
                  added={addedIds.includes(activity.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
