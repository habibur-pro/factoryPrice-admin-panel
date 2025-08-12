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
import { ProductVariantType } from "@/enum";

interface ProductPickerProps {
  orderItems: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
  setVariantType: React.Dispatch<React.SetStateAction<ProductVariantType>>;
}

const ProductPicker = ({ orderItems, onItemsChange, setVariantType }: ProductPickerProps) => {
  const [quantity, setQuantity] = useState<number>(0);
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
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
  
    const price = customPrice ?? (selectedProduct.basePrice as number);
  
    // Handle double variant
    if (selectedProduct.variantType === ProductVariantType.DOUBLE_VARIANT) {
      const variants = variantConfigs
        .map((variant) => {
          const sizes = Object.entries(variant.sizeQuantities)
            .filter(([_, qty]) => qty > 0)
            .map(([size, quantity]) => ({ size, quantity }));
  
          if (sizes.length === 0) return null;
  
          const totalQuantity = sizes.reduce((acc, s) => acc + s.quantity, 0);
          const totalPrice = totalQuantity * price;
  
          return {
            id: selectedProduct.id,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            images: selectedProduct.images,
            variantType: selectedProduct.variantType,
            variants: [{ color: variant.color, sizes }],
            perUnitPrice: price,
            totalQuantity,
            totalPrice,
          };
        })
        .filter(Boolean) as OrderItem[];
  
      if (variants.length === 0) {
        toast.error("No valid variant with quantity selected");
        return;
      }
  
      onItemsChange([...orderItems, ...variants]);
    }
  
    // Handle no variant
    if (selectedProduct.variantType === ProductVariantType.NO_VARIANT) {
      const totalPrice = quantity * price;
  
      const newItem: OrderItem = {
        id: selectedProduct.id,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        images: selectedProduct.images,
        variantType: selectedProduct.variantType,
        variants: [],
        perUnitPrice: price,
        totalQuantity: quantity,
        totalPrice,
      };
  
      onItemsChange([...orderItems, newItem]);
    }
  
    toast.success(`✅ Added to order`);
    setVariantConfigs([]);
    setSelectedProduct(null);
    setSearchTerm("");
    setCustomPrice(null);
  };
  

  // const addProductToOrder = () => {
  //   // if (!selectedProduct || variantConfigs.length === 0) {
  //   //   toast.error("Please select a product and at least one variant");
  //   //   return;
  //   // }
  //   const price = customPrice ?? selectedProduct?.basePrice as number;

  //   const variants = variantConfigs
  //     .map((variant) => {
  //       const sizes = Object.entries(variant.sizeQuantities)
  //         .filter(([_, qty]) => qty > 0)
  //         .map(([size, quantity]) => ({ size, quantity }));

  //       if (sizes.length === 0) return null;

  //       const totalQuantity = sizes.reduce((acc, s) => acc + s.quantity, 0);
  //       const totalPrice = totalQuantity * price;

  //       return {
  //         variantData: {
  //           color: variant.color,
  //           sizes,
  //         },
  //         totalQuantity,
  //         totalPrice,
  //       };
  //     })
  //     .filter(Boolean);

  //   // if (variants.length === 0) {
  //   //   toast.error("No valid variant with quantity selected");
  //   //   return;
  //   // }
  //   //@ts-ignore
  //   // const newItems: OrderItem[] = variants.map((variant) => ({
  //   //   id: selectedProduct?.id as string,
  //   //   productId: selectedProduct?.id,
  //   //   productName: selectedProduct?.name,
  //   //   images: selectedProduct?.images,
  //   //   //@ts-ignore
  //   //   variantType: selectedProduct?.variantType,
  //   //   //@ts-ignore
  //   //   variants: [variant.variantData],
  //   //   //@ts-ignore
  //   //   perUnitPrice: price,
  //   //   //@ts-ignore
  //   //   totalQuantity: selectedProduct?.variantType === ProductVariantType.DOUBLE_VARIANT ? variant?.totalQuantity : quantity,
  //   //   //@ts-ignore
  //   //   totalPrice: selectedProduct?.variantType === ProductVariantType.DOUBLE_VARIANT ? variant.totalPrice : quantity * price,
  //   // }));

  //   const newItems = {
  //     id: selectedProduct?.id as string,
  //     productId: selectedProduct?.id,
  //     productName: selectedProduct?.name,
  //     images: selectedProduct?.images,
  //     //@ts-ignore
  //     variantType: selectedProduct?.variantType,
  //     //@ts-ignore
  //     variants: [variants?.variantData],
  //     //@ts-ignore
  //     perUnitPrice: price,
  //     //@ts-ignore
  //     totalQuantity: selectedProduct?.variantType === ProductVariantType.DOUBLE_VARIANT ? variant?.totalQuantity : quantity,
  //     //@ts-ignore
  //     totalPrice: selectedProduct?.variantType === ProductVariantType.DOUBLE_VARIANT ? variant.totalPrice : quantity * price,
  //   };
  //   onItemsChange([...orderItems, ...newItems]);
  //   toast.success(`✅ Added to order`);
  //   setVariantConfigs([]);
  //   setSelectedProduct(null);
  //   setSearchTerm("");
  //   setCustomPrice(null);
  // };

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
        quantity={quantity}
        setQuantity={setQuantity}
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
