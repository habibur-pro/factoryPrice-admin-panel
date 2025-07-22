"use client";
import React, { useState, useEffect } from "react";
import DataTable, { Column } from "@/components/DataTable";
import { useRouter } from "next/navigation";
import { IChatSession, IPayment } from "@/types";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
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

  useEffect(() => {
    if (queries?.pagination) {
      setPagination(queries.pagination);
    }
  }, [queries]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [statusFilter]);

  const columns: Column<IChatSession>[] = [
    {
      key: "senderName",
      label: "Name",
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "senderPhone",
      label: "Whatsapp Number",
      render: (value, row) => {
        const fullPhone = `${row.senderCountryCode?.replace("+", "")}${value}`;
        const phoneWithPlus = `${row.senderCountryCode}${value}`;

        return (
          <div className="text-sm space-y-2">
            {/* WhatsApp link */}
            <div className="font-medium text-gray-900 flex gap-2 items-center">
              <span>{phoneWithPlus}</span>
              <Link
                href={`https://wa.me/${fullPhone}`}
                title="Open WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* Call Now Button */}
            <button
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition cursor-pointer"
              onClick={() => router.push(`tel:${phoneWithPlus}`)}
            >
              Call Now
            </button>
          </div>
        );
      },
    },
    {
      key: "senderEmail",
      label: "Email",
      render: (value, row) => {
        return (
          <div className="text-sm">
            <div className="font-medium text-gray-900 flex gap-2 items-center">
              <a
                href={`mailto:${value}?subject=Regarding Your Query`}
                className="text-blue-600 underline hover:text-blue-800 transition"
                title="Send Email"
              >
                {value}
                {/* <Send className="w-4 h-4 text-blue-600" /> */}
              </a>
            </div>
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
