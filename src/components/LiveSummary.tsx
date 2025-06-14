import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Package, Truck, Tag, DollarSign } from "lucide-react";

interface LiveSummaryProps {
  subtotal: number;
  discount: number;
  shippingCharge: number;
  totalQuantity: number;
  total: number;
  onDiscountChange: (discount: number) => void;
  onShippingChange: (shipping: number) => void;
}

const LiveSummary = ({
  subtotal,
  discount,
  shippingCharge,
  totalQuantity,
  total,
  onDiscountChange,
  onShippingChange,
}: LiveSummaryProps) => {
  return (
    // <Card className="sticky top-6">
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Summary */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Total Items</span>
          </div>
          <span className="font-medium">{totalQuantity}</span>
        </div>

        {/* Financial Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          {/* Discount Input */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm">
              <Tag className="h-3 w-3" />
              Discount
            </Label>
            <Input
              type="number"
              min="0"
              max={subtotal}
              step="0.01"
              placeholder="0.00"
              value={discount || ""}
              onChange={(e) =>
                onDiscountChange(parseFloat(e.target.value) || 0)
              }
              className="text-right"
            />
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount Applied</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          {/* Shipping Input */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm">
              <Truck className="h-3 w-3" />
              Shipping Charge
            </Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={shippingCharge || ""}
              onChange={(e) =>
                onShippingChange(parseFloat(e.target.value) || 0)
              }
              className="text-right"
            />
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total
              </span>
              <span className="text-xl font-bold text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">
              {totalQuantity}
            </div>
            <div className="text-xs text-blue-600">Items</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">
              ${total.toFixed(0)}
            </div>
            <div className="text-xs text-green-600">Total Value</div>
          </div>
        </div>

        {subtotal > 0 && (
          <div className="text-xs text-gray-500 text-center">
            💡 Summary updates automatically as you add products
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default LiveSummary;
