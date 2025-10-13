'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useLocation } from '@/context/location-context';
import { useUser } from '@/firebase';

export default function SplashPage() {
  const router = useRouter();
  const { setLocation, error } = useLocation();
  const { user, isUserLoading } = useUser();
  const [status, setStatus] = useState('Fetching your location...');
  const [locationFetched, setLocationFetched] = useState(false);

  useEffect(() => {
    // This function handles the redirection logic.
    const redirectUser = () => {
      // It should only run if location has been fetched and auth state is known.
      if (!locationFetched || isUserLoading) {
        return;
      }

      if (user) {
        // If user is logged in, redirect to the dashboard.
        router.push('/dashboard');
      } else {
        // If no user, redirect to login.
        router.push('/login');
      }
    };

    // Get the user's location.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, use a reverse geocoding service.
          const mockAddress = '123 Main St, Anytown, USA';
          setLocation({ latitude, longitude, address: mockAddress });
          setStatus('Location found!');
          setLocationFetched(true);
        },
        (err) => {
          console.error(err);
          setStatus('Could not fetch location. Using default.');
          // Even if location fails, we set a default and proceed.
          setLocation({ latitude: 0, longitude: 0, address: 'Location not found' });
          setLocationFetched(true);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setStatus('Geolocation is not supported. Using default.');
      setLocation({ latitude: 0, longitude: 0, address: 'Location not supported' });
      setLocationFetched(true);
    }

    // Attempt to redirect whenever location status or user loading status changes.
    redirectUser();

  }, [router, setLocation, locationFetched, isUserLoading, user]);

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
