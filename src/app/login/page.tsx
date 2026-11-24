"use client";

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { ensureProfileAndGetDestination, safeNextPath } from '@/firebase/auth-flow';
import { authErrorMessage } from '@/firebase/auth-errors';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6; // Firebase Auth's own minimum

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'confirm', string>>;

export default function AuthenticationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const [isPartnerFlow, setIsPartnerFlow] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPartnerFlow(params.get('as') === 'partner');
    setNextPath(safeNextPath(params.get('next')));
  }, []);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<FieldErrors>({});
  const [signupErrors, setSignupErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);

  /**
   * After Firebase has confirmed the user: create/read the profile document, then navigate.
   * If the profile cannot be written (e.g. rules reject it), sign the user out again so
   * they are not left half-registered.
   */
  const finishSignIn = async (user: User, displayName?: string) => {
    try {
      const destination = await ensureProfileAndGetDestination(
        firestore,
        user,
        isPartnerFlow ? 'partner' : 'customer',
        displayName,
      );
      // Honour ?next= only when it fits the account type the user signed in as.
      const next = nextPath && nextPath.startsWith('/partner') === isPartnerFlow ? nextPath : null;
      router.replace(next ?? destination);
    } catch (error) {
      await signOut(auth);
      throw error;
    }
  };

  // ---------------- Login (email/password) ----------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FieldErrors = {};
    if (!EMAIL_RE.test(loginEmail.trim())) errors.email = 'Enter a valid email address.';
    if (!loginPassword) errors.password = 'Enter your password.';
    setLoginErrors(errors);
    if (Object.keys(errors).length) return;

    setBusy(true);
    try {
      // Wait for Firebase to accept the credentials before showing success or navigating.
      const { user } = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      await finishSignIn(user);
      toast({ title: 'Logged in', description: 'Redirecting…' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Login failed', description: authErrorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  // ---------------- Sign up (email/password) ----------------
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FieldErrors = {};
    if (signupName.trim().length < 2) errors.name = 'Enter your name.';
    if (!EMAIL_RE.test(signupEmail.trim())) errors.email = 'Enter a valid email address.';
    if (signupPassword.length < MIN_PASSWORD) errors.password = `Use at least ${MIN_PASSWORD} characters.`;
    if (signupConfirmPassword !== signupPassword) errors.confirm = 'Passwords do not match.';
    setSignupErrors(errors);
    if (Object.keys(errors).length) return;

    setBusy(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, signupEmail.trim(), signupPassword);
      // The account now exists. Saving the display name on the Auth profile is best-effort:
      // the name is also written to the Firestore profile below, and failing here must not
      // leave the user signed in without a profile document.
      try {
        await updateProfile(user, { displayName: signupName.trim() });
      } catch (error) {
        console.warn('Could not save display name on the auth profile:', (error as { code?: string })?.code ?? error);
      }
      await finishSignIn(user, signupName.trim());
      toast({
        title: 'Account created',
        description: isPartnerFlow ? 'Next: tell us about your services.' : 'Welcome to WilayatHub!',
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Sign-up failed', description: authErrorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  // ---------------- Google ----------------
  const handleGoogleLogin = async () => {
    setBusy(true);
    try {
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
      await finishSignIn(user);
      toast({ title: 'Signed in with Google', description: 'Redirecting…' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Google sign-in failed', description: authErrorMessage(error) });
    } finally {
      setBusy(false);
    }
  };

  const fieldError = (msg?: string) => (msg ? <p className="text-sm text-destructive">{msg}</p> : null);

  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <Tabs defaultValue="login" className="w-full max-w-md">
          <Card className="shadow-2xl bg-card/80 backdrop-blur-lg border-primary/20">
            <div className="flex justify-center pt-6">
              <TabsList className="grid w-full max-w-xs grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </div>

            {/* Login Tab */}
            <TabsContent value="login">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{isPartnerFlow ? 'Partner Login' : 'Welcome Back'}</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} noValidate className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input id="email-login" type="email" autoComplete="email" required value={loginEmail}
                      aria-invalid={!!loginErrors.email} onChange={(e) => setLoginEmail(e.target.value)} />
                    {fieldError(loginErrors.email)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="password-login">Password</Label>
                      <Link href="#" className="ml-auto inline-block text-sm underline">Forgot your password?</Link>
                    </div>
                    <Input id="password-login" type="password" autoComplete="current-password" required value={loginPassword}
                      aria-invalid={!!loginErrors.password} onChange={(e) => setLoginPassword(e.target.value)} />
                    {fieldError(loginErrors.password)}
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Please wait…' : 'Login'}</Button>
                  <Button type="button" variant="outline" onClick={handleGoogleLogin} className="w-full" disabled={busy}>
                    <GoogleIcon className="mr-2 h-4 w-4" /> Login with Google
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{isPartnerFlow ? 'Partner Sign Up' : 'Create an Account'}</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAccount} noValidate className="space-y-4">
                  <div className="space-y-2">
                    <Input placeholder="Name" aria-label="Name" autoComplete="name" value={signupName}
                      aria-invalid={!!signupErrors.name} onChange={(e) => setSignupName(e.target.value)} required />
                    {fieldError(signupErrors.name)}
                  </div>
                  <div className="space-y-2">
                    <Input type="email" placeholder="Email" aria-label="Email" autoComplete="email" value={signupEmail}
                      aria-invalid={!!signupErrors.email} onChange={(e) => setSignupEmail(e.target.value)} required />
                    {fieldError(signupErrors.email)}
                  </div>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Password (min. 6 characters)" aria-label="Password" autoComplete="new-password"
                      value={signupPassword} aria-invalid={!!signupErrors.password} onChange={(e) => setSignupPassword(e.target.value)} required />
                    {fieldError(signupErrors.password)}
                  </div>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Confirm Password" aria-label="Confirm password" autoComplete="new-password"
                      value={signupConfirmPassword} aria-invalid={!!signupErrors.confirm} onChange={(e) => setSignupConfirmPassword(e.target.value)} required />
                    {fieldError(signupErrors.confirm)}
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Please wait…' : 'Create Account'}</Button>
                  <Button type="button" variant="outline" onClick={handleGoogleLogin} className="w-full" disabled={busy}>
                    <GoogleIcon className="mr-2 h-4 w-4" /> Sign up with Google
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

          </Card>
        </Tabs>
      </div>
    </div>
  );
}
