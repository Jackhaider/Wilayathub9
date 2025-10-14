'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleIcon, WilayatHubLogo } from "@/components/icons";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function AuthenticationPage() {
  const bgImage = getPlaceholderImage("auth-background");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  
  const isPartnerFlow = searchParams.get('as') === 'partner';
  const redirectPath = isPartnerFlow ? "/partner/dashboard" : "/dashboard";

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      
      if (isPartnerFlow) {
        const partnerDocRef = doc(firestore, "partners", userCredential.user.uid);
        const partnerDoc = await getDoc(partnerDocRef);
        if (partnerDoc.exists() && partnerDoc.data().status === 'approved') {
          router.push('/partner/dashboard');
        } else {
           router.push('/partner/verification');
        }
      } else {
        router.push('/dashboard');
      }

      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    }
  };

  const handleCreateAccount = async () => {
    if (signupPassword !== signupConfirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please check your password and try again.",
      });
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;

      if (isPartnerFlow) {
        await setDoc(doc(firestore, "partners", user.uid), { 
          uid: user.uid,
          email: user.email,
          name: signupName,
          role: "partner",
          status: "pending" 
        });
        toast({
            title: "Account Created!",
            description: "Please complete your profile to continue.",
        });
        router.push('/partner/onboarding');
      } else {
        await setDoc(doc(firestore, "customers", user.uid), { 
          uid: user.uid,
          email: user.email,
          name: signupName,
          role: "customer"
        });
        await sendEmailVerification(user);
        toast({
            title: "Account Created!",
            description: "A verification email has been sent. Please check your inbox.",
        });
      }
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Account Creation Failed",
        description: error.message,
      });
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (isPartnerFlow) {
        const partnerDocRef = doc(firestore, "partners", user.uid);
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
             role: "partner",
             status: "pending"
           });
           router.push('/partner/onboarding');
        }
      } else {
         const customerDocRef = doc(firestore, "customers", user.uid);
         const customerDoc = await getDoc(customerDocRef);
         if (!customerDoc.exists()) {
              await setDoc(customerDocRef, {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                role: "customer"
              });
         }
        router.push('/dashboard');
      }
       toast({
        title: "Sign-In Successful!",
        description: "Redirecting...",
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message,
      });
    }
  }

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

            <TabsContent value="login">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{isPartnerFlow ? "Partner Login" : "Welcome Back"}</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email or Phone</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password-login">Password</Label>
                    <Link
                      href="#"
                      className="ml-auto inline-block text-sm underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input 
                    id="password-login" 
                    type="password" 
                    required 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleLogin} className="w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Login with Google
                </Button>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{isPartnerFlow ? "Partner Sign Up" : "Create an Account"}</CardTitle>
                <CardDescription>
                  Enter your information to create an account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-signup">Name</Label>
                  <Input 
                    id="name-signup" 
                    placeholder="Max Robinson" 
                    required 
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email or Phone</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input 
                    id="password-signup" 
                    type="password" 
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password-signup">Confirm Password</Label>
                  <Input 
                    id="confirm-password-signup" 
                    type="password" 
                    required 
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateAccount} className="w-full">
                  Create Account
                </Button>
                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Sign up with Google
                </Button>
              </CardContent>
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
