'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useLocation } from '@/context/location-context';
import { useUser } from '@/firebase';

export default function SplashPage() {
  const router = useRouter();
  const { location, setLocation } = useLocation();
  const { user, isUserLoading } = useUser();
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);

  // 1. Effect for Location Fetching
  useEffect(() => {
    if (location) return;

    let isMounted = true;
    setStatus('Fetching your location...');

    const fetchAddress = async (latitude: number, longitude: number) => {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error("Google Maps API key is missing.");
        if (isMounted) {
            setError("Configuration error: API key is missing.");
            setStatus('Could not fetch location.');
            setLocation({ latitude: 0, longitude: 0, address: 'Location not found' });
        }
        return;
      }
      
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.status === 'OK' && data.results[0]) {
          const formattedAddress = data.results[0].formatted_address;
          if (isMounted) {
            setLocation({ latitude, longitude, address: formattedAddress });
            setStatus('Location found!');
            setError(null);
          }
        } else {
          throw new Error(data.error_message || 'No address results found');
        }
      } catch (err: any) {
        console.error('Geocoding error:', err);
        if (isMounted) {
            setError('Could not determine address.');
            setStatus('Could not fetch address.');
            setLocation({ latitude, longitude, address: 'Address not available' });
        }
      }
    };
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAddress(latitude, longitude);
        },
        (err) => {
          console.error('Geolocation permission error:', err);
          if (isMounted) {
            setStatus('Location access denied.');
            setError('Please enable location access for the best experience.');
            setLocation({ latitude: 0, longitude: 0, address: 'Location access required' });
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      if (isMounted) {
        setStatus('Geolocation not supported.');
        setError('Your browser does not support geolocation.');
        setLocation({ latitude: 0, longitude: 0, address: 'Location not supported' });
      }
    }

    return () => {
        isMounted = false;
    }
  }, [location, setLocation]);

  // 2. Effect for Redirection
  useEffect(() => {
    if (isUserLoading || !location) {
      return;
    }

    if (user) {
      setStatus('Redirecting to dashboard...');
      router.push('/dashboard');
    } else {
      setStatus('Redirecting to login...');
      router.push('/login');
    }
  }, [isUserLoading, user, location, router]);


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="relative mb-4 flex h-24 w-24 items-center justify-center">
        <div className="absolute h-full w-full animate-ping rounded-full bg-primary/50"></div>
        <div className="relative rounded-full bg-primary p-4 text-primary-foreground">
          <MapPin className="h-8 w-8" />
        </div>
      </div>
      <p className="text-lg font-medium text-foreground">{status}</p>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
