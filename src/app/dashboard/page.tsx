'use client';

import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { serviceCategories, customerNavItems } from "@/lib/data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { ArrowRight, MapPin } from "lucide-react";
import { useLocation } from "@/context/location-context";

export default function CustomerDashboard() {
  const { location } = useLocation();
  const promoImages = [
    getPlaceholderImage("promo-banner-1"),
    getPlaceholderImage("promo-banner-2"),
    getPlaceholderImage("promo-banner-3"),
  ];

  return (
    <AppShell navItems={customerNavItems} userType="customer">
      <div className="grid gap-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded-md">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{location ? location.address : 'Loading location...'}</span>
        </div>

        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {promoImages.map((img, index) =>
              img ? (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/1] w-full">
                        <Image
                          src={img.imageUrl}
                          alt={img.description}
                          fill
                          className="object-cover"
                          data-ai-hint={img.imageHint}
                        />
                         <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 md:p-8">
                            <h2 className="text-2xl md:text-4xl font-bold text-white">Get 20% off your first cleaning</h2>
                            <p className="text-white/80 mt-2">Use code FIRSTCLEAN at checkout.</p>
                            <Button asChild className="mt-4 w-fit">
                                <Link href="/services/cleaning">Book Now <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ) : null
            )}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4" />
          <CarouselNext className="absolute right-4" />
        </Carousel>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {serviceCategories.map((category) => (
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
          </CardContent>
        </Card>
      </div>
      <Button
        size="lg"
        className="fixed bottom-20 right-4 z-40 h-16 w-16 rounded-full shadow-2xl md:hidden"
      >
        <span className="text-xs font-bold">Quick Book</span>
      </Button>
    </AppShell>
  );
}
