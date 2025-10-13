'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { AppShell } from "@/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { partnerNavItems } from "@/lib/data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';


export default function PartnerProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('Experienced and certified electrician with over 10 years of experience in residential and commercial projects. I specialize in safe and efficient electrical solutions.');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      setPhone(user.phoneNumber || '');
      setPhotoURL(user.photoURL || getPlaceholderImage('avatar-1')?.imageUrl || '');
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to save changes.',
      });
      return;
    }
    try {
      await updateProfile(user, {
        displayName: name,
      });
      // Here you would also save other fields like bio to your Firestore database
      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message,
      });
    }
  };

  if (isUserLoading) {
     return (
      <AppShell navItems={partnerNavItems} userType="partner">
        <div className="mx-auto grid w-full max-w-4xl gap-6">
          <h1 className="text-3xl font-semibold">My Profile</h1>
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-10 w-28" />
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell navItems={partnerNavItems} userType="partner">
      <div className="mx-auto grid w-full max-w-4xl gap-6">
        <h1 className="text-3xl font-semibold">My Profile</h1>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border">
                  {photoURL && <AvatarImage src={photoURL} alt={name} />}
                  <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Add phone number" />
                </div>
                 <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">About Me</Label>
                  <Textarea id="bio" placeholder="Tell us a little bit about yourself and your services" value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
              </div>
            </CardContent>
            <CardContent>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
         <div>
            <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                      Manage your availability and notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                          <Label htmlFor="online-status-profile">Online Status</Label>
                          <p className="text-sm text-muted-foreground">
                              Set your availability for receiving new job requests.
                          </p>
                      </div>
                      <Switch id="online-status-profile" defaultChecked />
                  </div>
                   <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                          <Label htmlFor="notifications-profile">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                              Receive notifications for new jobs and messages.
                          </p>
                      </div>
                      <Switch id="notifications-profile" defaultChecked />
                  </div>
                </CardContent>
            </Card>
         </div>
         <div>
            <Card>
                <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                    Manage your account settings.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                </CardContent>
            </Card>
         </div>
      </div>
    </AppShell>
  );
}
