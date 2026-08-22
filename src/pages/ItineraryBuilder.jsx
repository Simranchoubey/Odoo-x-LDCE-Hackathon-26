import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, MapPin, Frown } from 'lucide-react';
import TopBar from '../components/TopBar';
import SectionCard from '../components/SectionCard';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { useTrips } from '../context/TripContext';

export default function ItineraryBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTrip, addSection, updateSection, removeSection } = useTrips();
  const trip = getTrip(id);

  const handleAddSection = () => {
    addSection(id, {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: 0,
    });
  };

  const handleUpdate = (sectionId, updates) => {
    updateSection(id, sectionId, updates);
  };

  const handleDelete = (sectionId) => {
    removeSection(id, sectionId);
  };

  if (!trip) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col">
        <TopBar />
        <main className="pt-16 flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <Frown size={48} className="text-[var(--color-on-surface-variant)]/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Trip Not Found
            </h2>
            <p className="text-[var(--color-on-surface-variant)] mb-4">This trip doesn't exist or was deleted.</p>
            <SecondaryButton onClick={() => navigate('/trips')}>Back to My Trips</SecondaryButton>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TopBar />
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-5 lg:px-8 py-10">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-[var(--color-on-surface-variant)] mb-2 min-w-0">
              <span className="shrink-0">My Trips</span>
              <ChevronRight size={14} className="shrink-0" />
              <span className="truncate">{trip.name}</span>
              <ChevronRight size={14} className="shrink-0" />
              <span className="text-[var(--color-primary)] font-medium shrink-0">Build Itinerary</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-3xl font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Build Itinerary
                </h1>
                <div className="flex items-center gap-2 mt-2 min-w-0">
                  <MapPin size={14} className="text-[var(--color-primary)] shrink-0" />
                  <span className="text-sm text-[var(--color-on-surface-variant)] truncate">{trip.destination}</span>
                  {trip.startDate && (
                    <>
                      <span className="text-[var(--color-outline-variant)]">·</span>
                      <span className="text-sm text-[var(--color-on-surface-variant)]">
                        {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <SecondaryButton size="sm" onClick={() => navigate(`/trips/${id}/itinerary`)}>
                  View Itinerary
                </SecondaryButton>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-4 mb-6">
            {trip.sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 bg-[var(--color-surface-container-lowest)] rounded-2xl border border-dashed border-[var(--color-outline-variant)]/50 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                  <Plus size={28} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="text-base font-bold text-[var(--color-on-surface)] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  No sections yet
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] mb-4">
                  Sections organize your itinerary — add flights, hotels, and activities as separate sections.
                </p>
                <PrimaryButton onClick={handleAddSection}>
                  <Plus size={16} /> Add First Section
                </PrimaryButton>
              </div>
            ) : (
              trip.sections.map((section, index) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  index={index}
                  onUpdate={(updates) => handleUpdate(section.id, updates)}
                  onDelete={() => handleDelete(section.id)}
                />
              ))
            )}
          </div>

          {/* Add Section Button */}
          {trip.sections.length > 0 && (
            <button
              onClick={handleAddSection}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-[var(--color-primary)]/30 text-[var(--color-primary)] text-sm font-semibold hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all duration-200"
            >
              <Plus size={18} /> Add another Section
            </button>
          )}

          {/* Footer Actions */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-[var(--color-outline-variant)]/30">
            <SecondaryButton onClick={() => navigate('/trips')}>
              Save & Exit
            </SecondaryButton>
            <PrimaryButton onClick={() => navigate(`/trips/${id}/itinerary`)}>
              View Full Itinerary <ChevronRight size={16} />
            </PrimaryButton>
          </div>
        </div>
      </main>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
}
