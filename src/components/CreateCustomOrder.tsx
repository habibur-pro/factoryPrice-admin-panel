"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import UserSelector from "./UserSelector";
import ProductPicker from "./ProductPicker";
import ShippingAddressForm from "./ShippingAddressForm";
import PaymentOptions from "./PaymentOptions";
import LiveSummary from "./LiveSummary";
import OrderReviewPanel from "./OrderPreviewPanel";
import { usePlaceCustomOrderMutation } from "@/redux/api/orderApi";
import { useRouter } from "next/navigation";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  slug: string;
  variants: {
    color: string;
    sizes: { size: string; quantity: number }[];
  }[];
  sku: string | null;
  perUnitPrice: number;
  totalQuantity: number;
  totalPrice: number;
}

export interface ShippingAddress {
  country: string;
  dialCode: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  apartment: string;
  isDefault: boolean;
}

export interface PaymentData {
  method: string;
  details?: string;
  image?: File;
  refImage?: string;
}

export const CreateCustomOrder = () => {
  const router = useRouter();
  const [placeCustomOrder] = usePlaceCustomOrderMutation();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [paymentRefImage, setPaymentRefImage] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    apartment: "",
    country: "",
    dialCode: "",
    isDefault: false,
  });
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: "manual",
  });
  const [discount, setDiscount] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(15);
  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + item.totalQuantity,
    0
  );
  const total = subtotal - discount + shippingCharge;

  const handleCreateOrder = async () => {
    if (!selectedUser) {
      toast.error("Please select a user for this order");
      return;
    }
    if (orderItems.length === 0) {
      toast.error("Please add at least one product to the order");
      return;
    }
    if (!shippingAddress.fullName || !shippingAddress.streetAddress) {
      toast.error("Please fill in the shipping address");
      return;
    }

    // Here you would typically send the order data to your backend
    console.log("Creating order:", {
      user: selectedUser,
      items: orderItems,
      shippingAddress,
      payment: paymentData,
      subtotal,
      discount,
      shippingCharge,
      total,
      totalQuantity,
    });

    const items = orderItems.map((item) => {
      return {
        productId: item.id,
        itemVariants: item.variants,
        totalQuantity: item.totalQuantity,
        perUnitPrice: item.perUnitPrice,
        totalPrice: item.totalPrice,
        productName: item.productName,
        productSlug: item.slug,
      };
    });
    const orderPayload = {
      userId: selectedUser.id,
      subtotal,
      discount,
      shippingCharge,
      total,
      items,
    };

    const paymentsD = {
      paymentMethod: "custom",
      manualPaymentData: {
        methodName: paymentData.method,
        description: paymentData.details,
        image: paymentRefImage,
      },
    };
    const payload = {
      orderPayload,
      paymentData: paymentsD,
      shipping: shippingAddress,
    };
    try {
      await placeCustomOrder(payload).unwrap();
      toast.success(
        "🎉 Order created successfully! Customer will be notified shortly.",
        {
          duration: 4000,
        }
      );
      router.push("/orders");
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    }
  };

  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Start New Order
            </h1>
            <p className="text-gray-600">
              Create a custom order for any customer
            </p>
          </div>
        </div>
        <ShoppingCart className="h-8 w-8 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👤 Select Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserSelector
                selectedUser={selectedUser}
                onUserSelect={setSelectedUser}
              />
            </CardContent>
          </Card>

          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🛍️ Add Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProductPicker
                orderItems={orderItems}
                onItemsChange={setOrderItems}
              />
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📍 Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ShippingAddressForm
                address={shippingAddress}
                onAddressChange={setShippingAddress}
                selectedUser={selectedUser}
              />
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💳 Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentOptions
                paymentData={paymentData}
                onPaymentChange={setPaymentData}
                setPaymentRefImage={setPaymentRefImage}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Live Summary */}
          <LiveSummary
            subtotal={subtotal}
            discount={discount}
            shippingCharge={shippingCharge}
            totalQuantity={totalQuantity}
            total={total}
            onDiscountChange={setDiscount}
            onShippingChange={setShippingCharge}
          />

          {/* Order Review */}
          <OrderReviewPanel
            selectedUser={selectedUser}
            orderItems={orderItems}
            shippingAddress={shippingAddress}
            paymentData={paymentData}
            summary={{
              subtotal,
              discount,
              shippingCharge,
              totalQuantity,
              total,
            }}
          />

          {/* Create Order Button */}
          <Button
            onClick={handleCreateOrder}
            size="lg"
            className="w-full text-lg py-6"
          >
            🚀 Confirm & Send Order
          </Button>
        </div>
      </div>
    </div>
  );
};
