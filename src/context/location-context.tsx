'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface LocationContextType {
  location: Location | null;
  setLocation: (location: Location | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const value = useMemo(() => ({
    location,
    setLocation,
    error,
    setError,
  }), [location, error]);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
