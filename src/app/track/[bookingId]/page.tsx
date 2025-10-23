import Image from "next/image";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { customerNavItems, bookings } from "@/lib/data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Star } from "lucide-react";
import { Rating } from "@/components/rating";

export default function TrackingPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const booking = bookings.find((b) => b.id === params.bookingId);
  const mapImage = getPlaceholderImage("map-placeholder");

  if (!booking || !mapImage) {
    notFound();
  }

  const { partner } = booking;

  return (
    <div className="flex flex-col h-screen">
      <div className="relative flex-grow">
        <Image
          src={mapImage.imageUrl}
          alt={mapImage.description}
          layout="fill"
          objectFit="cover"
          data-ai-hint={mapImage.imageHint}
        />
    <div className="absolute top-4 left-4">
      <AppShell navItems={customerNavItems} userType="customer">{/* provide empty children */}<></></AppShell>
    </div>
      </div>
      <Card className="rounded-t-2xl -mt-4 z-10">
        <CardHeader className="text-center">
            <CardTitle>Arriving in 12 minutes</CardTitle>
            <CardDescription>Your partner is on the way.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border">
                    <AvatarImage src={partner.avatarUrl} alt={partner.name} />
                    <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3 className="font-bold">{partner.name}</h3>
                    <p className="text-sm text-muted-foreground">{booking.service.name}</p>
                    <div className="flex items-center gap-1">
                        <Rating rating={partner.rating} size={16}/>
                        <span className="text-xs text-muted-foreground">{partner.rating}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                        <Phone />
                    </Button>
                     <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                        <MessageSquare />
                    </Button>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button variant="destructive" className="w-full">Cancel Booking</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
