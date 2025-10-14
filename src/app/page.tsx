'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useLocation } from '@/context/location-context';
import { useUser } from '@/firebase';

export default function SplashPage() {
  const router = useRouter();
  const { setLocation } = useLocation();
  const { user, isUserLoading } = useUser();
  const [status, setStatus] = useState('Fetching your location...');
  const [error, setError] = useState<string | null>(null);
  const [locationFetched, setLocationFetched] = useState(false);

  useEffect(() => {
    // This function handles the redirection logic.
    const redirectUser = () => {
      if (!locationFetched || isUserLoading) {
        return;
      }

      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    };

    const fetchAddress = async (latitude: number, longitude: number) => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        setError("API key is missing.");
        setStatus('Could not fetch location. Using default.');
        setLocation({ latitude: 0, longitude: 0, address: 'Location not found' });
        setLocationFetched(true);
        return;
      }
      
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        const data = await response.json();
        if (data.status === 'OK' && data.results[0]) {
          const formattedAddress = data.results[0].formatted_address;
          setLocation({ latitude, longitude, address: formattedAddress });
          setStatus('Location found!');
          setError(null);
        } else {
          throw new Error(data.error_message || 'No results found');
        }
      } catch (err: any) {
        console.error('Geocoding error:', err);
        setError('Could not determine address.');
        setStatus('Could not fetch address. Using default.');
        setLocation({ latitude, longitude, address: 'Address not found' });
      } finally {
        setLocationFetched(true);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAddress(latitude, longitude);
        },
        (err) => {
          console.error(err);
          setStatus('Could not fetch location. Using default.');
          setError('Please enable location access.');
          setLocation({ latitude: 0, longitude: 0, address: 'Location not found' });
          setLocationFetched(true);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setStatus('Geolocation is not supported. Using default.');
      setError('Geolocation is not supported by your browser.');
      setLocation({ latitude: 0, longitude: 0, address: 'Location not supported' });
      setLocationFetched(true);
    }

    redirectUser();

  }, [router, setLocation, locationFetched, isUserLoading, user]);
  
    useEffect(() => {
    // Second effect to handle redirection after state updates.
    if (!isUserLoading && locationFetched) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isUserLoading, locationFetched, user, router]);


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
