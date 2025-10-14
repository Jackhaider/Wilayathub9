
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/rating';
import {
  partners,
  serviceCategories,
  customerNavItems,
} from '@/lib/data';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  if (!query) {
    return (
      <div className="text-center">
        <p>Please enter a search term.</p>
      </div>
    );
  }

  const lowerCaseQuery = query.toLowerCase();

  const filteredCategories = serviceCategories.filter((category) =>
    category.name.toLowerCase().includes(lowerCaseQuery)
  );

  const filteredPartners = partners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(lowerCaseQuery) ||
      partner.service.toLowerCase().includes(lowerCaseQuery) ||
      (partner.location && partner.location.toLowerCase().includes(lowerCaseQuery))
  );

  const hasResults =
    filteredCategories.length > 0 || filteredPartners.length > 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">
        Search results for &quot;{query}&quot;
      </h1>

      {!hasResults && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No results found.</p>
          <p className="text-sm">
            Try searching for a different service or professional.
          </p>
        </div>
      )}

      {filteredCategories.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredCategories.map((category) => (
              <Link
                href={`/services/${category.id}`}
                key={category.id}
                className="group"
              >
                <Card className="overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <category.icon className="h-10 w-10 text-muted-foreground transition-colors group-hover:text-primary" />
                    <p className="mt-4 text-sm font-semibold text-center">
                      {category.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {filteredPartners.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Partners</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPartners.map((partner) => (
              <Card key={partner.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start gap-4">
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
                    <Badge
                      variant={
                        partner.status === 'available' ? 'default' : 'secondary'
                      }
                      className={`mt-2 ${
                        partner.status === 'available' ? 'bg-green-500' : ''
                      }`}
                    >
                      {partner.status.charAt(0).toUpperCase() +
                        partner.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Base price</span>
                    <span className="font-semibold text-foreground">
                      ${partner.price}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>Distance</span>
                    <span className="font-semibold text-foreground">
                      {partner.distance} km away
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/book/${partner.id}`}>Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}


export default function SearchPage() {
    return (
        <AppShell navItems={customerNavItems} userType="customer">
            <Suspense fallback={<div>Loading...</div>}>
                <SearchResults />
            </Suspense>
        </AppShell>
    );
}
