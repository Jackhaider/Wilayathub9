
'use client';

import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { partnerOnboardingNavItems, serviceCategories } from '@/lib/data';
import { UploadCloud, ArrowRight, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function PartnerOnboardingPage() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Onboarding Complete!",
      description: "Your partner profile has been created. Redirecting to your dashboard.",
    });
    router.push('/partner/dashboard');
  }

  const progressValue = (step / 3) * 100;

  return (
    <AppShell navItems={partnerOnboardingNavItems} userType="partner">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Partner Onboarding</h1>
          <p className="text-muted-foreground">
            Complete your profile to start connecting with customers.
          </p>
        </div>
        
        <Progress value={progressValue} className="w-full" />

        <Card>
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>Step 1: Business Information</CardTitle>
                <CardDescription>
                  Tell us about yourself and your business.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="e.g., John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business / Brand Name</Label>
                  <Input id="businessName" placeholder="e.g., John's Plumbing" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="serviceCategory">Service Category</Label>
                    <Select>
                        <SelectTrigger id="serviceCategory">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {serviceCategories.map(category => (
                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about">Description / About</Label>
                  <Textarea
                    id="about"
                    placeholder="Describe your services, experience, and what makes your business unique."
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>Step 2: Documentation (KYC)</CardTitle>
                <CardDescription>
                  Upload your documents for verification.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto">Profile Photo or Business Logo</Label>
                  <div className="flex items-center gap-4">
                    <Input id="profilePhoto" type="file" className="flex-1" />
                    <Button variant="outline" size="icon"><UploadCloud/></Button>
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="idProof">ID Proof (Aadhaar, PAN, etc.)</Label>
                   <div className="flex items-center gap-4">
                    <Input id="idProof" type="file" className="flex-1" />
                    <Button variant="outline" size="icon"><UploadCloud/></Button>
                  </div>
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="shopPhoto">Shop Photo (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <Input id="shopPhoto" type="file" className="flex-1" />
                    <Button variant="outline" size="icon"><UploadCloud/></Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>Step 3: Service Details</CardTitle>
                <CardDescription>
                  Set your location and pricing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceArea">Service Area</Label>
                  <div className="flex items-center gap-2">
                    <Input id="serviceArea" placeholder="e.g., Mumbra, Thane" />
                    <Button variant="outline">Auto-detect</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Minimum Service Price / Rate</Label>
                  <Input id="minPrice" type="number" placeholder="e.g., 500" />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleSubmit}>Submit for Review</Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
