import { createContext, useContext, useState } from 'react';
import { trips as initialTrips } from '../data/trips';

const TripContext = createContext(null);

let nextId = initialTrips.length + 1;

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(initialTrips);

  const getTrip = (id) => trips.find((t) => t.id === id);

  const createTrip = (tripData) => {
    const newTrip = {
      id: `t${nextId++}`,
      sections: [],
      status: 'upcoming',
      budget: { total: 0, spent: 0, currency: 'USD' },
      tags: [],
      userId: 'u1',
      ...tripData,
    };
    setTrips((prev) => [...prev, newTrip]);
    return newTrip;
  };

  const updateTrip = (id, updates) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTrip = (id) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const addSection = (tripId, section) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          sections: [
            ...t.sections,
            {
              id: `s${Date.now()}`,
              title: section.title || `Section ${t.sections.length + 1}`,
              description: section.description || '',
              startDate: section.startDate || '',
              endDate: section.endDate || '',
              budget: section.budget || 0,
              activities: section.activities || [],
            },
          ],
        };
      })
    );
  };

  const updateSection = (tripId, sectionId, updates) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          sections: t.sections.map((s) =>
            s.id === sectionId ? { ...s, ...updates } : s
          ),
        };
      })
    );
  };

  const removeSection = (tripId, sectionId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id !== tripId) return t;
        return { ...t, sections: t.sections.filter((s) => s.id !== sectionId) };
      })
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
        tripsByStatus,
        getTrip,
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
