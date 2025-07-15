"use client";
import React, { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/DataTable";
import { Order } from "@/types/schemas";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useGetAllPaymentQuery } from "@/redux/api/paymentApi";
import { IPayment } from "@/types";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useGetSessionsQuery } from "@/redux/api/chatSessionApi";

const Query: React.FC = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [searchId, setSearchId] = useState("");
  const { data: queryRes, isLoading } = useGetSessionsQuery(
    {
      page: pagination.page,
      limit: pagination.limit,
      status: statusFilter,
      id: searchId.trim(),
    },
    { refetchOnMountOrArgChange: true }
  );
  const queries = queryRes?.data;

  console.log("queries from admin", queries);

  useEffect(() => {
    if (queries?.pagination) {
      setPagination(queries.pagination);
    }
  }, [queries]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [statusFilter]);

  const columns: Column<IPayment>[] = [
    {
      key: "senderName",
      label: "Name",
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },

    {
      key: "senderPhone",
      label: "Phone Number / Email",
      render: (value) => {
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        );
      },
    },
    // {
    //   key: "amount",
    //   label: "Total Amount",
    //   render: (value, payment) => (
    //     <div className="text-sm">
    //       <div className="font-medium text-gray-900">
    //         ${payment.amount.toFixed(2)}
    //       </div>
    //     </div>
    //   ),
    // },
    // {
    //   key: "status",
    //   label: "Payment Status",
    //   render: (value) => (
    //     <span
    //       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
    //         value === "paid"
    //           ? "bg-green-100 text-green-800"
    //           : value === "pending"
    //           ? "bg-blue-100 text-blue-800"
    //           : value === "unpaid"
    //           ? "bg-red-100 text-red-800"
    //           : "bg-gray-100 text-gray-800"
    //       }`}
    //     >
    //       {value}
    //     </span>
    //   ),
    // },

    {
      key: "createdAt",
      label: "🕒 Submitted At",
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
    // {
    //   key: "actions",
    //   label: "Actions",
    //   render: (_, product) => (
    //     <Link
    //       href={`/payments/${product?.id}`}
    //       className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    //     >
    //       <Eye className="w-4 h-4 mr-1" />
    //       View Details
    //     </Link>
    //   ),
    // },
  ];

  const filters = (
    <>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Status</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
        <option value="pending">Pending</option>
      </select>
    </>
  );

  return (
    <div>
      <div className="">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Queries</h1>
          <p className="text-gray-600">Manage your queries</p>
        </div>
      </div>

      <DataTable
        data={queries}
        columns={columns}
        // filters={filters}
        searchValue={searchId}
        onSearch={(value) => setSearchId(value)}
        searchPlaceholder="search query by name or email or phone"
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

export default Query;
