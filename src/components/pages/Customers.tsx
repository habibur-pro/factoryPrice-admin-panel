"use client";
import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import DataTable, { Column } from "@/components/DataTable";
import { User } from "@/types/schemas";
import { apiClient } from "@/utils/api";
import Link from "next/link";

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getCustomers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchValue,
        status: statusFilter,
      });
      setCustomers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [pagination.page, searchValue, statusFilter]);

  const columns: Column<User>[] = [
    {
      key: "_id",
      label: "ID",
      render: (value) => (
        <span className="font-mono text-xs text-gray-600">
          {value.slice(-8)}
        </span>
      ),
    },
    {
      key: "firstName",
      label: "First Name",
      sortable: true,
    },
    {
      key: "lastName",
      label: "Last Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      render: (value) => <span className="text-blue-600">{value}</span>,
    },
    {
      key: "phoneNumber",
      label: "Phone",
      render: (value) => value || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "country",
      label: "Country",
      render: (value) => value || "-",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, customer) => (
        <Link
          href={`/customers/${customer._id}`}
          className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Link>
      ),
    },
  ];

  const filters = (
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">All Status</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">Manage your customer accounts</p>
      </div>

      <DataTable
        data={customers}
        columns={columns}
        searchValue={searchValue}
        onSearch={setSearchValue}
        searchPlaceholder="Search by name or email..."
        filters={filters}
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

export default Customers;
