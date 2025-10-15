
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WilayatHubLogo } from '@/components/icons';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/welcome');
    }, 2500); // Redirect after 2.5 seconds

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-center animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <WilayatHubLogo className="h-24 w-24 text-primary" />
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          WilayatHub
        </h1>
        <p className="text-lg text-muted-foreground">All Services. One Hub.</p>
      </div>
    </div>
  );
}
