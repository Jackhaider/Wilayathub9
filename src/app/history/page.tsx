'use client';

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { bookings, customerNavItems, Booking } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, MessageSquare, MapPin, Star } from "lucide-react";
import { format } from "date-fns";
import { Rating } from "@/components/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser"; // ✅ Updated import path

const BookingCard = ({ booking }: { booking: Booking }) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar className="h-12 w-12 border">
        <AvatarImage src={booking.partner.avatarUrl} alt={booking.partner.name} />
        <AvatarFallback>{booking.partner.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <CardTitle className="text-base">{booking.service.name}</CardTitle>
        <CardDescription>with {booking.partner.name}</CardDescription>
        <div className="flex items-center gap-1">
          <Rating rating={booking.partner.rating} size={16} />
          <span className="text-xs text-muted-foreground">{booking.partner.rating}</span>
        </div>
      </div>
      <Badge
        variant={booking.status === 'Completed' ? 'secondary' : 'default'}
        className={booking.status === 'Active' ? 'bg-green-500' : ''}
      >
        {booking.status}
      </Badge>
    </CardHeader>

    <CardContent>
      <div className="text-sm text-muted-foreground">
        {format(booking.date, "eeee, MMMM d, yyyy 'at' h:mm a")}
      </div>
      {booking.rating && (
        <div className="flex items-center gap-2 mt-2">
          <p className="text-sm font-medium">Your Rating:</p>
          <Rating rating={booking.rating} size={16} />
        </div>
      )}
    </CardContent>

    <CardFooter className="gap-2">
      {booking.status === "Completed" || booking.status === "Cancelled" ? (
        <>
          <Button asChild variant="outline" size="sm">
            <a href={`tel:${booking.partner.phone}`}>
              <Phone className="mr-2 h-4 w-4" /> Contact Again
            </a>
          </Button>
          {booking.status === "Completed" && (
            <Button variant="outline" size="sm">
              <Star className="mr-2 h-4 w-4" /> {booking.rating ? 'Edit Rating' : 'Rate'}
            </Button>
          )}
        </>
      ) : (
        <>
          <Button asChild variant="outline" size="sm">
            <Link href={`/track/${booking.id}`}>
              <MapPin className="mr-2 h-4 w-4" /> Track
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/chat/${booking.id}`}>
              <MessageSquare className="mr-2 h-4 w-4" /> Chat
            </Link>
          </Button>
        </>
      )}
      {(booking.status === "Requested" || booking.status === "Active") && (
        <Button variant="destructive" size="sm">Cancel</Button>
      )}
    </CardFooter>
  </Card>
);

export default function HistoryPage() {
  const { user, isUserLoading } = useUser(); // ✅ Always returns test user

  if (isUserLoading) {
    return (
      <AppShell navItems={customerNavItems} userType="customer">
        <h1 className="text-3xl font-bold tracking-tight">My History</h1>
        <div className="space-y-4 mt-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
              <CardFooter className="gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell navItems={customerNavItems} userType="customer">
      <h1 className="text-3xl font-bold tracking-tight">My History</h1>
      <div className="space-y-4 mt-4">
        {bookings.length > 0 ? (
          [...bookings]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
        ) : (
          <p>No history found.</p>
        )}
      </div>
    </AppShell>
  );
}
