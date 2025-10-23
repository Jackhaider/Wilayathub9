"use client";

export const dynamic = 'force-dynamic';

// Firebase is dynamically imported on the client to avoid server-side initialization during static export
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleIcon } from '@/components/icons';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';

export default function AuthenticationPage() {
  const bgImage = getPlaceholderImage('auth-background');
  const router = useRouter();
  const [isPartnerFlow, setIsPartnerFlow] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        setIsPartnerFlow(params.get('as') === 'partner');
      } catch (e) {
        setIsPartnerFlow(false);
      }
    }
  }, []);
  const { toast } = useToast();

  // auth and firestore will be acquired dynamically when needed (client-only)

  const [loginEmail, setLoginEmail] = useState('test@example.com');
  const [loginPassword, setLoginPassword] = useState('password');
  const [signupName, setSignupName] = useState('Test User');
  const [signupEmail, setSignupEmail] = useState('test@example.com');
  const [signupPassword, setSignupPassword] = useState('password');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('password');

  const redirectPath = isPartnerFlow ? '/partner/dashboard' : '/dashboard';

  

  // ---------------- Login Function (Email/Password) ----------------
  // Replaces the test-mode redirect with a real Firebase email/password sign-in.
  // Dynamically imports firebase/auth and the client firebaseConfig to avoid SSR issues.
  const handleLogin = async () => {
    try {
      // Use the project's initializeFirebase helper so we get the same Firebase App
      // instance the rest of the app (FirebaseProvider) uses.
      const [{ getAuth, signInWithEmailAndPassword }, { initializeFirebase }] = await Promise.all([
        import('firebase/auth'),
        import('@/firebase'),
      ]);

      const sdks = initializeFirebase();
      const auth = getAuth(sdks.firebaseApp);

      // Use the non-blocking approach consistent with other code paths (the provider
      // listens for onAuthStateChanged). Call signInWithEmailAndPassword and allow
      // the auth listener to update app state.
      signInWithEmailAndPassword(auth, loginEmail, loginPassword);

      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });

      // Let onAuthStateChanged in FirebaseProvider pick up the user, then navigate.
      router.push(redirectPath);
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      const code = error?.code || 'unknown';
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: `${code}: ${error?.message || 'Unable to sign in.'}`,
      });
    }
  };

  // ---------------- Signup Function (Simplified for Testing) ----------------
  const handleCreateAccount = async () => {
     toast({
        title: 'Account Created! (Test Mode)',
        description: isPartnerFlow ? 'Redirecting to onboarding.' : 'Redirecting to dashboard.',
      });
      if (isPartnerFlow) {
        router.push('/partner/onboarding');
      } else {
        router.push('/dashboard');
      }
  };

  // ---------------- Google Login ----------------
  const handleGoogleLogin = async () => {
    try {
      // Dynamically import firebase modules on the client and use project initializer
      const [{ getAuth, GoogleAuthProvider, signInWithPopup }, { getFirestore, doc, setDoc, getDoc }, { initializeFirebase }] = await Promise.all([
        import('firebase/auth'),
        import('firebase/firestore'),
        import('@/firebase'),
      ]);

      const sdks = initializeFirebase();
      const auth = sdks.auth; // use the same auth instance the provider uses
      const firestore = sdks.firestore;

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (isPartnerFlow) {
        const partnerDocRef = doc(firestore, 'partners', user.uid);
        const partnerDoc = await getDoc(partnerDocRef);

        if (partnerDoc.exists()) {
          if (partnerDoc.data().status === 'approved') {
            router.push('/partner/dashboard');
          } else {
            router.push('/partner/verification');
          }
        } else {
          await setDoc(partnerDocRef, {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            role: 'partner',
            status: 'pending',
          });
          router.push('/partner/onboarding');
        }
      } else {
        const customerDocRef = doc(firestore, 'customers', user.uid);
        const customerDoc = await getDoc(customerDocRef);
        if (!customerDoc.exists()) {
          await setDoc(customerDocRef, {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            role: 'customer',
          });
        }
        router.push('/dashboard');
      }

      toast({
        title: 'Sign-In Successful!',
        description: 'Redirecting...',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message,
      });
    }
  };

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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email or Phone</Label>
                  <Input id="email-login" type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password-login">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">Forgot your password?</Link>
                  </div>
                  <Input id="password-login" type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
                <Button onClick={handleLogin} className="w-full">Login</Button>
                <Button variant="outline" onClick={handleGoogleLogin} className="w-full">
                  <GoogleIcon className="mr-2 h-4 w-4" /> Login with Google
                </Button>
              </CardContent>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{isPartnerFlow ? 'Partner Sign Up' : 'Create an Account'}</CardTitle>
                <CardDescription>Enter your information to create an account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
                <Input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                <Input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required />
                <Input type="password" placeholder="Confirm Password" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} required />
                <Button onClick={handleCreateAccount} className="w-full">Create Account</Button>
                <Button variant="outline" onClick={handleGoogleLogin} className="w-all">
                  <GoogleIcon className="mr-2 h-4 w-4" /> Sign up with Google
                </Button>
              </CardContent>
            </TabsContent>

          </Card>
        </Tabs>
      </div>
    </div>
  );
}
