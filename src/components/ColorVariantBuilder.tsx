import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

interface SizeQuantity {
  size: string;
  quantity: number;
}

interface ColorVariant {
  color: string;
  sizes: SizeQuantity[];
}

interface ColorVariantBuilderProps {
  variants: ColorVariant[];
  setVariants: React.Dispatch<React.SetStateAction<ColorVariant[]>>;
}

const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const ColorVariantBuilder = ({
  variants,
  setVariants,
}: ColorVariantBuilderProps) => {
  const [newColor, setNewColor] = useState("");

  const addColorVariant = () => {
    if (!newColor.trim()) {
      toast.error("Please enter a color name!");
      return;
    }

    if (
      variants.some((v) => v.color.toLowerCase() === newColor.toLowerCase())
    ) {
      toast.error("This color already exists!");
      return;
    }

    const newVariant: ColorVariant = {
      color: newColor.trim(),
      sizes: [],
    };

    setVariants((prev) => [...prev, newVariant]);
    setNewColor("");
    toast.success(`${newColor} color added!`);
  };

  const removeColorVariant = (colorIndex: number) => {
    const color = variants[colorIndex].color;
    setVariants((prev) => prev.filter((_, index) => index !== colorIndex));
    toast.success(`${color} color removed!`);
  };

  const addSizeToColor = (colorIndex: number, size: string) => {
    const colorVariant = variants[colorIndex];
    if (colorVariant.sizes.some((s) => s.size === size)) {
      toast.error(`Size ${size} already exists for ${colorVariant.color}!`);
      return;
    }

    setVariants((prev) =>
      prev.map((variant, index) =>
        index === colorIndex
          ? {
              ...variant,
              sizes: [...variant.sizes, { size, quantity: 0 }],
            }
          : variant
      )
    );
    toast.success(`Size ${size} added to ${colorVariant.color}!`);
  };

  const removeSizeFromColor = (colorIndex: number, sizeIndex: number) => {
    const size = variants[colorIndex].sizes[sizeIndex].size;
    const color = variants[colorIndex].color;

    setVariants((prev) =>
      prev.map((variant, index) =>
        index === colorIndex
          ? {
              ...variant,
              sizes: variant.sizes.filter((_, idx) => idx !== sizeIndex),
            }
          : variant
      )
    );
    toast.success(`Size ${size} removed from ${color}!`);
  };

  const updateSizeQuantity = (
    colorIndex: number,
    sizeIndex: number,
    quantity: number
  ) => {
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === colorIndex
          ? {
              ...variant,
              sizes: variant.sizes.map((size, idx) =>
                idx === sizeIndex ? { ...size, quantity } : size
              ),
            }
          : variant
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Add Color Input */}
      <div className="flex space-x-2">
        <Input
          placeholder="Enter color name (e.g., Red, Black, Blue)"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addColorVariant()}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addColorVariant}
          disabled={!newColor.trim()}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Color
        </Button>
      </div>

      {/* Color Variants */}
      {variants.map((variant, colorIndex) => (
        <Card key={colorIndex} className="border">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium">{variant.color}</h4>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive h-8 w-8 p-0"
                onClick={() => removeColorVariant(colorIndex)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Add Size Buttons */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Add Sizes:</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SIZES.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSizeToColor(colorIndex, size)}
                    disabled={variant.sizes.some((s) => s.size === size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Size and Quantity Grid */}
            {variant.sizes.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Sizes & Quantities:
                </Label>
                <div className="grid gap-3">
                  {variant.sizes.map((size, sizeIndex) => (
                    <div
                      key={sizeIndex}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <Label className="text-sm font-medium">
                          Size {size.size}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">
                          Quantity:
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={size.quantity}
                          onChange={(e) =>
                            updateSizeQuantity(
                              colorIndex,
                              sizeIndex,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-20"
                          min="0"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive h-8 w-8 p-0"
                          onClick={() =>
                            removeSizeFromColor(colorIndex, sizeIndex)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Summary */}
            {variant.sizes.length > 0 && (
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">
                    Total for {variant.color}:
                  </span>
                  <span className="ml-2">
                    {variant.sizes.reduce(
                      (total, size) => total + parseInt(size.quantity || "0"),
                      0
                    )}{" "}
                    units
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {variants.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No color variants added yet. Add a color to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ColorVariantBuilder;
