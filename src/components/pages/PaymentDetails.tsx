"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const PaymentDetails = () => {
  const { paymentId } = useParams();
  const router = useRouter();

  // Mock payment data
  const payment = {
    id: paymentId || "PAY-001",
    orderId: "ORD-5312",
    customer: {
      name: "Apple Inc.",
      email: "procurement@apple.com",
      phone: "+1 (555) 123-4567",
    },
    amount: 12500.0,
    currency: "USD",
    method: "Credit Card",
    status: "completed",
    date: "2025-06-15T10:30:00Z",
    transactionId: "TXN-ABC123",
    paymentProcessor: "Stripe",
    cardDetails: {
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2027,
    },
    billingAddress: {
      street: "1 Apple Park Way",
      city: "Cupertino",
      state: "CA",
      zipCode: "95014",
      country: "United States",
    },
    fees: {
      processingFee: 125.0,
      platformFee: 50.0,
    },
    refunds: [],
    timeline: [
      {
        date: "2025-06-15T10:30:00Z",
        event: "Payment initiated",
        status: "info",
      },
      {
        date: "2025-06-15T10:31:00Z",
        event: "Payment authorized",
        status: "success",
      },
      {
        date: "2025-06-15T10:32:00Z",
        event: "Payment captured",
        status: "success",
      },
      {
        date: "2025-06-15T10:33:00Z",
        event: "Payment completed",
        status: "success",
      },
    ],
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/payments")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Payments
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Payment {payment.id}</h1>
              <p className="text-muted-foreground">
                Transaction ID: {payment.transactionId}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            {payment.status === "completed" && (
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refund
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Status</span>
                  {getStatusBadge(payment.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Amount</span>
                  <span className="text-2xl font-bold">
                    ${payment.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Payment Method</span>
                  <span>{payment.method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Date</span>
                  <span>{new Date(payment.date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Related Order</span>
                  <Button variant="link" className="p-0 h-auto">
                    {payment.orderId}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Card</span>
                  <span>**** **** **** {payment.cardDetails.last4}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Brand</span>
                  <span>{payment.cardDetails.brand}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Processor</span>
                  <span>{payment.paymentProcessor}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      $
                      {(
                        payment.amount -
                        payment.fees.processingFee -
                        payment.fees.platformFee
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee</span>
                    <span>${payment.fees.processingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Platform Fee</span>
                    <span>${payment.fees.platformFee.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${payment.amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{payment.customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.customer.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.customer.phone}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p>{payment.billingAddress.street}</p>
                  <p>
                    {payment.billingAddress.city},{" "}
                    {payment.billingAddress.state}{" "}
                    {payment.billingAddress.zipCode}
                  </p>
                  <p>{payment.billingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payment.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          event.status === "success"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
