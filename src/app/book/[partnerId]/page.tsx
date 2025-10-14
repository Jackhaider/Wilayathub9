
import { notFound } from "next/navigation";
import Image from "next/image";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { partners, customerNavItems } from "@/lib/data";
import { Clock, CreditCard, MapPin, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rating } from "@/components/rating";
import { Separator } from "@/components/ui/separator";

export default function BookingPage({
  params,
}: {
  params: { partnerId: string };
}) {
  const partner = partners.find((p) => p.id === params.partnerId);

  if (!partner) {
    notFound();
  }

  return (
    <AppShell navItems={customerNavItems} userType="customer">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                    <CardDescription>Select a date, time, and address for your service.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-8">
                    <div>
                        <Label className="text-lg font-medium mb-4 block">Select Date</Label>
                        <Calendar
                            mode="single"
                            selected={new Date()}
                            className="rounded-md border p-0"
                        />
                    </div>
                    <div>
                        <Label htmlFor="address" className="text-lg font-medium">Service Address</Label>
                        <div className="relative mt-2">
                             <Input id="address" defaultValue="123 Main St, Anytown, USA" className="pl-10" />
                             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                        </div>
                        <Button variant="link" className="p-0 h-auto mt-2">Auto-detect address</Button>
                    </div>
                     <div>
                        <Label className="text-lg font-medium">Select Time</Label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                            {['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'].map(time => (
                                <Button key={time} variant="outline">{time}</Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>Choose how you'd like to pay.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup defaultValue="card" className="grid gap-4">
                        <Label className="flex items-center gap-4 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                            <CreditCard className="h-6 w-6"/>
                            <div className="flex-1">
                                <p className="font-medium">Card</p>
                                <p className="text-sm text-muted-foreground">Pay with your credit or debit card.</p>
                            </div>
                            <RadioGroupItem value="card" />
                        </Label>
                         <Label className="flex items-center gap-4 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                            <Wallet className="h-6 w-6"/>
                            <div className="flex-1">
                                <p className="font-medium">Cash</p>
                                <p className="text-sm text-muted-foreground">Pay the partner directly in cash.</p>
                            </div>
                            <RadioGroupItem value="cash" />
                        </Label>
                    </RadioGroup>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
            <Card className="sticky top-24">
                 <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16 border">
                        <AvatarImage src={partner.avatarUrl} alt={partner.name} />
                        <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h3 className="font-bold">{partner.name}</h3>
                        <div className="flex items-center gap-1">
                           <Rating rating={partner.rating} size={16} />
                           <span className="text-xs text-muted-foreground">({partner.reviews} reviews)</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Separator/>
                     <h4 className="font-semibold">Booking Summary</h4>
                     <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">Service Fee</span>
                         <span>₹{partner.price.toFixed(2)}</span>
                     </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">Taxes & Fees</span>
                         <span>₹{(partner.price * 0.1).toFixed(2)}</span>
                     </div>
                     <Separator/>
                     <div className="flex justify-between font-bold">
                         <span>Total</span>
                         <span>₹{(partner.price * 1.1).toFixed(2)}</span>
                     </div>
                </CardContent>
                <CardContent>
                    <Button size="lg" className="w-full">
                        Confirm Booking
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}
