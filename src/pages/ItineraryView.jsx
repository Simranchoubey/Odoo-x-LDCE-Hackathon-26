import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowDown, Frown, Edit, Wallet, AlertTriangle } from 'lucide-react';
import TopBar from '../components/TopBar';
import SearchFilterBar from '../components/SearchFilterBar';
import { useTrips } from '../context/TripContext';
import { useCurrency } from '../context/CurrencyContext';
import { SecondaryButton, PrimaryButton } from '../components/Button';
import { api } from '../api/client';

const SORT_OPTIONS = [
  { value: 'day', label: 'By Day' },
  { value: 'expense', label: 'By Expense' },
];

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTrip } = useTrips();
  const { fmt, currency } = useCurrency();
  const trip = getTrip(id);
  const [openSections, setOpenSections] = useState(() => {
    if (!trip) return {};
    return Object.fromEntries(trip.sections.map((s) => [s.id, true]));
  });
  const [search, setSearch] = useState('');
  const [sortValue, setSortValue] = useState('day');
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    if (!id) return;
    api(`/trips/${id}/budget`).then(setBudget).catch(() => {});
  }, [id]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
        <TopBar />
        <main className="pt-16 flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <Frown size={48} className="text-[var(--color-on-surface-variant)]/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Trip Not Found</h2>
            <SecondaryButton onClick={() => navigate('/trips')}>Back to Trips</SecondaryButton>
          </div>
        </main>
      </div>
    );
  }

  // Budget summary comes from GET /trips/:id/budget (category totals, over-budget days);
  // fall back to the trip's own totals until that request resolves.
  const totalBudget = budget?.totalBudget ?? trip.budget?.total ?? 0;
  const totalSpent = budget?.spent ?? trip.budget?.spent ?? 0;
  const remaining = budget?.remaining ?? (totalBudget - totalSpent);
  const pct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const toggleSection = (id) => setOpenSections((p) => ({ ...p, [id]: !p[id] }));

  const filteredSections = trip.sections
    .map((s) => ({
      ...s,
      activities: s.activities.filter(
        (a) => !search || a.name.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((s) => !search || s.activities.length > 0 || s.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopBar />
      <main className="pt-16">
        <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                🗺 {trip.name}
              </h1>
              <p className="text-[var(--color-on-surface-variant)] mt-1">{trip.destination}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <SecondaryButton size="sm" onClick={() => navigate(`/trips/${id}/build`)}>
                <Edit size={14} /> Edit
              </SecondaryButton>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="mb-5">
                <SearchFilterBar
                  searchValue={search}
                  onSearchChange={setSearch}
                  sortOptions={SORT_OPTIONS}
                  sortValue={sortValue}
                  onSortChange={setSortValue}
                  placeholder="Search activities..."
                />
              </div>

              {filteredSections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-[var(--color-surface-container-lowest)] rounded-2xl border border-dashed border-[var(--color-outline-variant)]/40">
                  <Frown size={40} className="text-[var(--color-on-surface-variant)]/30 mb-3" />
                  <h3 className="text-base font-bold text-[var(--color-on-surface-variant)] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    No itinerary yet
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)]/70 mb-4">Start building your itinerary</p>
                  <PrimaryButton size="sm" onClick={() => navigate(`/trips/${id}/build`)}>
                    Build Itinerary
                  </PrimaryButton>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredSections.map((section, sIdx) => (
                    <section
                      key={section.id}
                      className="bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-outline-variant)]/30 overflow-hidden card-shadow"
                    >
                      {/* Section Header */}
                      <button
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--color-surface-container-low)] transition-colors"
                        onClick={() => toggleSection(section.id)}
                        aria-expanded={openSections[section.id]}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {sIdx + 1}
                          </div>
                          <div>
                            <h2 className="text-base font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {section.title || `Section ${sIdx + 1}`}
                            </h2>
                            {section.startDate && (
                              <p className="text-xs text-[var(--color-on-surface-variant)]">
                                {formatDate(section.startDate)}{section.endDate ? ` → ${formatDate(section.endDate)}` : ''}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {section.budget > 0 && (
                            <span className="text-sm font-semibold text-[var(--color-primary)]">
                              Budget: {fmt(section.budget)}
                            </span>
                          )}
                          {openSections[section.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </button>

                      {/* Activities */}
                      {openSections[section.id] && (
                        <div className="px-5 pb-5">
                          {section.description && (
                            <p className="text-sm text-[var(--color-on-surface-variant)] mb-4 pl-11">{section.description}</p>
                          )}
                          {section.activities.length === 0 ? (
                            <div className="pl-11 text-sm text-[var(--color-on-surface-variant)]/60 italic">
                              No activities in this section
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2 pl-11">
                              {section.activities.map((activity, aIdx) => (
                                <div key={activity.id}>
                                  <div className="flex items-start justify-between gap-4 bg-[var(--color-surface-container)] rounded-xl px-4 py-3">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        {activity.time && (
                                          <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">
                                            {activity.time}
                                          </span>
                                        )}
                                        <p className="text-sm font-semibold text-[var(--color-on-surface)] line-clamp-1">
                                          {activity.name}
                                        </p>
                                      </div>
                                    </div>
                                    {activity.expense > 0 && (
                                      <div className="flex items-center gap-1 text-sm font-bold text-[var(--color-primary)] shrink-0">
                                        {fmt(activity.expense)}
                                      </div>
                                    )}
                                  </div>
                                  {aIdx < section.activities.length - 1 && (
                                    <div className="flex justify-center my-1">
                                      <ArrowDown size={14} className="text-[var(--color-on-surface-variant)]/30" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              )}
            </div>

            {/* Budget Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-20 bg-[var(--color-surface-container-lowest)] rounded-2xl p-5 card-shadow border border-[var(--color-outline-variant)]/30">
                <h3 className="text-base font-bold text-[var(--color-on-surface)] mb-4 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <Wallet size={18} className="text-[var(--color-primary)]" /> Budget ({currency})
                </h3>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[var(--color-on-surface-variant)] mb-1.5">
                    <span>Spent</span>
                    <span>{Math.round(pct)}%</span>
                  </div>
                  <div className="h-2 bg-[var(--color-surface-container)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${pct > 90 ? 'bg-[var(--color-error)]' : pct > 70 ? 'bg-amber-400' : 'bg-[var(--color-primary)]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Over-budget alert */}
                {budget?.overBudgetDays?.length > 0 && (
                  <div className="mb-4 flex items-start gap-2 bg-[var(--color-error-container)] text-[var(--color-error)] rounded-xl px-3 py-2.5 text-xs">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold mb-0.5">
                        {budget.overBudgetDays.length} day{budget.overBudgetDays.length > 1 ? 's' : ''} over budget
                      </p>
                      <p className="opacity-80">{budget.overBudgetDays.map(formatDate).join(', ')}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <BudgetRow label="Total Budget" value={fmt(totalBudget)} />
                  <BudgetRow label="Spent" value={fmt(totalSpent)} highlight />
                  <div className="border-t border-[var(--color-surface-container)] pt-3">
                    <BudgetRow
                      label="Remaining"
                      value={fmt(remaining)}
                      color={remaining < 0 ? 'text-[var(--color-error)]' : 'text-emerald-600'}
                    />
                  </div>
                </div>

                {/* Category breakdown */}
                {budget && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-surface-container)]">
                    <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">By Category</p>
                    {Object.values(budget.byCategory).every((v) => v === 0) ? (
                      <p className="text-xs text-[var(--color-on-surface-variant)]/60 italic">No categorized spend yet</p>
                    ) : (
                      Object.entries(budget.byCategory)
                        .filter(([, amount]) => amount > 0)
                        .map(([category, amount]) => (
                          <div key={category} className="flex items-center justify-between text-xs mb-2">
                            <span className="text-[var(--color-on-surface-variant)] capitalize">{category}</span>
                            <span className="font-semibold text-[var(--color-on-surface)]">{fmt(amount)}</span>
                          </div>
                        ))
                    )}
                  </div>
                )}

                {/* Per section breakdown */}
                {trip.sections.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--color-surface-container)]">
                    <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-2">By Section</p>
                    {trip.sections.map((s, i) => {
                      const spent = s.activities.reduce((sum, a) => sum + (a.expense || 0), 0);
                      return (
                        <div key={s.id} className="flex items-center justify-between text-xs mb-2">
                          <span className="text-[var(--color-on-surface-variant)] truncate flex-1 mr-2">
                            {s.title || `Section ${i + 1}`}
                          </span>
                          <span className="font-semibold text-[var(--color-on-surface)] shrink-0">{fmt(spent)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function BudgetRow({ label, value, highlight, color }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-[var(--color-on-surface-variant)]">{label}</span>
      <span className={`text-sm font-bold ${color || (highlight ? 'text-[var(--color-primary)]' : 'text-[var(--color-on-surface)]')}`}>
        {value}
      </span>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}
