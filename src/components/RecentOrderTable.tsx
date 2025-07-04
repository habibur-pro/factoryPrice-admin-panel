import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IOrder } from "@/types";
import { Order } from "@/types/schemas";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

// type Order = {
//   id: string;
//   customer: string;
//   date: string;
//   total: number;
//   status: OrderStatus;
//   user?: User;
//   createdAt: Date;
//   updatedAt: Date;
// };

type RecentOrdersTableProps = {
  orders: IOrder[];
  className?: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const RecentOrdersTable = ({ orders, className }: RecentOrdersTableProps) => {
  return (
    <div className={`overflow-hidden rounded-lg border bg-card ${className}`}>
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold text-lg">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              {/* <TableHead className="text-right">Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  {order?.user?.firstName}
                  {order?.user?.lastName}
                </TableCell>
                <TableCell>
                  {new Date(order?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusColors[order.status]}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </TableCell>
                {/* <TableCell className="text-right">
                  <Select defaultValue="view">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View</SelectItem>
                      <SelectItem value="edit">Edit</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default RecentOrdersTable;
