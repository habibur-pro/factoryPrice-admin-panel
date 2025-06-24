/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import ColorVariantBuilder from "./ColorVariantBuilder";

interface SizeQuantity {
  size: string;
  quantity: string;
}

interface ColorVariant {
  color: string;
  sizes: SizeQuantity[];
}

interface ProductVariantsProps {
  variants: ColorVariant[];
  setVariants: React.Dispatch<React.SetStateAction<ColorVariant[]>>;
  setTotalQuantity: React.Dispatch<React.SetStateAction<number>>; // Optional, if you need to set total quantity elsewhere
}

const ProductVariants = ({
  variants,
  setVariants,
  setTotalQuantity,
}: ProductVariantsProps) => {
  const resetAllVariants = () => {
    setVariants([]);
  };

  const getTotalStock = () => {
    return variants.reduce((total, variant) => {
      const totalQuantity =
        total +
        variant.sizes.reduce((sizeTotal, size) => {
          return sizeTotal + parseInt(size.quantity || "0");
        }, 0);
      if (setTotalQuantity) {
        setTotalQuantity(totalQuantity);
      }
      return totalQuantity;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-md font-medium">Product Variants</h3>
          <p className="text-sm text-muted-foreground">
            Create color variants with different sizes and stock quantities
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={resetAllVariants}
          className="flex items-center gap-1 text-destructive"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset All
        </Button>
      </div>
      {/* @ts-ignore */}
      <ColorVariantBuilder variants={variants} setVariants={setVariants} />

      {variants.length > 0 && (
        <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
          <h4 className="font-medium mb-2">Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Colors:</span>
              <span className="font-medium ml-2">{variants.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Stock:</span>
              <span className="font-medium ml-2">{getTotalStock()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariants;
