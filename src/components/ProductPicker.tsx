/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { debounce } from "lodash";
import { OrderItem } from "./CreateCustomOrder";
import ProductSearch from "./ProductSearch";
import ProductSelection from "./ProductSelection";
import ProductConfiguration from "./ProductConfiguration";
import OrderItemsList from "./OrderItemList";
import { IProduct } from "@/types";
import { useSearchProductQuery } from "@/redux/api/productApi";

interface ProductPickerProps {
  orderItems: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
}

const ProductPicker = ({ orderItems, onItemsChange }: ProductPickerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [variantConfigs, setVariantConfigs] = useState<
    {
      color: string;
      sizeQuantities: { [size: string]: number };
    }[]
  >([]);
  const [customPrice, setCustomPrice] = useState<number | null>(null);

  const debouncedSearch = useMemo(
    () => debounce((val: string) => setDebouncedTerm(val), 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const { data: productsRes = [], isFetching } = useSearchProductQuery(
    debouncedTerm,
    {
      skip: !debouncedTerm,
    }
  );

  const products = productsRes?.data;
  const filteredProducts = products;

  const addOrUpdateVariantConfig = (
    color: string,
    size: string,
    quantity: number
  ) => {
    setVariantConfigs((prev) => {
      const existing = prev.find((v) => v.color === color);
      if (existing) {
        return prev.map((v) =>
          v.color === color
            ? {
                ...v,
                sizeQuantities: {
                  ...v.sizeQuantities,
                  [size]: quantity,
                },
              }
            : v
        );
      } else {
        return [
          ...prev,
          {
            color,
            sizeQuantities: { [size]: quantity },
          },
        ];
      }
    });
  };

  const addProductToOrder = () => {
    if (!selectedProduct || variantConfigs.length === 0) {
      toast.error("Please select a product and at least one variant");
      return;
    }

    const variants = variantConfigs
      .map((variant) => {
        const sizes = Object.entries(variant.sizeQuantities)
          .filter(([_, qty]) => qty > 0)
          .map(([size, quantity]) => ({ size, quantity }));

        if (sizes.length === 0) return null;

        const totalQuantity = sizes.reduce((acc, s) => acc + s.quantity, 0);
        const price = customPrice ?? selectedProduct.basePrice;
        const totalPrice = totalQuantity * price;

        return {
          variantData: {
            color: variant.color,
            sizes,
          },
          perUnitPrice: price,
          totalQuantity,
          totalPrice,
        };
      })
      .filter(Boolean);

    if (variants.length === 0) {
      toast.error("No valid variant with quantity selected");
      return;
    }
    //@ts-ignore
    const newItems: OrderItem[] = variants.map((variant) => ({
      id: selectedProduct.id,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      slug: selectedProduct.slug,
      sku: selectedProduct.sku,
      //@ts-ignore
      variants: [variant.variantData],
      //@ts-ignore
      perUnitPrice: variant.perUnitPrice,
      //@ts-ignore
      totalQuantity: variant.totalQuantity,
      //@ts-ignore
      totalPrice: variant.totalPrice,
    }));

    onItemsChange([...orderItems, ...newItems]);
    toast.success(`✅ Added ${newItems.length} variant(s) to order`);

    setVariantConfigs([]);
    setSelectedProduct(null);
    setSearchTerm("");
    setCustomPrice(null);
  };

  const removeItem = (itemId: string) => {
    onItemsChange(orderItems.filter((item) => item.id !== itemId));
    toast.success("Item removed from order");
  };

  return (
    <div className="space-y-6">
      <ProductSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {isFetching ? (
        <div className="text-center text-gray-500">Loading products...</div>
      ) : (
        filteredProducts?.length > 0 && (
          <ProductSelection
            searchTerm={searchTerm}
            filteredProducts={filteredProducts}
            selectedProduct={selectedProduct}
            onProductSelect={(product) => {
              setSelectedProduct(product);
              setVariantConfigs([]);
              setCustomPrice(null);
            }}
          />
        )
      )}

      <ProductConfiguration
        selectedProduct={selectedProduct}
        variantConfigs={variantConfigs}
        onSizeQuantityChange={addOrUpdateVariantConfig}
        onCustomPriceChange={setCustomPrice}
        onAddToOrder={addProductToOrder}
      />

      <OrderItemsList orderItems={orderItems} onRemoveItem={removeItem} />

      {orderItems.length === 0 && !selectedProduct && !searchTerm && (
        <div className="text-center py-5 text-gray-500">
          <p>Start typing to find products</p>
        </div>
      )}
    </div>
  );
};

export default ProductPicker;
