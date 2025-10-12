import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, CheckCheck } from "lucide-react";
import { customerNavItems } from "@/lib/data";

const notifications = [
  {
    id: 1,
    title: "Booking Confirmed",
    message: "Your booking with John Doe for plumbing is confirmed for Aug 15.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Partner Arrived",
    message: "Mike Johnson has arrived at your location.",
    time: "1 day ago",
    read: true,
  },
  {
    id: 3,
    title: "Payment Successful",
    message: "Your payment of $60 for cleaning service was successful.",
    time: "3 days ago",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <AppShell navItems={customerNavItems} userType="customer">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="ghost" size="sm">
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`flex items-start gap-4 p-4 ${
                  !notification.read ? "bg-muted/50" : ""
                }`}
              >
                <div className="rounded-full bg-primary/10 p-2">
                    <Bell className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2.5 w-2.5 rounded-full bg-accent mt-1"></div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {notifications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
              <Bell className="mx-auto h-12 w-12"/>
              <p className="mt-4">No notifications yet.</p>
              <p className="text-xs">We'll let you know when something important happens.</p>
          </div>
      )}
    </AppShell>
  );
}
