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

const Dashboard = () => {
  const { data: ReportRes, isLoading } = useGetFullReportQuery("");
  const report: IReport = ReportRes?.data;
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
        {report?.recentOrders?.length > 0 && (
          <RecentOrdersTable
            className="xl:col-span-4"
            orders={report.recentOrders}
          />
        )}
        {/* <TopSellingProducts
          className="xl:col-span-3"
          products={mockTopProducts}
        /> */}
      </div>
    </div>
  );
};

export default Dashboard;
