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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bookings, customerNavItems, Booking } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, MapPin } from "lucide-react";
import { format } from "date-fns";

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
      </div>
       <Badge variant={booking.status === 'Completed' ? 'secondary' : 'default'} 
        className={booking.status === 'Active' ? 'bg-green-500' : booking.status === 'On the way' ? 'bg-blue-500' : ''}>
         {booking.status}
       </Badge>
    </CardHeader>
    <CardContent>
      <div className="text-sm text-muted-foreground">
        {format(booking.date, "eeee, MMMM d, yyyy 'at' h:mm a")}
      </div>
    </CardContent>
    <CardFooter className="gap-2">
      {booking.status !== "Completed" && booking.status !== "Cancelled" && (
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

export default function MyBookingsPage() {
  const activeBookings = bookings.filter(
    (b) => b.status !== "Completed" && b.status !== "Cancelled"
  );
  const completedBookings = bookings.filter(
    (b) => b.status === "Completed" || b.status === "Cancelled"
  );

  return (
    <AppShell navItems={customerNavItems} userType="customer">
      <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">History</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="space-y-4 mt-4">
            {activeBookings.length > 0 ? (
              activeBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <p>No active bookings.</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="space-y-4 mt-4">
            {completedBookings.length > 0 ? (
              completedBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <p>No past bookings.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
