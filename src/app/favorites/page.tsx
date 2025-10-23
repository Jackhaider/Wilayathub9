'use client';

import { AppShell } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { customerNavItems, partners } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Heart } from "lucide-react";
import { Rating } from "@/components/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser"; // ✅ updated import path (not "@/firebase")

export default function FavoritesPage() {
  const { user, isUserLoading } = useUser(); // ✅ will always have test user

  // For demo, take first few partners as "favorites"
  const favoritePartners = partners.slice(0, 4);

  if (isUserLoading) {
    return (
      <AppShell navItems={customerNavItems} userType="customer">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Favorite Partners</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell navItems={customerNavItems} userType="customer">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Favorite Partners</h1>
        {favoritePartners.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favoritePartners.map((partner) => (
              <Card key={partner.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage src={partner.avatarUrl} alt={partner.name} />
                    <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle>{partner.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{partner.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Rating rating={partner.rating} size={16} />
                      <span className="text-sm text-muted-foreground">
                        {partner.rating} ({partner.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-6 w-6 text-red-500" fill="currentColor" />
                  </Button>
                </CardHeader>

                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Specializes in {partner.service}.
                  </p>
                </CardContent>

                <CardContent>
                  <Button asChild className="w-full">
                    <a href={`tel:${partner.phone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Contact Now
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Favorites Yet</CardTitle>
              <CardDescription>
                You haven't added any partners to your favorites. Tap the heart icon to save one for later.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12 text-muted-foreground">
              <Heart className="mx-auto h-12 w-12" />
              <p className="mt-4">Your favorite partners will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
