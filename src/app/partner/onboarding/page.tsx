
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

interface OnboardingData {
  fullName: string;
  businessName: string;
  contactNumber: string;
  serviceCategory: string;
  about: string;
  profilePhoto: string;
  idProof: string;
  shopPhoto: string;
  serviceArea: string;
  minPrice: string;
}

export default function PartnerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({});
  const { toast } = useToast();
  const router = useRouter();

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFileChange = (field: keyof OnboardingData, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleInputChange(field, file.name);
    }
  };

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

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://formspree.io/f/xyzdrded', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Submission Received!",
          description: "Your details have been sent for review. You will be notified upon approval.",
        });
        router.push('/partner/verification');
      } else {
        throw new Error('Failed to submit form.');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
      });
    }
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
                  <Input id="fullName" placeholder="e.g., John Doe" value={formData.fullName || ''} onChange={(e) => handleInputChange('fullName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business / Brand Name</Label>
                  <Input id="businessName" placeholder="e.g., John's Plumbing" value={formData.businessName || ''} onChange={(e) => handleInputChange('businessName', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" type="tel" placeholder="e.g., +91 1234567890" value={formData.contactNumber || ''} onChange={(e) => handleInputChange('contactNumber', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="serviceCategory">Service Category</Label>
                    <Select onValueChange={(value) => handleInputChange('serviceCategory', value)} value={formData.serviceCategory}>
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
                    value={formData.about || ''} 
                    onChange={(e) => handleInputChange('about', e.target.value)}
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
                    <Input id="profilePhoto" type="file" className="flex-1" onChange={(e) => handleFileChange('profilePhoto', e)} />
                    <Button variant="outline" size="icon"><UploadCloud/></Button>
                  </div>
                  {formData.profilePhoto && <p className="text-sm text-muted-foreground">File: {formData.profilePhoto}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="idProof">ID Proof (Aadhaar, PAN, etc.)</Label>
                   <div className="flex items-center gap-4">
                    <Input id="idProof" type="file" className="flex-1" onChange={(e) => handleFileChange('idProof', e)} />
                    <Button variant="outline" size="icon"><UploadCloud/></Button>
                  </div>
                  {formData.idProof && <p className="text-sm text-muted-foreground">File: {formData.idProof}</p>}
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="shopPhoto">Shop Photo (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <Input id="shopPhoto" type="file" className="flex-1" onChange={(e) => handleFileChange('shopPhoto', e)} />
                    <Button variant="outline" size="icon"><UploadCloud/></Button>
                  </div>
                   {formData.shopPhoto && <p className="text-sm text-muted-foreground">File: {formData.shopPhoto}</p>}
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
                    <Input id="serviceArea" placeholder="e.g., Mumbra, Thane" value={formData.serviceArea || ''} onChange={(e) => handleInputChange('serviceArea', e.target.value)}/>
                    <Button variant="outline">Auto-detect</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Minimum Service Price / Rate</Label>
                  <Input id="minPrice" type="number" placeholder="e.g., 500" value={formData.minPrice || ''} onChange={(e) => handleInputChange('minPrice', e.target.value)} />
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
