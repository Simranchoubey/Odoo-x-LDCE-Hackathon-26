import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Globe2, MapPin, Calendar, Clock, Copy, Check, Frown } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { api, getToken } from '../api/client';
import { useCurrency } from '../context/CurrencyContext';

export default function SharedTrip() {
  const { slug } = useParams();
  const { fmt } = useCurrency();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api(`/public/trips/${slug}`).then(setTrip).catch((e) => setError(e.message));
  }, [slug]);

  const handleCopy = async () => {
    if (!getToken()) {
      window.location.href = '/login';
      return;
    }
    await api(`/public/trips/${slug}/copy`, { method: 'POST' });
    setCopied(true);
    setTimeout(() => (window.location.href = '/trips'), 800);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center p-8">
          <Frown size={48} className="text-[var(--color-on-surface-variant)]/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">Itinerary not found</h2>
          <p className="text-[var(--color-on-surface-variant)]">{error}</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return <div className="min-h-screen bg-[var(--color-background)]" aria-busy="true" />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        {trip.image && (
          <img src={trip.image} alt={trip.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-5 lg:px-8 pb-6">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
            <Globe2 size={16} /> Shared itinerary
          </div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {trip.name}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-white/80 text-sm flex-wrap">
            <span className="flex items-center gap-1"><MapPin size={14} /> {trip.destination}</span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {trip.startDate} – {trip.endDate}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-5 lg:px-8 py-8">
        {trip.description && (
          <p className="text-[var(--color-on-surface-variant)] mb-6">{trip.description}</p>
        )}

        {trip.sections.map((section) => (
          <section key={section.id} className="mb-6 bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-outline-variant)]/30 overflow-hidden">
            <header className="px-5 py-4 border-b border-[var(--color-outline-variant)]/30">
              <h2 className="font-bold text-[var(--color-on-surface)]">{section.title}</h2>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                {section.startDate} – {section.endDate}
                {section.city ? ` · ${section.city.name}, ${section.city.country}` : ''}
              </p>
            </header>
            <ul className="divide-y divide-[var(--color-outline-variant)]/20">
              {section.activities.length === 0 ? (
                <li className="px-5 py-4 text-sm text-[var(--color-on-surface-variant)]">No activities planned.</li>
              ) : (
                section.activities.map((activity) => (
                  <li key={activity.id} className="px-5 py-3 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-on-surface)]">{activity.name}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> {activity.time || '--:--'} · {activity.date}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-primary)]">
                      {fmt(activity.expense)}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </section>
        ))}

        <div className="mt-8 flex items-center justify-between bg-[var(--color-surface-container-lowest)] rounded-2xl border border-[var(--color-outline-variant)]/30 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-[var(--color-on-surface)]">Like this plan?</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Copy it into your account and make it yours.</p>
          </div>
          {copied ? (
            <SecondaryButton><Check size={16} /> Copied!</SecondaryButton>
          ) : (
            <PrimaryButton onClick={handleCopy}><Copy size={16} /> Copy Trip</PrimaryButton>
          )}
        </div>
      </main>
    </div>
  );
}
