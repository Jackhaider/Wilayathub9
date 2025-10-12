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

export default function PartnerProfilePage() {
  const userAvatar = getPlaceholderImage("avatar-1");
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
                  {userAvatar && <AvatarImage src={userAvatar.imageUrl} />}
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 234 567 890" />
                </div>
                 <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">About Me</Label>
                  <Textarea id="bio" placeholder="Tell us a little bit about yourself and your services" defaultValue="Experienced and certified electrician with over 10 years of experience in residential and commercial projects. I specialize in safe and efficient electrical solutions."/>
                </div>
              </div>
            </CardContent>
            <CardContent>
              <Button>Save Changes</Button>
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
                    <Button variant="destructive">Logout</Button>
                </CardContent>
            </Card>
         </div>
      </div>
    </AppShell>
  );
}
