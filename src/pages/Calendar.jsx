import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import TopBar from '../components/TopBar';
import SearchFilterBar from '../components/SearchFilterBar';
import { useTrips } from '../context/TripContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TRIP_COLORS = [
  { bg: 'bg-[var(--color-primary)]', text: 'text-white', light: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' },
  { bg: 'bg-teal-500', text: 'text-white', light: 'bg-teal-50 text-teal-700' },
  { bg: 'bg-purple-500', text: 'text-white', light: 'bg-purple-50 text-purple-700' },
  { bg: 'bg-amber-500', text: 'text-white', light: 'bg-amber-50 text-amber-700' },
  { bg: 'bg-emerald-500', text: 'text-white', light: 'bg-emerald-50 text-emerald-700' },
];

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function CalendarView() {
  const navigate = useNavigate();
  const { trips } = useTrips();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [search, setSearch] = useState('');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));

  // Get all trips that overlap this month
  const tripsWithColor = trips
    .filter((t) => {
      if (!t.startDate) return false;
      const s = parseDate(t.startDate);
      const e = t.endDate ? parseDate(t.endDate) : s;
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      return s <= monthEnd && e >= monthStart;
    })
    .filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()))
    .map((t, i) => ({ ...t, color: TRIP_COLORS[i % TRIP_COLORS.length] }));

  const getTripsForDay = (day) => {
    const d = new Date(year, month, day);
    d.setHours(0, 0, 0, 0);
    return tripsWithColor.filter((t) => {
      const s = parseDate(t.startDate);
      const e = t.endDate ? parseDate(t.endDate) : s;
      return d >= s && d <= e;
    });
  };

  // Build calendar cells
  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: prevMonthDays - firstDay + 1 + i, current: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, current: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - firstDay - daysInMonth + 1, current: false });
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopBar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {monthLabel}
              </h1>
              <p className="text-[var(--color-on-surface-variant)] mt-1">Plan and view all your trips at a glance</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[var(--color-surface-container)] rounded-xl p-1">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-all"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goToday}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-all"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-all"
                  aria-label="Next month"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <button
                onClick={() => navigate('/trips/new')}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold primary-shadow hover:bg-[var(--color-on-primary-fixed-variant)] transition-all"
              >
                <Plus size={16} /> New Trip
              </button>
            </div>
          </div>

          <div className="mb-4">
            <SearchFilterBar
              searchValue={search}
              onSearchChange={setSearch}
              placeholder="Filter trips on calendar..."
            />
          </div>

          {/* Trip legend */}
          {tripsWithColor.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tripsWithColor.map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate(`/trips/${t.id}/itinerary`)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${t.color.light} transition-all hover:shadow-sm`}
                >
                  <span className={`w-2 h-2 rounded-full ${t.color.bg}`} />
                  {t.name}
                </button>
              ))}
            </div>
          )}

          {/* Calendar Grid */}
          <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl overflow-hidden card-shadow border border-[var(--color-outline-variant)]/30">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-[var(--color-surface-container)]">
              {DAYS.map((d) => (
                <div key={d} className="py-3 text-center text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {cells.map((cell, idx) => {
                if (!cell.current) {
                  return (
                    <div
                      key={`prev-${idx}`}
                      className="min-h-[80px] md:min-h-[110px] p-2 border-b border-r border-[var(--color-surface-container)] last:border-r-0 bg-[var(--color-surface-container)]/20"
                    >
                      <span className="text-xs text-[var(--color-on-surface-variant)]/30 font-medium">{cell.day}</span>
                    </div>
                  );
                }

                const dayTrips = getTripsForDay(cell.day);
                const cellDate = new Date(year, month, cell.day);
                cellDate.setHours(0, 0, 0, 0);
                const isToday = cellDate.getTime() === today.getTime();

                return (
                  <div
                    key={`day-${cell.day}`}
                    className={`min-h-[80px] md:min-h-[110px] p-2 border-b border-r border-[var(--color-surface-container)] last:border-r-0 flex flex-col gap-1 hover:bg-[var(--color-surface-container-low)] transition-colors ${isToday ? 'bg-[var(--color-primary)]/3' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                          isToday
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'text-[var(--color-on-surface)]'
                        }`}
                      >
                        {cell.day}
                      </span>
                    </div>
                    {dayTrips.slice(0, 2).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => navigate(`/trips/${t.id}/itinerary`)}
                        className={`w-full text-left px-2 py-0.5 rounded-lg text-xs font-semibold truncate ${t.color.light} hover:shadow-sm transition-all`}
                        title={t.name}
                      >
                        {t.name}
                      </button>
                    ))}
                    {dayTrips.length > 2 && (
                      <span className="text-xs text-[var(--color-on-surface-variant)]/60 px-1">
                        +{dayTrips.length - 2} more
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
