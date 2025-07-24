"use client";
import DataTable, { Column } from "@/components/DataTable";
import { Product } from "@/types/schemas";
import { apiClient } from "@/utils/api";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const Products: React.FC = () => {
  // const { data } = useGetAllProductQuery({});
  // console.log("get all products", data?.data);
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getProducts({
        page: pagination.page,
        limit: pagination.limit,
        search: searchValue,
        category: categoryFilter,
        status: statusFilter,
      });
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, searchValue, categoryFilter, statusFilter]);

  const columns: Column<Product>[] = [
    {
      key: "id",
      label: "Product ID",
      render: (value) => (
        <span className="font-mono text-xs text-gray-600">{value}</span>
      ),
    },
    {
      key: "name",
      label: "Product Name",
      sortable: true,
      render: (value, product) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">
            {product.description.length > 60
              ? product.description.slice(0, 60) + "..."
              : product.description}
          </div>
        </div>
      ),
    },
    {
      key: "category.categoryName",
      label: "Category",
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
          {value}
        </span>
      ),
    },
    {
      key: "stockQuantity",
      label: "Stock",
      render: (value, product) => (
        <div className="text-sm">
          <div className="font-medium">{value}</div>
          <div className="text-gray-500 text-xs">
            of {product.totalQuantity}
          </div>
          {product.variants.length > 0 && (
            <div className="text-blue-500 text-xs">
              {product.variants.length} variants
            </div>
          )}
          <div className="text-slate-600 text-xs">
            <span className="font-semibold">{product?.wearHouseLocation}</span>,{product?.wearHouseNo} 
          </div>
        </div>
      ),
    },
    {
      key: "basePrice",
      label: "Base Price",
      render: (value, product) => (
        <div className="text-sm">
          <div className="font-medium">${value.toFixed(2)}</div>
          {product.pricing.length > 0 && (
            <div className="text-gray-500 text-xs">
              ${Math.min(...product.pricing.map((p) => p.price)).toFixed(2)} - $
              {Math.max(...product.pricing.map((p) => p.price)).toFixed(2)}
            </div>
          )}
          {product.discount && (
            <div className="text-red-500 text-xs">
              -{product.discount.percentage}% off
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : value === "inactive"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true,
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, product) => (
        <Link
          href={`/products/${product?.slug}`}
          className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </Link>
      ),
    },
  ];

  const filters = (
    <>
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Categories</option>
        <option value="smartphones">Smartphones</option>
        <option value="laptops">Laptops</option>
        <option value="sneakers">Sneakers</option>
        <option value="fiction-books">Fiction Books</option>
        <option value="garden-tools">Garden Tools</option>
      </select>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="out_of_stock">Out of Stock</option>
      </select>
    </>
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Link href="/products/add-product" className="cursor-pointer">
          <Button className="flex items-center gap-1 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </Link>
      </div>
      <DataTable
        data={products}
        columns={columns}
        searchValue={searchValue}
        onSearch={setSearchValue}
        searchPlaceholder="Search by product name or title..."
        filters={filters}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.totalPages,
          onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Products;
