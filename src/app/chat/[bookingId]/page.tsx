import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bookings, chatMessages, customerNavItems } from "@/lib/data";
import { ArrowLeft, Send, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatPage({ params }: { params: { bookingId: string } }) {
  const booking = bookings.find((b) => b.id === params.bookingId);

  if (!booking) {
    notFound();
  }

  const { partner } = booking;

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center h-16 px-4 border-b shrink-0">
        <Link href="/bookings" className="md:hidden">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex items-center gap-3 mx-auto md:mx-0">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={partner.avatarUrl} alt={partner.name} />
            <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <p className="font-semibold">{partner.name}</p>
            <p className="text-xs text-muted-foreground">
              {partner.status === "available" ? "Online" : "Busy"}
            </p>
          </div>
        </div>
        <div className="ml-auto">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === "partner" && (
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={partner.avatarUrl} alt={partner.name} />
                  <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-xs rounded-xl p-3 md:max-w-md",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
                <p className="mt-1 text-xs opacity-70">
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="p-4 border-t">
        <div className="relative">
          <Input
            placeholder="Type a message..."
            className="pr-12 rounded-full"
          />
          <Button
            type="submit"
            size="icon"
            className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full w-8 h-8"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </footer>
    </div>
  );
}
