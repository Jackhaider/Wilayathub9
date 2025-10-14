
import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { partners, serviceCategories, customerNavItems } from "@/lib/data";
import { notFound } from "next/navigation";
import { Filter, Star, Phone } from "lucide-react";
import { Rating } from "@/components/rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ServiceListPage({
  params,
}: {
  params: { category: string };
}) {
  const category = serviceCategories.find((c) => c.id === params.category);
  if (!category) {
    notFound();
  }

  const categoryPartners = partners.filter((p) => p.service === category.id);

  return (
    <AppShell navItems={customerNavItems} userType="customer">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {category.name}s near you
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Sort & Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
            <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
            <DropdownMenuItem>Rating</DropdownMenuItem>
            <DropdownMenuItem>Distance</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categoryPartners.map((partner) => (
          <Card key={partner.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4">
                <Avatar className="h-16 w-16 border">
                    <AvatarImage src={partner.avatarUrl} alt={partner.name} />
                    <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle>{partner.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                        <Rating rating={partner.rating} size={16} />
                        <span className="text-sm text-muted-foreground">{partner.rating} ({partner.reviews} reviews)</span>
                    </div>
                    <Badge variant={partner.status === 'available' ? 'default': 'secondary'} className={`mt-2 ${partner.status === 'available' ? 'bg-green-500' : ''}`}>
                        {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Base price</span>
                <span className="font-semibold text-foreground">₹{partner.price}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>Distance</span>
                <span className="font-semibold text-foreground">{partner.distance} km away</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <a href={`tel:${partner.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Now
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {categoryPartners.length === 0 && (
          <Card className="col-span-full flex flex-col items-center justify-center py-12">
            <CardHeader>
                <CardTitle>No {category.name}s Found</CardTitle>
                <CardDescription>Try adjusting your filters or check back later.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button>View All Categories</Button>
            </CardContent>
          </Card>
      )}
    </AppShell>
  );
}
