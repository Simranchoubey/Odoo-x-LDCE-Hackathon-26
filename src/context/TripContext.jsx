import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken } from '../api/client';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(!!getToken());

  const refresh = () => api('/trips').then(setTrips);

  useEffect(() => {
    if (!getToken()) return;
    refresh().finally(() => setLoading(false));
  }, []);

  const getTrip = (id) => trips.find((t) => t.id === id);

  const createTrip = async (tripData) => {
    const trip = await api('/trips', {
      method: 'POST',
      body: {
        name: tripData.name,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        description: tripData.description || '',
        coverImage: tripData.image || undefined,
      },
    });

    if (tripData.cityId) {
      const stop = await api(`/trips/${trip.id}/stops`, {
        method: 'POST',
        body: {
          cityId: tripData.cityId,
          arrivalDate: tripData.startDate,
          departureDate: tripData.endDate,
          budget: 0,
        },
      });
      for (const activity of tripData.selectedActivities || []) {
        await api(`/trips/stops/${stop.id}/items`, {
          method: 'POST',
          body: {
            activityId: activity.id,
            title: activity.name,
            date: tripData.startDate,
            cost: activity.cost || 0,
            category: 'activity',
          },
        });
      }
    }

    const full = await api(`/trips/${trip.id}`);
    setTrips((prev) => [full, ...prev]);
    return full;
  };

  const updateTrip = async (id, updates) => {
    const updated = await api(`/trips/${id}`, { method: 'PATCH', body: updates });
    setTrips((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const deleteTrip = async (id) => {
    await api(`/trips/${id}`, { method: 'DELETE' });
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const addSection = async (tripId, section) => {
    const trip = getTrip(tripId);
    const stop = await api(`/trips/${tripId}/stops`, {
      method: 'POST',
      body: {
        title: section.title || `Stop ${(trip?.sections.length || 0) + 1}`,
        arrivalDate: section.startDate || trip?.startDate,
        departureDate: section.endDate || trip?.endDate,
        budget: section.budget || 0,
      },
    });
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              sections: [
                ...t.sections,
                {
                  id: stop.id,
                  title: stop.title,
                  description: '',
                  startDate: stop.arrivalDate?.slice(0, 10),
                  endDate: stop.departureDate?.slice(0, 10),
                  budget: stop.budget,
                  city: null,
                  activities: [],
                },
              ],
            }
          : t
      )
    );
  };

  const updateSection = async (tripId, sectionId, updates) => {
    const body = {};
    if (updates.title !== undefined) body.title = updates.title;
    if (updates.budget !== undefined) body.budget = updates.budget;
    if (updates.startDate !== undefined && updates.startDate) body.arrivalDate = updates.startDate;
    if (updates.endDate !== undefined && updates.endDate) body.departureDate = updates.endDate;
    await api(`/trips/stops/${sectionId}`, { method: 'PATCH', body });
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              sections: t.sections.map((s) => (s.id === sectionId ? { ...s, ...updates } : s)),
            }
          : t
      )
    );
  };

  const removeSection = async (tripId, sectionId) => {
    await api(`/trips/stops/${sectionId}`, { method: 'DELETE' });
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId ? { ...t, sections: t.sections.filter((s) => s.id !== sectionId) } : t
      )
    );
  };

  const tripsByStatus = {
    ongoing: trips.filter((t) => t.status === 'ongoing'),
    upcoming: trips.filter((t) => t.status === 'upcoming'),
    completed: trips.filter((t) => t.status === 'completed'),
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        loading,
        tripsByStatus,
        getTrip,
        refresh,
        createTrip,
        updateTrip,
        deleteTrip,
        addSection,
        updateSection,
        removeSection,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used within TripProvider');
  return ctx;
}
