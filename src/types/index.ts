import {
  DiscountStatus,
  OrderStatus,
  PaymentStatus,
  ProductStatus,
} from "@/enum";

export interface IDiscount {
  id: string;
  discountType: string;
  discountValue: number;
  startDate: Date;
  endDate: Date;
  description: string;
  status: DiscountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id:string;
  id: string;
  categoryName: string;
  slug: string;
  icon: string;
  discountId: string;
  discount: IDiscount | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubcategory {
  id: string;
  categoryName: string;
  slug: string;
  icon: string;
  discountId: string;
  discount: IDiscount | null;
  parentCategoryId: string;
  parentCategory: ICategory | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface ICategory {
  id: string;
  categoryName: string;
  slug: string;
  icon: string;
  discountId: string;
  // discount: Types.ObjectId;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IVariant {
  id: string;
  color: string;
  sizes: [
    {
      size: string;
      quantity: number;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  id: string;
  name: string;
  sku: string;
  title: string;
  description?: string;
  wearHouseNo:string;
  wearHouseLocation:string;
  slug?: string;
  category: ICategory;
  variants: Array<IVariant>;
  specs: Array<{
    group: string;
    properties: [{ key: string; value: string }];
  }>;
  basePrice: number;
  pricing: Array<{ minQuantity: number; maxQuantity: number; price: number }>;
  totalQuantity: number;
  stockQuantity: number;
  minOrderQuantity: number;
  images: Array<string>;
  discountId?: string;
  discount?: IDiscount;
  status: ProductStatus;
  videoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDiscount {
  id: string;
  discountType: string;
  discountValue: number;
  startDate: Date;
  endDate: Date;
  description: string;
  status: DiscountStatus;
  createdAt: Date;
  updatedAt: Date;
}
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  country: string;
  companyName: string;
  address: string;
  status: "active" | "inactive";
  role: IRole;
  photo?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface IRole {
  id: string;
  roleName: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface IShippingAddress {
  id: string;
  userId: string;
  user: IUser;
  country: string;
  fullName: string;
  email:string;
  phoneNumber: string;
  dialCode: string;
  streetAddress: string;
  apartment: string;
  state: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ICountry = {
  countryName: string;
  code: string;
  dialCode: string;
};
export interface IOrder {
  id: string;
  orderName: string;
  userId: string;
  user: IUser;
  subtotal: number;
  discount: number;
  shippingCharge: number;
  total: number;
  items: Array<IOrderItem>;
  status: OrderStatus;
  paymentId: string;
  payment: IPayment;
  paymentStatus: PaymentStatus;
  shippingAddressId: string;
  shippingAddress: IShippingAddress;
  totalQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  productId: string;
  product: IProduct;
  productName: string;
  productSlug: string;
  itemVariants: Array<ICartVariant>;
  totalQuantity: number;
  perUnitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface IPayment {
  id: string;
  orderId: string;
  order: IOrder;
  userId: string;
  user: IUser;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId: string;
  paymentGateway: string;
  description: string;
  refImage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShippingAddress {
  id: string;
  userId: string;
  user: IUser;
  country: string;
  fullName: string;
  phoneNumber: string;
  dialCode: string;
  streetAddress: string;
  apartment: string;
  state: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface ICartVariant {
  color: string;
  sizes: [
    {
      size: string;
      quantity: string;
    }
  ];
}
export interface IOrderTimeline {
  id: string;
  orderId: string;
  order: IOrder;
  status: string;
  note: string;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatSession {
  id: string;
  productId: string;
  product: IProduct;
  senderId: string;
  senderName: string;
  senderPhone: string;
  senderCountryCode:string;
  senderCountry:string;
  senderEmail:string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

export interface IReport {
  sellChart: Array<{
    sales: number;
    date: string;
    orders: number;
  }>;
  totalSell: number;
  recentOrders: Array<IOrder>;
  totalOrders: number;
  totalCustomers: number;
  totalInventoryValue: number;
  topSellingProducts: Array<{
    sku: string;
    slug: string;
    id: string;
    totalSold: number;
    productName: string;
    stockPercentage: number;
  }>;
  recentPayments: Array<IPayment>;
}

export interface IChat {
  id: string;
  sessionId: string;
  senderId: string;
  sender: IUser;
  receiverId: string;
  receiver: IUser;
  content: string;
  files: Array<{
    filename: string;
    extension: string;
    size: number;
    url: string;
  }>;
  replyTo: string;
  replies: Array<IChat>;
  product: IChatProduct;
  createdAt: Date;
}
export interface IChatProduct {
  productId: string;
  productName: string;
  image: string;
  slug: string;
  sku: string;
}
