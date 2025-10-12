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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { bookings, partnerNavItems } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getPlaceholderImage } from "@/lib/placeholder-images";


export default function PartnerDashboard() {
  const incomingRequests = bookings.filter((b) => b.status === "Requested");

  return (
    <AppShell navItems={partnerNavItems} userType="partner">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Switch id="online-status" defaultChecked />
            <Label htmlFor="online-status" className="font-semibold">
              Online
            </Label>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Incoming Job Requests</CardTitle>
            <CardDescription>
              You have {incomingRequests.length} new job requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {incomingRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage
                        src={getPlaceholderImage('avatar-4')?.imageUrl}
                        alt="Customer"
                      />
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">Customer Name</p>
                      <p className="text-sm text-muted-foreground">
                        {request.service.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-1" /> 2.5 km away
                  </div>
                  <div className="font-semibold text-lg">$50.00</div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="destructive" size="sm">
                      Reject
                    </Button>
                    <Button asChild size="sm">
                      <Link href={`/partner/job/${request.id}`}>Accept</Link>
                    </Button>
                  </div>
                </div>
                 <div className="text-xs text-muted-foreground mt-2 pl-16 sm:pl-0">
                    Requested {formatDistanceToNow(request.date, { addSuffix: true })}
                </div>
              </Card>
            ))}
            {incomingRequests.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No new requests right now.</p>
                    <p className="text-xs">You'll be notified when a new job comes in.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
