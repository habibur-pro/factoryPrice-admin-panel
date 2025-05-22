"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type Order = {
  id: string;
  customer: string;
  date: string;
  amount: string;
  items: number;
  status: OrderStatus;
};

const Orders = () => {
  // Mock order data
  const [orders] = useState<Order[]>([
    {
      id: "ORD-5312",
      customer: "Apple Inc.",
      date: "May 10, 2025",
      amount: "$12,500.00",
      items: 12,
      status: "delivered",
    },
    {
      id: "ORD-4217",
      customer: "Microsoft Corp.",
      date: "May 09, 2025",
      amount: "$8,750.00",
      items: 8,
      status: "shipped",
    },
    {
      id: "ORD-3185",
      customer: "Amazon.com Inc.",
      date: "May 08, 2025",
      amount: "$6,320.00",
      items: 5,
      status: "processing",
    },
    {
      id: "ORD-2951",
      customer: "Tesla Motors",
      date: "May 07, 2025",
      amount: "$4,800.00",
      items: 4,
      status: "pending",
    },
    {
      id: "ORD-2741",
      customer: "Google LLC",
      date: "May 07, 2025",
      amount: "$5,600.00",
      items: 6,
      status: "shipped",
    },
    {
      id: "ORD-2532",
      customer: "Facebook Inc.",
      date: "May 06, 2025",
      amount: "$3,900.00",
      items: 3,
      status: "delivered",
    },
    {
      id: "ORD-2175",
      customer: "Intel Corp.",
      date: "May 05, 2025",
      amount: "$7,300.00",
      items: 7,
      status: "processing",
    },
    {
      id: "ORD-1823",
      customer: "Meta Platforms",
      date: "May 04, 2025",
      amount: "$3,200.00",
      items: 2,
      status: "cancelled",
    },
  ]);

  const statusColors: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div title="Orders">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center w-full max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search orders..." className="pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[order.status]}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select defaultValue="view">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Details</SelectItem>
                        <SelectItem value="edit">Update Status</SelectItem>
                        <SelectItem value="invoice">
                          Generate Invoice
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
