
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { AppShell } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { partnerOnboardingNavItems } from "@/lib/data";
import { AlertTriangle, Loader2, MailCheck, XCircle } from "lucide-react";
import { useFirestore, useUser } from '@/firebase';

type ReviewState =
  | { kind: 'loading' }
  | { kind: 'pending' }
  | { kind: 'approved' }
  | { kind: 'rejected' }
  | { kind: 'other'; status: string }
  | { kind: 'missing' }
  | { kind: 'error' };

/**
 * Watches the signed-in partner's profile in real time (no polling, no timers).
 * Only status === 'approved' leads to the dashboard; every other state stays here.
 * Rendered inside <AppShell>, whose AuthGuard has already confirmed a signed-in partner.
 */
function VerificationStatus() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [state, setState] = useState<ReviewState>({ kind: 'loading' });
  const [attempt, setAttempt] = useState(0); // bumped by "Try again" to re-subscribe
  const redirected = useRef(false);

  useEffect(() => {
    if (!user) return;
    setState({ kind: 'loading' });

    const unsubscribe = onSnapshot(
      doc(firestore, 'partners', user.uid),
      (snap) => {
        if (!snap.exists()) {
          // While offline Firestore can report "not found" from its (empty) local cache;
          // that means "can't tell", not "no application".
          setState(snap.metadata.fromCache ? { kind: 'error' } : { kind: 'missing' });
          return;
        }
        const status = snap.data().status;
        if (status === 'approved') {
          setState({ kind: 'approved' });
          if (!redirected.current) {
            redirected.current = true;
            router.replace('/partner/dashboard');
          }
        } else if (status === 'pending') {
          setState({ kind: 'pending' });
        } else if (status === 'rejected') {
          setState({ kind: 'rejected' });
        } else {
          setState({ kind: 'other', status: typeof status === 'string' && status ? status : 'unknown' });
        }
      },
      (error) => {
        // Fail safe: never grant access on an error, just explain and offer a retry.
        console.error('Could not read partner verification status:', error.code ?? error);
        setState({ kind: 'error' });
      },
    );

    return () => unsubscribe(); // stop listening when the page unmounts
  }, [user, firestore, router, attempt]);

  switch (state.kind) {
    case 'loading':
    case 'approved':
      return (
        <Card className="w-full max-w-md text-center">
          <CardContent className="flex flex-col items-center gap-3 py-10" role="status" aria-live="polite">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
            <p className="text-muted-foreground">
              {state.kind === 'approved' ? 'Approved! Opening your dashboard…' : 'Checking your application status…'}
            </p>
          </CardContent>
        </Card>
      );

    case 'pending':
      return (
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
            <p className="text-sm text-muted-foreground mt-4" role="status" aria-live="polite">
              Status: under review. This page updates automatically when a decision is made.
            </p>
          </CardContent>
        </Card>
      );

    case 'rejected':
      return (
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit">
                <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="mt-4 text-2xl">Application Not Approved</CardTitle>
            <CardDescription>
              Unfortunately your partner application was not approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you think this is a mistake or you have updated your documents,
              please contact WilayatHub support.
            </p>
          </CardContent>
        </Card>
      );

    case 'other':
    case 'missing':
      return (
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-muted p-4 rounded-full w-fit">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4 text-2xl">Account Under Review</CardTitle>
            <CardDescription>
              {state.kind === 'missing'
                ? 'We could not find your partner application.'
                : `Your partner account status is "${state.status}".`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Dashboard access is only available once your account is approved.
              Please contact WilayatHub support for help.
            </p>
          </CardContent>
        </Card>
      );

    case 'error':
      return (
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto bg-muted p-4 rounded-full w-fit">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4 text-2xl">Couldn&apos;t Check Your Status</CardTitle>
            <CardDescription>
              We couldn&apos;t load your application status. Check your connection and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setAttempt((n) => n + 1)}>Try again</Button>
          </CardContent>
        </Card>
      );
  }
}

export default function VerificationPage() {
  return (
    <AppShell navItems={partnerOnboardingNavItems} userType="partner">
      <div className="flex flex-col items-center justify-center h-full">
        <VerificationStatus />
      </div>
    </AppShell>
  );
}
