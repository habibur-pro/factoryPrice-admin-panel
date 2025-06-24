"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProduct } from "@/types";

import { apiClient } from "@/utils/api";
import {
  ArrowUp,
  DollarSign,
  Hash,
  Package as PackageIcon,
  Palette,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const productData = await apiClient.getProduct(id);
        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const getTotalVariantStock = () => {
    return product.variants.reduce((total, variant) => {
      return (
        total +
        variant.sizes.reduce((sizeTotal, size) => sizeTotal + size.quantity, 0)
      );
    }, 0);
  };

  const getPriceRange = () => {
    if (product.pricing.length === 0) return null;
    const minPrice = Math.min(...product.pricing.map((p) => p.price));
    const maxPrice = Math.max(...product.pricing.map((p) => p.price));
    return { minPrice, maxPrice };
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-2"
        >
          <ArrowUp className="w-4 h-4 mr-1 rotate-[270deg]" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PackageIcon className="w-5 h-5 mr-2 text-gray-400" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product ID
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {product.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <p className="text-sm text-gray-900 font-medium">
                    {product.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <p className="text-sm text-gray-900 font-mono">
                    {product.slug}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                    {product.category.categoryName}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.status === "active"
                        ? "bg-green-100 text-green-800"
                        : product.status === "inactive"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  {product.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Tiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-gray-400" />
                Pricing Tiers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity Range
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price per Unit
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Savings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {product.pricing.map((tier, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tier.minQuantity} - {tier.maxQuantity} units
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ${tier.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {index === 0 ? (
                            <span className="text-gray-500">Base price</span>
                          ) : (
                            <span className="text-green-600">
                              $
                              {(product.pricing[0].price - tier.price).toFixed(
                                2
                              )}{" "}
                              off
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-gray-400" />
                  Product Variants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          {variant.color}
                        </h4>
                        <span className="text-sm text-gray-500">
                          ID: {variant.id}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {variant.sizes.map((size, sizeIndex) => (
                          <div
                            key={sizeIndex}
                            className="bg-gray-50 p-3 rounded"
                          >
                            <div className="text-sm font-medium text-gray-900">
                              {size.size}
                            </div>
                            <div className="text-xs text-gray-600">
                              Stock: {size.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Images */}
          {product.images && product.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-gray-400" />
                Pricing Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price
                </label>
                <p className="text-lg font-bold text-green-600">
                  ${product.basePrice.toFixed(2)}
                </p>
              </div>
              {getPriceRange() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <p className="text-sm text-gray-900">
                    ${getPriceRange()!.minPrice.toFixed(2)} - $
                    {getPriceRange()!.maxPrice.toFixed(2)}
                  </p>
                </div>
              )}
              {/* {product.discount && (
                <div className="bg-red-50 p-3 rounded">
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    Active Discount
                  </label>
                  <p className="text-sm text-red-900">
                    {product.discount.percentage}% off
                  </p>
                  <p className="text-xs text-red-600">
                    Valid until:{" "}
                    {new Date(product.discount.validUntil).toLocaleDateString()}
                  </p>
                </div>
              )} */}
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2 text-gray-400" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Stock</span>
                <span className="text-sm font-medium">
                  {product.stockQuantity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Quantity</span>
                <span className="text-sm font-medium">
                  {product.totalQuantity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Min Order Qty</span>
                <span className="text-sm font-medium">
                  {product.minOrderQuantity}
                </span>
              </div>
              {product.variants.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Variant Stock</span>
                  <span className="text-sm font-medium">
                    {getTotalVariantStock()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Stock Ratio</span>
                <span className="text-sm font-medium">
                  {(
                    (product.stockQuantity / product.totalQuantity) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    product.stockQuantity / product.totalQuantity > 0.5
                      ? "bg-green-500"
                      : product.stockQuantity / product.totalQuantity > 0.2
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{
                    width: `${
                      (product.stockQuantity / product.totalQuantity) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Product IDs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="w-5 h-5 mr-2 text-gray-400" />
                Identifiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  MongoDB ID
                </label>
                <p className="text-xs font-mono text-gray-900 bg-gray-50 p-2 rounded">
                  {product.id}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Product ID
                </label>
                <p className="text-xs font-mono text-gray-900 bg-gray-50 p-2 rounded">
                  {product.id}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Slug
                </label>
                <p className="text-xs font-mono text-gray-900 bg-gray-50 p-2 rounded">
                  {product.slug}
                </p>
              </div>
              {product.discountId && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Discount ID
                  </label>
                  <p className="text-xs font-mono text-gray-900 bg-gray-50 p-2 rounded">
                    {product.discountId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
