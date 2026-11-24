'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { consumeIntentionalSignOut } from '@/firebase/auth-flow';

interface AuthGuardProps {
  children: ReactNode;
  /** 'partner' additionally requires a partners/{uid} profile document. */
  accountType?: 'customer' | 'partner';
}

/**
 * Partner pages a partner may use while their account is still pending approval.
 * Every other partner page (dashboard, jobs, earnings, enquiries, listings, and any
 * page added later) requires status === 'approved' - deny by default.
 */
const PENDING_PARTNER_PAGES = ['/partner/onboarding', '/partner/verification', '/partner/profile'];

function allowedWhilePending(pathname: string): boolean {
  return PENDING_PARTNER_PAGES.some((page) => pathname === page || pathname.startsWith(`${page}/`));
}

/**
 * Client-side route protection.
 *
 * Firebase Auth state lives in the browser (no session cookie), so a Next.js middleware
 * cannot verify it; this guard waits for onAuthStateChanged and then:
 *  - signed out                        -> /login?next=<current path>  (as=partner for partner pages)
 *  - partner page, no partner profile  -> /partner (partner landing / sign-up)
 *  - partner page, profile not approved -> /partner/verification (unless the page is allowed while pending)
 *
 * Data access is still enforced by firestore.rules; this guard controls what the UI shows.
 */
export function AuthGuard({ children, accountType = 'customer' }: AuthGuardProps) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  // For partner pages: which user passed the partner check, on which path. Both must match the
  // current values, so moving to another partner page OR the signed-in account changing
  // (e.g. a different sign-in in another tab, which Firebase syncs to this tab) hides the
  // content immediately and re-runs the check for the new user.
  const [partnerPassed, setPartnerPassed] = useState<{ uid: string; path: string } | null>(null);
  const partnerChecked =
    accountType !== 'partner' ||
    (!!user && partnerPassed?.uid === user.uid && partnerPassed.path === pathname);
  // Set when the partner profile could not be read (e.g. network error). Access stays denied,
  // but we must not wrongly treat a real partner as "not a partner".
  const [partnerCheckFailed, setPartnerCheckFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      // Deliberate logout: go to a clean login page, don't remember this page as ?next=.
      if (consumeIntentionalSignOut()) {
        router.replace('/login');
        return;
      }
      const params = new URLSearchParams();
      if (accountType === 'partner') params.set('as', 'partner');
      params.set('next', pathname);
      router.replace(`/login?${params.toString()}`);
      return;
    }

    if (accountType === 'partner') {
      let cancelled = false;
      setPartnerCheckFailed(false);
      getDoc(doc(firestore, 'partners', user.uid))
        .then((snap) => {
          if (cancelled) return;
          if (!snap.exists()) {
            router.replace('/partner');
            return;
          }
          const approved = snap.data().status === 'approved';
          if (approved || allowedWhilePending(pathname)) setPartnerPassed({ uid: user.uid, path: pathname });
          else router.replace('/partner/verification');
        })
        .catch(() => {
          // Could not verify (offline, transient error): fail closed and offer a retry
          // instead of redirecting a genuine partner to the partner sign-up page.
          if (!cancelled) setPartnerCheckFailed(true);
        });
      return () => {
        cancelled = true;
      };
    }
  }, [user, isUserLoading, accountType, firestore, router, pathname, retryCount]);

  if (partnerCheckFailed && !partnerChecked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-4 text-center" role="alert">
        <p className="font-medium">We couldn&apos;t verify your partner account.</p>
        <p className="text-sm text-muted-foreground">Check your connection and try again.</p>
        <button
          type="button"
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
          onClick={() => setRetryCount((n) => n + 1)}
        >
          Retry
        </button>
      </div>
    );
  }

  if (isUserLoading || !user || !partnerChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Checking your session…</span>
      </div>
    );
  }

  return <>{children}</>;
}
