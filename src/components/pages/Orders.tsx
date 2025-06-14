"use client";
import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import DataTable, { Column } from "@/components/DataTable";
import { Order } from "@/types/schemas";
import Link from "next/link";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const Orders: React.FC = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [searchId, setSearchId] = useState("");
  const { data: OrderRes, isLoading } = useGetAllOrdersQuery(
    {
      page: pagination.page,
      limit: pagination.limit,
      status: statusFilter,
      id: searchId.trim(),
    },
    { refetchOnMountOrArgChange: true }
  );
  const orders: Order[] = OrderRes?.data?.data;

  useEffect(() => {
    if (OrderRes?.data?.pagination) {
      setPagination(OrderRes.data.pagination);
    }
  }, [OrderRes]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [statusFilter]);

  const columns: Column<Order>[] = [
    {
      key: "id",
      label: "Order ID",
      render: (value) => (
        <span className="font-mono text-xs text-gray-600">{value}</span>
      ),
    },
    {
      key: "orderName",
      label: "Order Name",
      sortable: true,
      render: (value, order) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </div>
        </div>
      ),
    },
    {
      key: "user",
      label: "Customer",
      render: (value, order) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {value ? `${value.firstName} ${value.lastName}` : "N/A"}
          </div>
          <div className="text-gray-500 text-xs">
            {value?.email || order.userId}
          </div>
        </div>
      ),
    },
    {
      key: "total",
      label: "Total Amount",
      render: (value, order) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">${value.toFixed(2)}</div>
          <div className="text-gray-500 text-xs">
            Subtotal: ${order.subtotal.toFixed(2)}
          </div>
          {order.discount > 0 && (
            <div className="text-red-500 text-xs">
              Discount: -${order.discount.toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Order Status",
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "delivered"
              ? "bg-green-100 text-green-800"
              : value === "shipped"
              ? "bg-blue-100 text-blue-800"
              : value === "cancelled"
              ? "bg-red-100 text-red-800"
              : value === "processing"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (value, order) => (
        <div className="text-sm">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              value === "completed"
                ? "bg-green-100 text-green-800"
                : value === "failed"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {value}
          </span>
          {order.payment && (
            <div className="text-gray-500 text-xs mt-1">
              {order.payment.method}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Order Date",
      render: (value) => (
        <div className="text-sm">
          <div>{new Date(value).toLocaleDateString()}</div>
          <div className="text-gray-500 text-xs">
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, order) => (
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Link>
      ),
    },
  ];

  const filters = (
    <>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </>
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">
            Manage customer orders and track status
          </p>
        </div>
        <div className="mb-6">
          <Button
            className="cursor-pointer"
            onClick={() => router.push("/orders/create-order")}
          >
            Create Custom Order
          </Button>
        </div>
      </div>

      <DataTable
        data={orders}
        columns={columns}
        filters={filters}
        searchValue={searchId}
        onSearch={(value) => setSearchId(value)}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Orders;
