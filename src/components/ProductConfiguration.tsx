import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import Image from "next/image";
import { IProduct } from "@/types";
import { toast } from "sonner";

interface VariantConfig {
  color: string;
  sizeQuantities: { [size: string]: number };
}

interface ProductConfigurationProps {
  selectedProduct: IProduct | null;
  variantConfigs: VariantConfig[];
  onSizeQuantityChange: (color: string, size: string, quantity: number) => void;
  onCustomPriceChange: (price: number | null) => void;
  onAddToOrder: () => void;
}

const ProductConfiguration = ({
  selectedProduct,
  variantConfigs,
  onSizeQuantityChange,
  onCustomPriceChange,
  onAddToOrder,
}: ProductConfigurationProps) => {
  const [openStates, setOpenStates] = useState<{ [color: string]: boolean }>(
    {}
  );
  const [customPriceInput, setCustomPriceInput] = useState<string>("");

  useEffect(() => {
    if (!selectedProduct) return;
    const initial: { [color: string]: boolean } = {};
    selectedProduct.variants.forEach((variant) => {
      const state = variantConfigs.find((v) => v.color === variant.color);
      const hasInput = Object.values(state?.sizeQuantities || {}).some(
        (q) => q > 0
      );
      initial[variant.color] = hasInput;
    });
    setOpenStates(initial);
  }, [selectedProduct, variantConfigs]);

  const toggleCollapse = (color: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [color]: !prev[color],
    }));
  };

  const handleCustomPriceChange = (value: string) => {
    setCustomPriceInput(value);
    const parsed = parseFloat(value);
    onCustomPriceChange(isNaN(parsed) ? null : parsed);
  };

  if (!selectedProduct) return null;

  return (
    <Card className="border-primary/20">
      <CardContent className="p-4 space-y-6">
        {/* Product Header */}
        <div className="flex items-center gap-3">
          <Image
            src={selectedProduct.images[0]}
            alt={selectedProduct.name}
            height={64}
            width={64}
            className="w-14 h-14 rounded object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium">{selectedProduct.name}</h3>
            <p className="text-sm text-gray-600">
              SKU: {selectedProduct.sku} • ${selectedProduct.basePrice}
            </p>
            {selectedProduct.description && (
              <p className="text-xs text-gray-500 mt-1">
                {selectedProduct.description}
              </p>
            )}
          </div>
        </div>

        {/* Global Custom Price Input */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Custom Price (optional)</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder={`Default: $${selectedProduct.basePrice}`}
            value={customPriceInput}
            onChange={(e) => handleCustomPriceChange(e.target.value)}
          />
        </div>

        {/* Variants */}
        {selectedProduct.variants.map((variant) => {
          const color = variant.color;
          const state = variantConfigs.find((v) => v.color === color);
          const isOpen = openStates[color] ?? false;

          return (
            <div key={color} className="border-t pt-4 space-y-2">
              {/* Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleCollapse(color)}
              >
                <div className="text-sm font-medium capitalize">
                  🎨 Variant: {color}
                </div>
                <div className="text-gray-500 hover:text-black">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Body */}
              {isOpen && (
                <div className="space-y-4">
                  {/* Sizes */}
                  <div className="space-y-1">
                    <label className="text-sm">Sizes & Quantities</label>
                    <div className="grid grid-cols-2 gap-3">
                      {variant.sizes.map((sizeInfo) => (
                        <div key={sizeInfo.size}>
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{sizeInfo.size}</span>
                            <span
                              className={`text-xs ${
                                sizeInfo.quantity < 10
                                  ? "text-orange-600"
                                  : "text-green-600"
                              }`}
                            >
                              {sizeInfo.quantity} in stock
                            </span>
                          </div>
                          <Input
                            type="number"
                            min={0}
                            max={sizeInfo.quantity}
                            placeholder="Qty"
                            value={state?.sizeQuantities[sizeInfo.size] || ""}
                            onChange={(e) => {
                              const qty = parseInt(e.target.value);
                              if (qty > sizeInfo.quantity) {
                                toast.error("Out of stock");
                                return;
                              }
                              onSizeQuantityChange(
                                color,
                                sizeInfo.size,
                                qty || 0
                              );
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add to Order */}
        <Button onClick={onAddToOrder} className="w-full mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add to Order
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductConfiguration;
