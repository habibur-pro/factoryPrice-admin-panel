"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, LogOut, MessageCircle, Search, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import ChatPanel from "./chat/ChatPanel";
type TopBarProps = {
  title: string;
  className?: string;
};

const TopBar = ({ title, className }: TopBarProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const session = useSession();
  const user = session?.data?.user;
  console.log("user top bar", user);
  return (
    <header
      className={`flex items-center justify-between h-16 px-6 border-b bg-white ${className}`}
    >
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex relative w-64">
          <Input placeholder="Search..." className="pl-10" />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                5
              </Badge>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[90vw] max-w-6xl p-6">
            <SheetHeader className="mb-4">
              <SheetTitle>Customer Messages</SheetTitle>
              <SheetDescription>
                View and respond to customer inquiries
              </SheetDescription>
            </SheetHeader>
            <ChatPanel />
          </SheetContent>
        </Sheet>
        {/* notification  */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Notifications</span>
              <Button variant="ghost" size="sm">
                Mark all as read
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <DropdownMenuItem className="p-4 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">New Order Received</span>
                  <span className="text-sm text-muted-foreground">
                    Order #12345 from Apple Inc.
                  </span>
                  <span className="text-xs text-muted-foreground">
                    2 minutes ago
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-4 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Low Stock Alert</span>
                  <span className="text-sm text-muted-foreground">
                    Product SKU-789 is running low.
                  </span>
                  <span className="text-xs text-muted-foreground">
                    45 minutes ago
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-4 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Price Change Approved</span>
                  <span className="text-sm text-muted-foreground">
                    Bulk price update completed.
                  </span>
                  <span className="text-xs text-muted-foreground">
                    1 hour ago
                  </span>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-2 flex justify-center cursor-pointer">
              <span className="text-primary">View All Notifications</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                
                <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block font-medium text-sm">
                {user?.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
export default TopBar;
