import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, Package } from "lucide-react";
import { OrderItem } from "./CreateCustomOrder";

interface OrderItemsListProps {
  orderItems: OrderItem[];
  onRemoveItem: (itemId: string) => void;
}

const OrderItemsList = ({ orderItems, onRemoveItem }: OrderItemsListProps) => {
  if (orderItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
        <p>No products added yet</p>
        <p className="text-sm">Search for products to add to this order</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        Order Items ({orderItems.length})
      </h3>
      <div className="space-y-3">
        {orderItems.map((item, i) => (
          <Card key={`${item.id}-${item.slug}-${i}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{item.productName}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>Color: {item.variants[0].color}</span>
                    <span>Qty: {item.totalQuantity}</span>
                    <span className="font-medium text-primary">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs">
                      @${item.perUnitPrice.toFixed(2)}/unit
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.variants[0].sizes.map((size) => (
                      <Badge
                        key={size.size}
                        variant="outline"
                        className="text-xs"
                      >
                        {size.size}: {size.quantity}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default OrderItemsList;
