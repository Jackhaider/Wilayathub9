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
import { customerNavItems } from "@/lib/data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const userAvatar = getPlaceholderImage("avatar-4");
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
                  {userAvatar && <AvatarImage src={userAvatar.imageUrl} />}
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="jane.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 234 567 890" />
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
