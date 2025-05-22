"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PieChart as ReChartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

type InventoryItem = {
  id: string;
  name: string;
  category: string;
  inStock: number;
  reorderPoint: number;
  unitPrice: string;
  totalValue: string;
};

const COLORS = ["#2563eb", "#0284c7", "#4f46e5", "#8b5cf6"];

// Mock data for inventory statistics
const inventoryStats = [
  { name: "In Stock", value: 68 },
  { name: "Low Stock", value: 15 },
  { name: "Out of Stock", value: 7 },
  { name: "On Order", value: 10 },
];

const Inventory = () => {
  // Mock inventory data
  const [inventoryItems] = useState<InventoryItem[]>([
    {
      id: "SKU001",
      name: "Wireless Headphones Pro",
      category: "Electronics",
      inStock: 125,
      reorderPoint: 20,
      unitPrice: "$249.99",
      totalValue: "$31,248.75",
    },
    {
      id: "SKU002",
      name: 'Ultra HD Smart TV 55"',
      category: "Electronics",
      inStock: 42,
      reorderPoint: 10,
      unitPrice: "$899.99",
      totalValue: "$37,799.58",
    },
    {
      id: "SKU003",
      name: "Premium Coffee Machine",
      category: "Home Appliances",
      inStock: 8,
      reorderPoint: 10,
      unitPrice: "$349.99",
      totalValue: "$2,799.92",
    },
    {
      id: "SKU004",
      name: "Ergonomic Office Chair",
      category: "Furniture",
      inStock: 0,
      reorderPoint: 5,
      unitPrice: "$299.99",
      totalValue: "$0.00",
    },
    {
      id: "SKU005",
      name: "Professional DSLR Camera",
      category: "Photography",
      inStock: 15,
      reorderPoint: 5,
      unitPrice: "$1,299.99",
      totalValue: "$19,499.85",
    },
    {
      id: "SKU006",
      name: "Smartphone X Pro",
      category: "Electronics",
      inStock: 3,
      reorderPoint: 8,
      unitPrice: "$999.99",
      totalValue: "$2,999.97",
    },
    {
      id: "SKU007",
      name: "Mechanical Keyboard",
      category: "Computer Accessories",
      inStock: 78,
      reorderPoint: 15,
      unitPrice: "$149.99",
      totalValue: "$11,699.22",
    },
    {
      id: "SKU008",
      name: "Fitness Smartwatch",
      category: "Wearables",
      inStock: 32,
      reorderPoint: 10,
      unitPrice: "$199.99",
      totalValue: "$6,399.68",
    },
  ]);

  const getStockStatus = (item: InventoryItem) => {
    if (item.inStock === 0) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          Out of Stock
        </Badge>
      );
    } else if (item.inStock < item.reorderPoint) {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
          Low Stock
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          In Stock
        </Badge>
      );
    }
  };

  const getStockPercentage = (item: InventoryItem) => {
    // Assuming the target stock level is 3x the reorder point
    const targetStock = item.reorderPoint * 3;
    const percentage = Math.min(
      Math.round((item.inStock / targetStock) * 100),
      100
    );
    return percentage;
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col space-y-4">
              <div>
                <div className="text-3xl font-bold">1,428</div>
                <p className="text-sm text-muted-foreground">
                  Total Items in Inventory
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold">$245,890.56</div>
                <p className="text-sm text-muted-foreground">
                  Total Inventory Value
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold">38</div>
                <p className="text-sm text-muted-foreground">
                  Items to Reorder
                </p>
              </div>
            </div>
            <div className="w-full max-w-[280px] h-[280px] mx-auto md:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <ReChartsPieChart>
                  <Pie
                    data={inventoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {inventoryStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </ReChartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryItems
                .filter((item) => item.inStock < item.reorderPoint)
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border rounded-lg bg-amber-50 border-amber-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          SKU: {item.id}
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                        {item.inStock} left
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Reorder point: {item.reorderPoint}</span>
                        <span>Current: {item.inStock}</span>
                      </div>
                      <Progress
                        value={(item.inStock / item.reorderPoint) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center w-full max-w-md relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search inventory..." className="pl-10" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button>Export Data</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-1">
                    SKU
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Product Name
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Stock Level
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div className="w-full">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{item.inStock} in stock</span>
                        <span>{getStockPercentage(item)}%</span>
                      </div>
                      <Progress
                        value={getStockPercentage(item)}
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.unitPrice}</TableCell>
                  <TableCell>{item.totalValue}</TableCell>
                  <TableCell>{getStockStatus(item)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
