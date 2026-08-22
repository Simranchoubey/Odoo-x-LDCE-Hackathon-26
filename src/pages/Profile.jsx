import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Mail, Camera, Check, X, AlertCircle } from 'lucide-react';
import TopBar from '../components/TopBar';
import TripCard from '../components/TripCard';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import Modal from '../components/Modal';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { tripsByStatus } = useTrips();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    const result = await updateUser({ name: editForm.name, bio: editForm.bio });
    setSaving(false);
    if (result.success) {
      setEditMode(false);
    } else {
      setSaveError(result.error || 'Failed to save changes');
    }
  };

  const handleCancel = () => {
    setEditForm({ ...user });
    setSaveError('');
    setEditMode(false);
  };

  const preplanned = [...tripsByStatus.upcoming].slice(0, 4);
  const previous = [...tripsByStatus.completed].slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopBar />
      <main className="pt-16">
        <div className="max-w-5xl mx-auto px-5 lg:px-8 py-10">
          {/* Profile Header Card */}
          <div className="bg-[var(--color-surface-container-lowest)] rounded-3xl p-6 md:p-8 card-shadow border border-[var(--color-outline-variant)]/30 mb-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--color-primary)]/20 bg-[var(--color-primary-fixed)]">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[var(--color-primary)]">
                      {user?.name?.[0]}
                    </div>
                  )}
                </div>
                {editMode && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center cursor-pointer border-2 border-white">
                    <Camera size={14} className="text-white" />
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {editMode ? (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">
                        Bio
                      </label>
                      <textarea
                        value={editForm.bio || ''}
                        onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                        rows={3}
                        className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 resize-none transition-all"
                      />
                    </div>
                    {saveError && (
                      <div className="flex items-center gap-2 bg-[var(--color-error-container)] text-[var(--color-error)] rounded-xl px-3 py-2 text-xs">
                        <AlertCircle size={14} /> {saveError}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-black text-[var(--color-on-surface)] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {user?.name}
                    </h1>
                    <div className="flex flex-wrap gap-4 mb-3">
                      <InfoItem icon={<Mail size={14} />} text={user?.email} />
                    </div>
                    {user?.bio && (
                      <p className="text-sm text-[var(--color-on-surface-variant)] line-clamp-2">{user.bio}</p>
                    )}

                    {/* Stats */}
                    <div className="flex gap-6 mt-4 pt-4 border-t border-[var(--color-surface-container)]">
                      <StatBadge label="Trips" value={tripsByStatus.completed.length + tripsByStatus.upcoming.length} />
                      <StatBadge label="Completed" value={tripsByStatus.completed.length} />
                      <StatBadge label="Upcoming" value={tripsByStatus.upcoming.length} />
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Controls */}
              <div className="flex gap-2 shrink-0">
                {editMode ? (
                  <>
                    <SecondaryButton size="sm" onClick={handleCancel}>
                      <X size={14} /> Cancel
                    </SecondaryButton>
                    <PrimaryButton size="sm" loading={saving} onClick={handleSave}>
                      <Check size={14} /> Save
                    </PrimaryButton>
                  </>
                ) : (
                  <SecondaryButton size="sm" onClick={() => setEditMode(true)}>
                    <Edit2 size={14} /> Edit Profile
                  </SecondaryButton>
                )}
              </div>
            </div>
          </div>

          {/* Preplanned Trips */}
          <Section
            title="📅 Preplanned Trips"
            subtitle="Your upcoming adventures"
            trips={preplanned}
            navigate={navigate}
            emptyMsg="No upcoming trips planned yet"
            linkTo="/trips/new"
            linkLabel="Plan a trip"
          />

          {/* Previous Trips */}
          <Section
            title="🗺 Previous Trips"
            subtitle="Your travel memories"
            trips={previous}
            navigate={navigate}
            emptyMsg="No completed trips yet"
          />
        </div>
      </main>
    </div>
  );
}

function InfoItem({ icon, text }) {
  if (!text) return null;
  return (
    <div className="flex items-center gap-1.5 text-sm text-[var(--color-on-surface-variant)]">
      <span className="text-[var(--color-primary)]">{icon}</span>
      {text}
    </div>
  );
}

function StatBadge({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-xl font-black text-[var(--color-primary)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{value}</p>
      <p className="text-xs text-[var(--color-on-surface-variant)] font-medium">{label}</p>
    </div>
  );
}

function Section({ title, subtitle, trips, navigate, emptyMsg, linkTo, linkLabel }) {
  if (trips.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title}</h2>
        <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">{subtitle}</p>
        <div className="flex items-center gap-3 px-5 py-4 bg-[var(--color-surface-container-lowest)] rounded-2xl border border-dashed border-[var(--color-outline-variant)]/40 text-sm text-[var(--color-on-surface-variant)]">
          {emptyMsg}
          {linkTo && linkLabel && (
            <a href={linkTo} className="ml-auto text-[var(--color-primary)] font-semibold hover:underline">{linkLabel} →</a>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title}</h2>
      <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">{subtitle}</p>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
        {trips.map((trip) => (
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
  );
}
