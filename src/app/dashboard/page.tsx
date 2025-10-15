
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
import { ArrowRight, ChevronDown, MapPin, Phone } from "lucide-react";
import { useLocation } from "@/context/location-context";
import { useState, useEffect } from "react";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const promotions = [
  {
    title: "COW GHEE",
    description: "Fresh stock of pure COW GHEE IS AVAILABLE NOW<br/>750/- per kg",
    cta: {
      text: "CONTACT NOW",
      href: "tel:9820209967"
    },
    image: getPlaceholderImage("promo-banner-1")
  },
  {
    title: "Special Offer from Asif Bhai & Team!",
    description: "Promote your business for just ₹99/- (Regular Price: ₹300/-)",
     cta: {
      text: "Contact Now",
      href: "#"
    },
    image: getPlaceholderImage("promo-banner-2")
  },
  {
    title: "KARWANE MASOOMEEN",
    description: "Ziyarat to Iran & Iraq on Yaum-e-Wiladat Imam Hussain (A.S) & Maula Abbas (A.S), Booking: ₹50,000 | Total: ₹1,30,000 | 22 Days (Jan 2026)",
    cta: {
      text: "Contact Now",
      href: "#"
    },
    image: getPlaceholderImage("promo-banner-3")
  },
   {
    title: "More Services Available",
    description: "Explore a wide range of professional services for your needs.",
     cta: {
      text: "View Categories",
      href: "/dashboard#categories"
    },
    image: getPlaceholderImage("promo-banner-1")
  },
]


export default function CustomerDashboard() {
  const { location } = useLocation();
  const [showAllCategories, setShowAllCategories] = useState(false);
  // const { user, isUserLoading } = useUser();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isUserLoading && !user) {
  //     router.push('/login');
  //   }
  // }, [user, isUserLoading, router]);

  const initialCategories = serviceCategories.slice(0, 8);
  const displayedCategories = showAllCategories ? serviceCategories : initialCategories;

  // if (isUserLoading || !user) {
  //   return (
  //     <AppShell navItems={customerNavItems} userType="customer">
  //       <div className="grid gap-8">
  //         <Skeleton className="h-10 w-full" />
  //         <Card>
  //           <CardContent className="p-0">
  //             <div className="relative aspect-[2/1] w-full">
  //               <Skeleton className="h-full w-full" />
  //             </div>
  //           </CardContent>
  //         </Card>
  //         <Card>
  //           <CardHeader>
  //             <Skeleton className="h-8 w-48" />
  //           </CardHeader>
  //           <CardContent>
  //             <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
  //               {[...Array(8)].map((_, i) => (
  //                 <Skeleton key={i} className="h-32 w-full" />
  //               ))}
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     </AppShell>
  //   );
  // }


  return (
    <AppShell navItems={customerNavItems} userType="customer">
      <div className="grid gap-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded-md">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{location ? location.address : 'Loading location...'}</span>
        </div>

        <Carousel className="w-full" opts={{ loop: true }}>
          <CarouselContent>
            {promotions.map((promo, index) =>
              promo.image ? (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-[2/1] w-full">
                        <Image
                          src={promo.image.imageUrl}
                          alt={promo.image.description}
                          fill
                          className="object-cover"
                          data-ai-hint={promo.image.imageHint}
                        />
                         <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 md:p-8">
                            <h2 className="text-2xl md:text-4xl font-bold text-white" dangerouslySetInnerHTML={{ __html: promo.title }}></h2>
                            <p className="text-white/80 mt-2" dangerouslySetInnerHTML={{ __html: promo.description }}></p>
                            <Button asChild className="mt-4 w-fit">
                                <a href={promo.cta.href}>{promo.cta.text}</a>
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

        <Card id="categories">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {displayedCategories.map((category) => (
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
             {!showAllCategories && serviceCategories.length > 8 && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllCategories(true)}
                >
                  See More
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            {showAllCategories && (
                 <div className="mt-6 flex justify-center">
                    <Button
                    variant="outline"
                    onClick={() => setShowAllCategories(false)}
                    >
                    See Less
                    </Button>
                </div>
            )}
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
