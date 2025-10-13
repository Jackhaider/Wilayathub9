'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { AppShell } from '@/components/app-shell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { customerNavItems } from '@/lib/data';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      setPhone(user.phoneNumber || '');
      setPhotoURL(user.photoURL || getPlaceholderImage('avatar-4')?.imageUrl || '');
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
        // Firebase does not allow email/phone update directly via updateProfile
      });
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
      <AppShell navItems={customerNavItems} userType="customer">
        <div className="mx-auto grid w-full max-w-4xl gap-6">
          <h1 className="text-3xl font-semibold">My Profile</h1>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-10 w-28" />
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
              <CardContent>
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell navItems={customerNavItems} userType="customer">
      <div className="mx-auto grid w-full max-w-4xl gap-6">
        <h1 className="text-3xl font-semibold">My Profile</h1>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here.
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
