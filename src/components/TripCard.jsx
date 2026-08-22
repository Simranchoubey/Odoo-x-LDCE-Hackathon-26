import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const STATUS_STYLES = {
  ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border-[var(--color-outline-variant)]/50',
};

const STATUS_LABELS = {
  ongoing: '● Ongoing',
  upcoming: '◈ Upcoming',
  completed: '✓ Completed',
};

export default function TripCard({ trip, variant = 'default', onView }) {
  const { id, name, destination, image, startDate, endDate, status, description } = trip;

  const dateStr = startDate
    ? `${formatDate(startDate)}${endDate ? ` – ${formatDate(endDate)}` : ''}`
    : 'Date TBD';

  if (variant === 'compact') {
    return (
      <article className="group relative bg-[var(--color-surface-container-lowest)] rounded-2xl overflow-hidden border border-[var(--color-outline-variant)]/30 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-0.5">
        <div className="aspect-[4/3] w-full bg-[var(--color-surface-container)] overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <ImagePlaceholder name={name} />
          )}
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-1 truncate">
            {destination}
          </p>
          <h3 className="text-sm font-bold text-[var(--color-on-surface)] mb-3 line-clamp-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-3">
            <Calendar size={12} />
            <span>{dateStr}</span>
          </div>
          <button
            onClick={onView}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-200"
          >
            View Trip
          </button>
        </div>
      </article>
    );
  }

  // Default / list variant
  return (
    <Link to={`/trips/${id}/itinerary`}>
      <article className="group flex gap-4 bg-[var(--color-surface-container-lowest)] rounded-2xl p-4 border border-[var(--color-outline-variant)]/30 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[var(--color-surface-container)]">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <ImagePlaceholder name={name} small />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-[var(--color-on-surface)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {name}
            </h3>
            {status && (
              <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLES[status] || STATUS_STYLES.completed}`}>
                {STATUS_LABELS[status] || status}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-1.5 min-w-0">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{destination}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-2">
            <Calendar size={12} />
            <span>{dateStr}</span>
          </div>
          {description && (
            <p className="text-xs text-[var(--color-on-surface-variant)] line-clamp-1">{description}</p>
          )}
        </div>
        <div className="hidden sm:flex items-center text-[var(--color-on-surface-variant)]/40 group-hover:text-[var(--color-primary)] transition-colors">
          <ArrowRight size={18} />
        </div>
      </article>
    </Link>
  );
}

function ImagePlaceholder({ name, small }) {
  const colors = ['from-orange-200 to-red-200', 'from-blue-200 to-cyan-200', 'from-purple-200 to-pink-200', 'from-green-200 to-teal-200'];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
      <MapPin size={small ? 16 : 24} className="text-white/70" />
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
