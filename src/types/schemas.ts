export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: "customer" | "admin";
  status: "active" | "inactive";
  country?: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface PriceRange {
  minQuantity: number;
  maxQuantity: number;
  price: number;
}

export interface Size {
  size: string;
  quantity: number;
}

export interface Variant {
  _id: string;
  id: string;
  color: string;
  sizes: Size[];
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
}

export interface Discount {
  _id: string;
  percentage: number;
  validUntil: string;
  type: string;
}

export interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  wearHouseNo: string;
  wearHouseLocation: string;
  slug: string;
  category: Subcategory;
  title: string;
  variants: Variant[];
  discountId?: string;
  discount?: Discount;
  totalQuantity: number;
  stockQuantity: number;
  minOrderQuantity: number;
  images: string[];
  basePrice: number;
  pricing: PriceRange[];
  status: "active" | "inactive" | "out_of_stock";
  createdAt: string;
  updatedAt: string;
}

export interface CartVariant {
  color: string;
  sizes: Array<{
    size: string;
    quantity: number;
  }>;
}

export interface OrderItem {
  _id: string;
  id: string;
  productId: string;
  product?: Product;
  itemVariants: CartVariant[];
  totalQuantity: number;
  perUnitPrice: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  method: string;
  transactionId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
}

export interface ShippingAddress {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  id: string;
  orderName: string;
  userId: string;
  user?: User;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  total: number;
  items: OrderItem[];
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentId: string;
  payment?: Payment;
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  shippingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
