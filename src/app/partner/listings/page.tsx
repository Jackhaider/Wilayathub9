
import { AppShell } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { partnerNavItems } from "@/lib/data";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ListingsPage() {
  return (
    <AppShell navItems={partnerNavItems} userType="partner">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
            <Button asChild>
                <Link href="/partner/listings/new">Add New Listing</Link>
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Services & Products</CardTitle>
            <CardDescription>
              Manage your offerings that are visible to customers.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            <Package className="mx-auto h-12 w-12" />
            <p className="mt-4">You haven't added any listings yet.</p>
            <p className="text-xs">
                Click "Add New Listing" to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

    