"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  Package,
  User as UserIcon,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Order } from "@/types/schemas";
import { apiClient } from "@/utils/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetOrderQuery } from "@/redux/api/orderApi";

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const [order, setOrder] = useState<Order | null>(null);
  const { data: orderRes, isLoading } = useGetOrderQuery(id, { skip: !id });
  const order = orderRes?.data;
  console.log(order);
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/orders"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2"
        >
          <ArrowUp className="w-4 h-4 mr-1 rotate-[270deg]" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {order.orderName}
            </h1>
            <p className="text-gray-600">
              Order ID: {order.id} • Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : order.status === "shipped"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : order.status === "processing"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status}
            </span>
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                order.paymentStatus === "completed"
                  ? "bg-green-100 text-green-800"
                  : order.paymentStatus === "failed"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              Payment {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Order Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-gray-400" />
                <h2 className="text-lg font-semibold">Order Items</h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Variants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item._id}>
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            href={`/products/${item.productSlug}`}
                            className="font-medium text-blue-700 block"
                          >
                            {item?.productName}
                          </Link>
                          ID: {item.productId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.itemVariants.length > 0 ? (
                          <div className="space-y-1">
                            {item.itemVariants.map((variant, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium text-gray-700">
                                  Color: {variant.color}
                                </div>
                                {variant.sizes.map((size, sizeIndex) => (
                                  <div
                                    key={sizeIndex}
                                    className="text-gray-500 text-xs"
                                  >
                                    {size.size}: {size.quantity} units
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No variants
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.totalQuantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.perUnitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-gray-400" />
                <h2 className="text-lg font-semibold">Customer Information</h2>
              </div>
            </div>
            <div className="p-6">
              {order.user ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-sm text-gray-900">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-blue-600">{order.user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <Link
                      href={`/customers/${order.user.id}`}
                      className="text-sm text-blue-600"
                    >
                      {order.user.id || ""}
                    </Link>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-sm text-gray-900">
                      {order.user.phoneNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <p className="text-sm text-gray-900">
                      {order.user.country || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <p className="text-sm text-gray-900">
                      {order.user.company || ""}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500">
                    Customer ID: {order.userId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Order Summary</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-red-600">
                  -${order.discount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  ${order.shippingCharge.toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-lg font-bold text-green-600">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                <h2 className="text-lg font-semibold">Payment Information</h2>
              </div>
            </div>
            <div className="p-6 space-y-3 grid grid-cols-1 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment ID
                </label>
                <p className="text-sm font-mono text-gray-600">
                  {order.paymentId}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.paymentStatus === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.paymentStatus === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              {order.payment && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Geteway
                    </label>
                    <p className="text-sm text-gray-900">
                      {order.payment.paymentGateway || ""}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <p className="text-sm text-gray-900">
                      {order.payment.paymentMethod}
                    </p>
                  </div>
                  {order.payment.transactionId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction ID
                      </label>
                      <p className="text-sm font-mono text-gray-600">
                        {order.payment.transactionId}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                  <h2 className="text-lg font-semibold">Shipping Address</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-700 space-y-1">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
