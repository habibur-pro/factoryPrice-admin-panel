"use client";
import React, { useState } from "react";
import logo from "../../public/images/logo-full.png";
// import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Archive,
  Users,
  // BarChart2,
  // Mail,
  ChevronRight,
  ChevronLeft,
  LogOut,
  CreditCard,
  MessageCircle,
  FileQuestion,
  BadgePercent,
  Shield,
  Lock,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch } from "@/redux/hook";
import { toggleChatModal } from "@/redux/features/chat/chatSlice";
import { usePathname } from "next/navigation"; // ✅ for active tab detection
import { useSession } from "next-auth/react";
import { UserRole } from "@/enum";
import { rolePermissions } from "@/const";

type NavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Package, label: "Products", path: "/products" },
  { icon: ShoppingCart, label: "Orders", path: "/orders" },
  { icon: BadgePercent, label: "Discount", path: "/discount" },
  // { icon: Users, label: "Customers", path: "/customers" },
  { icon: CreditCard, label: "Payments", path: "/payments" },
  // { icon: Archive, label: "Inventory", path: "/inventory" },
  { icon: FileQuestion, label: "New Leads", path: "/query" },
  {
    icon: Shield,
    label: "Permission Management",
    path: "/permission-management",
  },
  { icon: Lock, label: "Change Password", path: "/change-password" },
  { icon: Globe, label: "Countries", path: "/countries" },
  // { icon: BarChart2, label: "Sales Reports", path: "/reports" },
  // { icon: Mail, label: "Email Campaigns", path: "/email-campaigns" },
];

type AdminSidebarProps = {
  className?: string;
};

const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname(); // ✅ Get current route
  const dispatch = useAppDispatch();
  const session = useSession();
  const role = session?.data?.user?.role as UserRole;

  const allowedPaths = rolePermissions[role];
  const filterNav = navItems?.filter((item) =>
    allowedPaths?.includes(item.path)
  );
  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[250px]",
        className
      )}
    >
      <div
        className={cn(
          "flex justify-center w-full  items-center p-4 h-16",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <div className="font-bold text-xl text-primary pt-3">
            <Image width={120} alt="logo" src={logo} />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-full"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {filterNav.map((item) => {
            const isActive = pathname === item.path; // ✅ check active
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center p-2 rounded-md transition-all group",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-blue-600 text-white shadow" // ✅ active tab style
                    : "hover:bg-primary/10 hover:text-primary text-gray-700"
                )}
              >
                <item.icon
                  className={cn("w-5 h-5", collapsed ? "mx-auto" : "mr-3")}
                />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
          <button
            onClick={() => dispatch(toggleChatModal())}
            className="flex items-center p-2 rounded-md hover:bg-primary/10 text-gray-700 hover:text-primary transition-all group cursor-pointer w-full"
          >
            <MessageCircle
              className={cn("w-5 h-5", collapsed ? "mx-auto" : "mr-3")}
            />
            Chats
          </button>
        </nav>
      </div>

      <div
        className={cn("p-4 border-t", collapsed ? "flex justify-center" : "")}
      >
        <Button
          variant="outline"
          className={cn(
            "flex items-center",
            collapsed ? "w-10 justify-center" : "w-full justify-start"
          )}
        >
          <LogOut className={cn("w-4 h-4", collapsed ? "" : "mr-2")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};
export default AdminSidebar;
