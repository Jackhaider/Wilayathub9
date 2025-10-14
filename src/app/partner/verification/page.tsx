
import { AppShell } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { partnerOnboardingNavItems } from "@/lib/data";
import { MailCheck } from "lucide-react";

export default function VerificationPage() {
  return (
    <AppShell navItems={partnerOnboardingNavItems} userType="partner">
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                <MailCheck className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="mt-4 text-2xl">Submission Received!</CardTitle>
            <CardDescription>
              Thank you for submitting your details. Your application is now
              under review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You will receive an email notification once your profile has been
              approved. This usually takes 1-2 business days. After approval,
              you will be able to access your partner dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
