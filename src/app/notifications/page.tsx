'use client';

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
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser"; // ✅ use custom hook for test user

const notifications = [
  {
    id: 1,
    title: "Ziyarat Karbala – Jan 2026",
    message: "Limited seats available! Contact 9936318612",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 2,
    title: "Fresh Tabarukh Available",
    message: "Get yours before stock runs out. Order now: Call 9820209967",
    time: "3 hours ago",
    read: false,
  },
];

export default function NotificationsPage() {
  const { user, isUserLoading } = useUser(); // ✅ test user

  if (isUserLoading) {
    return (
      <AppShell navItems={customerNavItems} userType="customer">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Skeleton className="h-9 w-40" />
        </div>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {[...Array(2)].map((_, i) => (
                <li key={i} className="flex items-start gap-4 p-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-2.5 w-2.5 rounded-full" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

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
                  <div className="h-2.5 w-2.5 rounded-full bg-primary mt-1"></div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {notifications.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Bell className="mx-auto h-12 w-12" />
          <p className="mt-4">No notifications yet.</p>
          <p className="text-xs">
            We'll let you know when something important happens.
          </p>
        </div>
      )}
    </AppShell>
  );
}
