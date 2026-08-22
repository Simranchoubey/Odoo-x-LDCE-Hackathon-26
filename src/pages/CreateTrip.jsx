import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Check, Search, ChevronRight, Plane } from 'lucide-react';
import TopBar from '../components/TopBar';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { useTrips } from '../context/TripContext';
import { api } from '../api/client';
import { useCurrency } from '../context/CurrencyContext';

export default function CreateTrip() {
  const { createTrip } = useTrips();
  const { fmt } = useCurrency();
  const navigate = useNavigate();

  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    api('/cities').then(setCities).catch(() => {});
    api('/activities').then(setActivities).catch(() => {});
  }, []);

  const [form, setForm] = useState({
    name: '',
    destination: '',
    cityId: '',
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState({});
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    c.country.toLowerCase().includes(citySearch.toLowerCase())
  );

  const suggestions = activities.slice(0, 6);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Trip name is required';
    if (!form.destination) errs.destination = 'Please select a destination';
    if (!form.startDate) errs.startDate = 'Start date required';
    if (!form.endDate) errs.endDate = 'End date required';
    if (form.startDate && form.endDate && form.startDate > form.endDate)
      errs.endDate = 'End date must be after start date';
    return errs;
  };

  const handleContinue = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      const trip = await createTrip({
        name: form.name,
        destination: form.destination,
        cityId: form.cityId,
        startDate: form.startDate,
        endDate: form.endDate,
        image: cities.find((c) => c.id === form.cityId)?.imageUrl || null,
        selectedActivities: activities.filter((a) => selectedActivities.includes(a.id)),
      });
      navigate(`/trips/${trip.id}/build`);
    } catch (err) {
      setErrors({ name: err.message });
    }
  };

  const toggleActivity = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleCitySelect = (city) => {
    setForm((p) => ({ ...p, destination: `${city.name}, ${city.country}`, cityId: city.id }));
    setCitySearch(city.name);
    setShowCityDropdown(false);
    if (errors.destination) setErrors((p) => ({ ...p, destination: '' }));
  };

  const Field = ({ id, label, error, children }) => (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[var(--color-error)] mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopBar />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] mb-2">
              <span>My Trips</span>
              <ChevronRight size={14} />
              <span className="text-[var(--color-primary)] font-medium">New Trip</span>
            </div>
            <h1 className="text-3xl font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              ✈ Plan a New Trip
            </h1>
            <p className="text-[var(--color-on-surface-variant)] mt-1">Fill in the details to start building your itinerary</p>
          </div>

          {/* Form Card */}
          <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 md:p-8 card-shadow border border-[var(--color-outline-variant)]/30 mb-8">
            <div className="flex flex-col gap-5">
              {/* Trip Name */}
              <Field id="name" label="Trip Name" error={errors.name}>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); if (errors.name) setErrors((p) => ({ ...p, name: '' })); }}
                  placeholder="e.g., Paris Romantic Getaway"
                  className={`w-full bg-[var(--color-surface-container)] border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30' : 'border-[var(--color-outline-variant)]/40 focus:ring-[var(--color-primary)]/30'}`}
                />
              </Field>

              {/* Destination with autocomplete */}
              <Field id="destination" label="Select a Place" error={errors.destination}>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]/60 pointer-events-none" />
                  <input
                    id="destination"
                    type="text"
                    value={citySearch}
                    onChange={(e) => { setCitySearch(e.target.value); setShowCityDropdown(true); if (errors.destination) setErrors((p) => ({ ...p, destination: '' })); }}
                    onFocus={() => setShowCityDropdown(true)}
                    placeholder="Search cities, countries..."
                    className={`w-full bg-[var(--color-surface-container)] border rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 transition-all ${errors.destination ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]/30' : 'border-[var(--color-outline-variant)]/40 focus:ring-[var(--color-primary)]/30'}`}
                  />
                  {showCityDropdown && filteredCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-surface-container-lowest)] border border-[var(--color-outline-variant)]/40 rounded-2xl shadow-xl z-30 max-h-64 overflow-y-auto">
                      {filteredCities.slice(0, 8).map((city) => {
                        const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';
                        return (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => handleCitySelect(city)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-surface-container)] transition-all text-left"
                        >
                          <img src={city.imageUrl || FALLBACK_IMAGE} onError={(e) => { e.target.src = FALLBACK_IMAGE; }} alt={city.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-[var(--color-on-surface)]">{city.name}</p>
                            <p className="text-xs text-[var(--color-on-surface-variant)]">{city.country} · {city.continent}</p>
                          </div>
                        </button>
                      )})}
                    </div>
                  )}
                </div>
              </Field>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <Field id="startDate" label="Start Date" error={errors.startDate}>
                  <input
                    id="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={(e) => { setForm((p) => ({ ...p, startDate: e.target.value })); if (errors.startDate) setErrors((p) => ({ ...p, startDate: '' })); }}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-all"
                  />
                </Field>
                <Field id="endDate" label="End Date" error={errors.endDate}>
                  <input
                    id="endDate"
                    type="date"
                    value={form.endDate}
                    min={form.startDate}
                    onChange={(e) => { setForm((p) => ({ ...p, endDate: e.target.value })); if (errors.endDate) setErrors((p) => ({ ...p, endDate: '' })); }}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-all"
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Suggested Activities */}
          <section className="mb-8">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                🎯 Suggestions for You
              </h2>
              <p className="text-sm text-[var(--color-on-surface-variant)] mt-0.5">
                Select activities to add to your trip — {selectedActivities.length} selected
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((activity) => {
                const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80';
                const selected = selectedActivities.includes(activity.id);
                return (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => toggleActivity(activity.id)}
                    className={`group relative text-left rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                      selected
                        ? 'border-[var(--color-primary)] shadow-md shadow-[var(--color-primary)]/20'
                        : 'border-[var(--color-outline-variant)]/30 hover:border-[var(--color-primary)]/40'
                    }`}
                    aria-pressed={selected}
                  >
                    <div className="h-40 relative overflow-hidden">
                      <img
                        src={activity.imageUrl || FALLBACK_IMAGE}
                        alt={activity.name}
                        onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {selected && (
                        <div className="absolute top-3 right-3 w-7 h-7 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-bold text-sm leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{activity.name}</p>
                        <p className="text-white/70 text-xs">{activity.city?.name}, {activity.city?.country}</p>
                      </div>
                    </div>
                    <div className="bg-[var(--color-surface-container-lowest)] p-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-[var(--color-on-surface-variant)]">
                        {activity.durationMins >= 60 ? `${Math.round(activity.durationMins / 60)}h` : `${activity.durationMins}m`} · {fmt(activity.cost)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        selected ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]'
                      }`}>
                        {activity.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <SecondaryButton onClick={() => navigate('/trips')}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleContinue}>
              Continue to Itinerary <ChevronRight size={16} />
            </PrimaryButton>
          </div>
        </div>
      </main>
    </div>
  );
}
