"use client";
import { useEffect, useState } from "react";
import { ShoppingCart, Package, Users, Database, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../StatCard";
import SalesChart from "../SalesChart";
import RecentOrdersTable from "../RecentOrderTable";
import TopSellingProducts from "../TopSellingProducts";

// Mock data for recent orders
const mockOrders = [
  {
    id: "ORD-5312",
    customer: "Apple Inc.",
    date: "May 10, 2025",
    amount: "$12,500.00",
    status: "delivered" as const,
  },
  {
    id: "ORD-4217",
    customer: "Microsoft Corp.",
    date: "May 09, 2025",
    amount: "$8,750.00",
    status: "shipped" as const,
  },
  {
    id: "ORD-3185",
    customer: "Amazon.com Inc.",
    date: "May 08, 2025",
    amount: "$6,320.00",
    status: "processing" as const,
  },
  {
    id: "ORD-2951",
    customer: "Tesla Motors",
    date: "May 07, 2025",
    amount: "$4,800.00",
    status: "pending" as const,
  },
  {
    id: "ORD-1823",
    customer: "Meta Platforms",
    date: "May 06, 2025",
    amount: "$3,200.00",
    status: "cancelled" as const,
  },
];

// Mock data for top selling products
const mockTopProducts = [
  {
    name: "Wireless Headphones Pro",
    category: "Electronics",
    sold: 1240,
    total: 1500,
    percentage: 83,
  },
  {
    name: 'Ultra HD Smart TV 55"',
    category: "Electronics",
    sold: 890,
    total: 1200,
    percentage: 74,
  },
  {
    name: "Premium Coffee Machine",
    category: "Home Appliances",
    sold: 650,
    total: 1000,
    percentage: 65,
  },
  {
    name: "Ergonomic Office Chair",
    category: "Furniture",
    sold: 520,
    total: 800,
    percentage: 65,
  },
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Sales"
          value="$89,542.98"
          change={{ value: 12.5, isPositive: true }}
          icon={ShoppingCart}
          iconColor="text-primary"
        />
        <StatCard
          title="Total Orders"
          value="1,485"
          change={{ value: 8.2, isPositive: true }}
          icon={Package}
          iconColor="text-purple-500"
        />
        <StatCard
          title="Total Customers"
          value="392"
          change={{ value: 4.6, isPositive: true }}
          icon={Users}
          iconColor="text-sky-500"
        />
        <StatCard
          title="Inventory Value"
          value="$245,890.56"
          change={{ value: 2.1, isPositive: false }}
          icon={Database}
          iconColor="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <SalesChart className="xl:col-span-2" />

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="bg-primary/10 p-2 rounded">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Order #{14582 + i}</div>
                  <div className="text-sm text-muted-foreground">
                    Due in {3 + i} days
                  </div>
                </div>
                <div className="font-medium">
                  ${(4500 + i * 1200).toLocaleString()}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-7 gap-6">
        <RecentOrdersTable className="xl:col-span-4" orders={mockOrders} />
        <TopSellingProducts
          className="xl:col-span-3"
          products={mockTopProducts}
        />
      </div>
    </div>
  );
};

export default Dashboard;
