import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WilayatHubLogo } from "@/components/icons";

export default function SplashPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-0 bg-transparent shadow-none sm:border sm:shadow-lg">
        <CardContent className="flex flex-col items-center justify-center p-6 sm:p-12">
          <WilayatHubLogo className="mb-4 h-16 w-16 text-primary" />
          <h1 className="text-4xl font-bold tracking-tighter text-primary">
            WilayatHub
          </h1>
          <p className="mt-2 text-muted-foreground">All Services. One Hub.</p>

          <div className="mt-12 w-full space-y-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/dashboard">Continue as Customer</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full">
              <Link href="/partner/dashboard">Continue as Partner</Link>
            </Button>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="#" className="underline hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
