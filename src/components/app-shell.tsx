
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, User, Home, Calendar, Bell, DollarSign, Briefcase } from "lucide-react";
import type { NavItem } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WilayatHubLogo } from "./icons";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppShellProps {
  navItems: NavItem[];
  children: React.ReactNode;
  userType: "customer" | "partner";
}

const iconComponents: { [key: string]: React.ElementType } = {
  Home,
  Calendar,
  Bell,
  User,
  DollarSign,
  Briefcase,
};

export function AppShell({ navItems, children, userType }: AppShellProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const header = (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href={userType === 'customer' ? "/dashboard" : "/partner/dashboard"}
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <WilayatHubLogo className="h-7 w-7" />
          <span className="sr-only">WilayatHub</span>
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <nav className="grid gap-4 text-lg font-medium p-6">
            <Link
              href={userType === 'customer' ? "/dashboard" : "/partner/dashboard"}
              className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
              <WilayatHubLogo className="h-8 w-8" />
              <span className="">WilayatHub</span>
            </Link>
            {navItems.map((item) => {
              const Icon = iconComponents[item.iconName];
              if (!Icon) return null;
              return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-3 py-2 transition-colors hover:text-foreground",
                  pathname === item.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )})}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form onSubmit={handleSearch} className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        <Button asChild variant="secondary" size="icon" className="rounded-full">
          <Link href={userType === 'customer' ? "/profile" : "/partner/profile"}>
            <User className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Link>
        </Button>
      </div>
    </header>
  );

  const bottomNav = (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background md:hidden">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
            {navItems.map((item) => {
                const Icon = iconComponents[item.iconName];
                if (!Icon) return null;
                return (
                <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                        "inline-flex flex-col items-center justify-center px-5 hover:bg-muted",
                        pathname === item.href ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-xs">{item.label}</span>
                </Link>
            )})}
        </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      {header}
      <main className="flex flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-8 pb-20 md:pb-8">
        {children}
      </main>
      {isMobile && bottomNav}
    </div>
  );
}
