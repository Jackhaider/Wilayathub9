import Image from "next/image";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { bookings, partnerNavItems } from "@/lib/data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, MessageSquare, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ActiveJobPage({
  params,
}: {
  params: { jobId: string };
}) {
  const job = bookings.find((b) => b.id === params.jobId);
  const mapImage = getPlaceholderImage("map-placeholder");

  if (!job || !mapImage) {
    notFound();
  }

  return (
    <AppShell navItems={partnerNavItems} userType="partner">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Job</CardTitle>
              <CardDescription>
                Details for your current service booking.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage
                    src={getPlaceholderImage("avatar-4")?.imageUrl}
                  />
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold">Customer Name</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="mr-2 h-4 w-4" /> Call
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" /> Chat
                    </Button>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Address</h4>
                <p className="text-muted-foreground flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 shrink-0" />
                  123 Main St, Anytown, USA, 12345
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Service</h4>
                <p className="text-muted-foreground">{job.service.name}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Job Status</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button>Start Journey</Button>
              <Button variant="outline">Arrived</Button>
              <Button variant="outline">Start Work</Button>
              <Button variant="outline">Completed</Button>
            </CardContent>
          </Card>
        </div>
        <div className="min-h-[400px] md:min-h-0">
          <Card className="h-full">
            <CardContent className="p-0 h-full rounded-lg overflow-hidden">
              <Image
                src={mapImage.imageUrl}
                alt={mapImage.description}
                width={800}
                height={600}
                className="w-full h-full object-cover"
                data-ai-hint={mapImage.imageHint}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
