
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { WilayatHubLogo } from '@/components/icons';

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <WilayatHubLogo className="h-20 w-20 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          WilayatHub
        </h1>
        <p className="text-muted-foreground">All Services. One Hub.</p>
      </div>

      <div className="mt-12 w-full max-w-sm space-y-4">
        <Button
          size="lg"
          className="w-full h-14 text-lg"
          onClick={() => router.push('/dashboard')}
        >
          Continue as Customer
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full h-14 text-lg"
          onClick={() => router.push('/partner')}
        >
          Continue as Partner
        </Button>
      </div>

       <div className="absolute bottom-6 text-center text-xs text-muted-foreground">
        <p>Choose your role to get started.</p>
        <p>You can switch roles later from your profile.</p>
      </div>
    </div>
  );
}
