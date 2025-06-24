"use client";
import { Order, User } from "@/types/schemas";
import { apiClient } from "@/utils/api";
import { ArrowUp, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const [customerData, ordersData] = await Promise.all([
          apiClient.getCustomer(id),
          apiClient.getCustomerOrders(id),
        ]);
        setCustomer(customerData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Customer not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/customers"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2"
        >
          <ArrowUp className="w-4 h-4 mr-1 rotate-[270deg]" />
          Back to Customers
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {customer.firstName} {customer.lastName}
        </h1>
        <p className="text-gray-600">{customer.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-gray-400" />
              <h2 className="text-lg font-semibold">Customer Information</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <p className="text-sm text-gray-900">{customer.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <p className="text-sm text-gray-900">{customer.lastName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-blue-600">{customer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <p className="text-sm text-gray-900">
                  {customer.phoneNumber || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    customer.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {customer.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <p className="text-sm text-gray-900">
                  {customer.country || "Not provided"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            {customer.shippingAddress && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-md font-semibold text-gray-900 mb-3">
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-700">
                  <p>{customer.shippingAddress.street}</p>
                  <p>
                    {customer.shippingAddress.city},{" "}
                    {customer.shippingAddress.state}{" "}
                    {customer.shippingAddress.postalCode}
                  </p>
                  <p>{customer.shippingAddress.country}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        {/* <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <Package className="w-5 h-5 mr-2 text-gray-400" />
              <h2 className="text-lg font-semibold">Order Summary</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Orders</span>
                <span className="text-sm font-medium">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="text-sm font-medium">
                  $
                  {orders
                    .reduce((sum, order) => sum + order.total, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Order</span>
                <span className="text-sm font-medium">
                  $
                  {orders.length > 0
                    ? (
                        orders.reduce((sum, order) => sum + order.total, 0) /
                        orders.length
                      ).toFixed(2)
                    : "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Orders List */}
      {/* <div className="mt-6 bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Order History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                    {order._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/orders/${order._id}`}
                      className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default CustomerDetails;
