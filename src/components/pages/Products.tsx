"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Trash, Edit, Eye } from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
};

const Products = () => {
  // Mock product data
  const [products] = useState<Product[]>([
    {
      id: "PRD-001",
      name: "Wireless Headphones Pro",
      category: "Electronics",
      price: "$249.99",
      stock: 125,
      status: "in-stock",
    },
    {
      id: "PRD-002",
      name: 'Ultra HD Smart TV 55"',
      category: "Electronics",
      price: "$899.99",
      stock: 42,
      status: "in-stock",
    },
    {
      id: "PRD-003",
      name: "Premium Coffee Machine",
      category: "Home Appliances",
      price: "$349.99",
      stock: 8,
      status: "low-stock",
    },
    {
      id: "PRD-004",
      name: "Ergonomic Office Chair",
      category: "Furniture",
      price: "$299.99",
      stock: 0,
      status: "out-of-stock",
    },
    {
      id: "PRD-005",
      name: "Professional DSLR Camera",
      category: "Photography",
      price: "$1,299.99",
      stock: 15,
      status: "in-stock",
    },
    {
      id: "PRD-006",
      name: "Smartphone X Pro",
      category: "Electronics",
      price: "$999.99",
      stock: 3,
      status: "low-stock",
    },
    {
      id: "PRD-007",
      name: "Mechanical Keyboard",
      category: "Computer Accessories",
      price: "$149.99",
      stock: 78,
      status: "in-stock",
    },
    {
      id: "PRD-008",
      name: "Fitness Smartwatch",
      category: "Wearables",
      price: "$199.99",
      stock: 32,
      status: "in-stock",
    },
  ]);

  const getStockBadge = (status: Product["status"]) => {
    switch (status) {
      case "in-stock":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            In Stock
          </Badge>
        );
      case "low-stock":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            Low Stock
          </Badge>
        );
      case "out-of-stock":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Out of Stock
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search products..." className="pl-10" />
        </div>
        <Link href="/products/add-product" className="cursor-pointer">
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{getStockBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Products;
