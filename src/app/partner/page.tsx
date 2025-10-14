
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WilayatHubLogo } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const features = [
    "Connect with local customers",
    "Manage your services and bookings",
    "Grow your business and earnings",
    "Real-time chat with customers"
]

export default function PartnerEntryPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
            <Card className="shadow-lg">
                <CardHeader className="items-center text-center">
                    <WilayatHubLogo className="h-16 w-16 text-primary mb-4" />
                    <Badge variant="outline" className="mb-2">For Partners</Badge>
                    <CardTitle className="text-3xl">Welcome, Partner!</CardTitle>
                    <CardDescription className="text-base">
                        Grow your business with WilayatHub — connect with local customers and earn more.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                                    <Check className="h-3.5 w-3.5" />
                                </div>
                                <p className="text-muted-foreground">{feature}</p>
                            </div>
                        ))}
                    </div>
                     <div className="space-y-3">
                        <Button size="lg" className="w-full h-12 text-base" onClick={() => router.push('/login?as=partner')}>
                          Sign Up / Login
                        </Button>
                        <Button size="lg" variant="outline" className="w-full h-12 text-base">
                          Learn More
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
