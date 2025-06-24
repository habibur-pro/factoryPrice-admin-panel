import React from "react";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import Image from "next/image";
import { IProduct } from "@/types";

interface ProductSelectionProps {
  searchTerm: string;
  filteredProducts: IProduct[];
  selectedProduct: IProduct | null;
  onProductSelect: (product: IProduct) => void;
}

const ProductSelection = ({
  searchTerm,
  filteredProducts,
  selectedProduct,
  onProductSelect,
}: ProductSelectionProps) => {
  if (!searchTerm) return null;

  return (
    <div className="border rounded-lg max-h-60 overflow-y-auto">
      {filteredProducts.map((product, i) => (
        <div
          key={`${product.id}-${i}`}
          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
            selectedProduct?.id === product.id
              ? "border-l-primary bg-primary/5"
              : "border-l-transparent"
          }`}
          onClick={() => onProductSelect(product)}
        >
          <div className="flex items-center gap-3">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={100}
              height={100}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{product.name}</h4>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-1">
                <span>SKU: {product.sku}</span>
                <Badge variant="outline">${product.basePrice}</Badge>
                <span className="text-xs">{product.category.categoryName}</span>
                {/* {product.rating && (
                  <span className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {product.rating}
                  </span>
                )} */}
              </div>
              {product.description && (
                <p className="text-xs text-gray-500">{product.description}</p>
              )}
            </div>
          </div>
        </div>
      ))}
      {filteredProducts.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          <Package className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>No products found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  );
};
export default ProductSelection;
