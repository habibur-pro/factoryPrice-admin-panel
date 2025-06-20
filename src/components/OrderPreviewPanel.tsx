import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  User,
  Package,
  MapPin,
  CreditCard,
  FileText,
} from "lucide-react";
import { OrderItem, PaymentData, ShippingAddress } from "./CreateCustomOrder";

interface OrderReviewPanelProps {
  selectedUser: any;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentData: PaymentData;
  summary: {
    subtotal: number;
    discount: number;
    shippingCharge: number;
    totalQuantity: number;
    total: number;
  };
}

const OrderReviewPanel = ({
  selectedUser,
  orderItems,
  shippingAddress,
  paymentData,
  summary,
}: OrderReviewPanelProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const completionStatus = {
    user: !!selectedUser,
    items: orderItems.length > 0,
    shipping: !!(shippingAddress.fullName && shippingAddress.streetAddress),
    payment: !!paymentData.method,
  };

  const completedSteps = Object.values(completionStatus).filter(Boolean).length;
  const totalSteps = Object.keys(completionStatus).length;

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order Review
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    completedSteps === totalSteps ? "default" : "secondary"
                  }
                >
                  {completedSteps}/{totalSteps} Complete
                </Badge>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Customer Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">Customer</span>
                {completionStatus.user && (
                  <Badge variant="default" className="h-5 text-xs">
                    ✓
                  </Badge>
                )}
              </div>
              {selectedUser ? (
                <div className="ml-6 text-sm">
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <p className="text-gray-500">ID: {selectedUser.id}</p>
                </div>
              ) : (
                <p className="ml-6 text-sm text-gray-500">
                  No customer selected
                </p>
              )}
            </div>

            <Separator />

            {/* Items Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="font-medium">Items ({orderItems.length})</span>
                {completionStatus.items && (
                  <Badge variant="default" className="h-5 text-xs">
                    ✓
                  </Badge>
                )}
              </div>
              {orderItems.length > 0 ? (
                <div className="ml-6 space-y-2">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="text-sm p-2 bg-gray-50 rounded"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-gray-600">
                            {item.variants[0].color} • {item.totalQuantity}{" "}
                            items
                          </p>
                        </div>
                        <span className="font-medium">
                          ${item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ml-6 text-sm text-gray-500">No items added</p>
              )}
            </div>

            <Separator />

            {/* Shipping Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Shipping Address</span>
                {completionStatus.shipping && (
                  <Badge variant="default" className="h-5 text-xs">
                    ✓
                  </Badge>
                )}
              </div>
              {shippingAddress.fullName && shippingAddress.streetAddress ? (
                <div className="ml-6 text-sm">
                  <p className="font-medium">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.phoneNumber}</p>
                  <p>{shippingAddress.streetAddress}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state}{" "}
                    {shippingAddress.postalCode}
                  </p>
                  {shippingAddress.isDefault && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      Default Address
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="ml-6 text-sm text-gray-500">
                  No shipping address provided
                </p>
              )}
            </div>

            <Separator />

            {/* Payment Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="font-medium">Payment</span>
                {completionStatus.payment && (
                  <Badge variant="default" className="h-5 text-xs">
                    ✓
                  </Badge>
                )}
              </div>
              {paymentData.method ? (
                <div className="ml-6 text-sm">
                  <p className="font-medium">Method: {paymentData.method}</p>
                  {paymentData.details && (
                    <p className="text-gray-600">
                      Details: {paymentData.details.substring(0, 50)}...
                    </p>
                  )}
                  {paymentData.image && (
                    <p className="text-gray-600">Proof image attached</p>
                  )}
                </div>
              ) : (
                <p className="ml-6 text-sm text-gray-500">
                  No payment method selected
                </p>
              )}
            </div>

            <Separator />

            {/* Financial Summary */}
            <div className="space-y-2">
              <span className="font-medium">Order Summary</span>
              <div className="ml-6 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal ({summary.totalQuantity} items)</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${summary.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${summary.shippingCharge.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>${summary.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Completion Status */}
            <div className="pt-4 border-t">
              {completedSteps === totalSteps ? (
                <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    🎉 Ready to create order!
                  </p>
                  <p className="text-green-600 text-sm">
                    All required information is complete
                  </p>
                </div>
              ) : (
                <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-amber-800 font-medium">
                    ⚠️ Order incomplete
                  </p>
                  <p className="text-amber-600 text-sm">
                    Please complete {totalSteps - completedSteps} more step
                    {totalSteps - completedSteps !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
export default OrderReviewPanel;
