'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';

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

// This component will handle the logic for fetching the location
const LocationFetcher = () => {
    const { setLocation, setError } = useLocation();

    useEffect(() => {
        if (typeof window !== 'undefined' && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                        if (!apiKey) {
                            throw new Error("Google Maps API key is missing.");
                        }
                        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
                        const data = await response.json();

                        if (data.status === 'OK' && data.results[0]) {
                            const address = data.results[0].formatted_address;
                            setLocation({ latitude, longitude, address });
                            setError(null);
                        } else {
                            throw new Error('Could not fetch address. Geocoding failed: ' + data.status);
                        }
                    } catch (err: any) {
                        console.error("Error fetching address:", err);
                        setError(err.message || 'Failed to fetch address.');
                        setLocation(null);
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    let errorMessage = 'Could not get location. ';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Permission denied.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Position unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Request timed out.';
                            break;
                        default:
                            errorMessage += 'An unknown error occurred.';
                            break;
                    }
                    setError(errorMessage);
                    setLocation(null);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser.');
        }
    }, [setLocation, setError]);

    return null; // This component does not render anything
};


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
      <LocationFetcher />
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
