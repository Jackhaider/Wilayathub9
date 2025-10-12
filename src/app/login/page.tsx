'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function AuthenticationPage() {
  const bgImage = getPlaceholderImage("auth-background");
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      });
      router.push("/dashboard");
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
      await sendEmailVerification(userCredential.user);
      toast({
        title: "Account Created!",
        description: "A verification email has been sent. Please check your inbox.",
      });
      // Optionally, you can redirect the user to a page that tells them to verify their email.
      // For now, we'll redirect to the login page.
      // router.push("/verify-email");
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
      await signInWithPopup(auth, provider);
      toast({
        title: "Signing in with Google...",
      });
      router.push("/dashboard");
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
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
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
                <CardTitle className="text-2xl">Create an Account</CardTitle>
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
