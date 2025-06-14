import React from "react";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp } from "lucide-react";


interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ProductSearch = ({
  searchTerm,
  onSearchChange,
}: // popularProducts,
ProductSearchProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products by name, SKU, or category..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Popular Products Hint */}
      {!searchTerm && (
        <div className="text-center py-4 text-gray-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">
              💡 Try searching for popular items
            </span>
          </div>
          {/* <div className="flex flex-wrap justify-center gap-2">
            {popularProducts.map((product) => (
              <Badge
                key={product.id}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => onSearchChange(product.name)}
              >
                {product.name}
              </Badge>
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
};
export default ProductSearch;
