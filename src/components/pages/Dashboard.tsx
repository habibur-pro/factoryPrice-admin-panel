"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import { useGetFullReportQuery } from "@/redux/api/reportApi";
import { IReport } from "@/types";
import { Order } from "@/types/schemas";
import { getSmartTimeAgo } from "@/utils/getSmartTimeAgo";
import { Calendar, Database, Package, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LoadingSkeletion from "../LoadingSkeletion";
import RecentOrdersTable from "../RecentOrderTable";
import SalesChart from "../SalesChart";
import StatCard from "../StatCard";

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
  const { data: ReportRes, isLoading } = useGetFullReportQuery("");
  const report: IReport = ReportRes?.data;

    const [pagination, setPagination] = useState({
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    });
    const [statusFilter, setStatusFilter] = useState("");
    const [searchId, setSearchId] = useState("");
    const { data: OrderRes } = useGetAllOrdersQuery(
      {
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter,
        id: searchId.trim(),
      },
      { refetchOnMountOrArgChange: true }
    );
    const orders: Order[] = OrderRes?.data?.data;

    console.log("order from dashboard", orders);
  if (isLoading || !report) {
    return (
      <div>
        <LoadingSkeletion
          itemWrapperClass="grid grid-cols-2 lg:grid-cols-4 gap-5"
          itemClass="h-20"
          length={4}
        />
        <LoadingSkeletion
          itemWrapperClass="grid grid-cols-1 lg:grid-cols-2 gap-5"
          itemClass="h-64"
          length={2}
        />
        <LoadingSkeletion
          itemWrapperClass="grid grid-cols-1 lg:grid-cols-2 gap-5"
          itemClass="h-64"
          length={2}
        />
      </div>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Sales"
          value={`$${report.totalSell.toLocaleString()}`}
          icon={ShoppingCart}
          iconColor="text-primary"
        />
        <StatCard
          title="Total Orders"
          value={report.totalOrders.toLocaleString()}
          icon={Package}
          iconColor="text-purple-500"
        />
        <StatCard
          title="Total Customers"
          value={report.totalCustomers.toLocaleString()}
          icon={Users}
          iconColor="text-sky-500"
        />
        <StatCard
          title="Inventory Value"
          value={`$${report.totalInventoryValue.toLocaleString()}`}
          icon={Database}
          iconColor="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <SalesChart charData={report.sellChart} className="xl:col-span-2" />

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 ">
            {report.recentPayments?.length > 0 &&
              report.recentPayments?.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">
                      Payment #
                      <Link
                        className=" underline"
                        href={`payments/${payment.id}`}
                      >
                        {payment.id}
                      </Link>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getSmartTimeAgo(payment.createdAt)}
                    </div>
                  </div>
                  <div className="font-medium">
                    ${payment.amount.toLocaleString()}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid grid-cols-1 xl:grid-cols-7 gap-6"> */}
      <div className="">
        <RecentOrdersTable className="xl:col-span-4" orders={orders} />
        {/* <TopSellingProducts
          className="xl:col-span-3"
          products={mockTopProducts}
        /> */}
      </div>
    </div>
  );
};

export default Dashboard;
