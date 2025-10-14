
import { AppShell } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { partnerNavItems } from "@/lib/data";
import { MessageSquare } from "lucide-react";

export default function EnquiriesPage() {
  return (
    <AppShell navItems={partnerNavItems} userType="partner">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Enquiries</h1>
        <Card>
          <CardHeader>
            <CardTitle>Customer Messages</CardTitle>
            <CardDescription>
              This is where you'll see messages from your customers.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12 text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12" />
            <p className="mt-4">No enquiries yet.</p>
            <p className="text-xs">
              New messages from customers will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

    