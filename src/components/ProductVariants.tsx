import { Button } from "@/components/ui/button";
import HierarchicalVariantBuilder from "./HierarchicalVariantBuilder";
import { RefreshCcw } from "lucide-react";

// Updated VariantCombination type to match the required structure
interface VariantCombination {
  id: string;
  group: string;
  label: string;
  value: string;
  stock: number;
}

interface ProductVariantsProps {
  variants: VariantCombination[];
  setVariants: React.Dispatch<React.SetStateAction<VariantCombination[]>>;
}

const ProductVariants2 = ({ variants, setVariants }: ProductVariantsProps) => {
  const resetAllVariants = () => {
    setVariants([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-md font-medium">Product Variants</h3>
          <p className="text-sm text-muted-foreground">
            Create variant groups like Color, Size and set individual stock for
            each combination
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

      <HierarchicalVariantBuilder
        variantTypes={[]} // Not used anymore
        variants={variants}
        setVariants={setVariants}
      />

      {variants.length > 0 && (
        <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
          <h4 className="font-medium mb-2">Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Variants:</span>
              <span className="font-medium ml-2">{variants.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Stock:</span>
              <span className="font-medium ml-2">
                {variants.reduce((sum, v) => sum + (v.stock || 0), 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariants2;
