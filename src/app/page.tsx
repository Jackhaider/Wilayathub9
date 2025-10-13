'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useLocation } from '@/context/location-context';

export default function SplashPage() {
  const router = useRouter();
  const { setLocation, error } = useLocation();
  const [status, setStatus] = useState('Fetching your location...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // For now, we'll just use a mock address.
          // A real app would use a reverse geocoding service here.
          const mockAddress = '123 Main St, Anytown, USA';
          setLocation({ latitude, longitude, address: mockAddress });
          setStatus('Location found!');
          router.push('/login');
        },
        (err) => {
          console.error(err);
          setStatus('Could not fetch location.');
          // Redirect even if location is denied
          router.push('/login');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setStatus('Geolocation is not supported by this browser.');
      router.push('/login');
    }
  }, [router, setLocation]);

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
