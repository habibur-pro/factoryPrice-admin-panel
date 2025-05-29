import {
  User,
  Product,
  Order,
  PaginationResponse,
  Variant,
  Subcategory,
  Discount,
  OrderItem,
  Payment,
  ShippingAddress,
  CartVariant,
} from "@/types/schemas";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Demo data
const demoSubcategories: Subcategory[] = [
  { _id: "674a1b2c3d4e5f6789012380", name: "Smartphones", slug: "smartphones" },
  { _id: "674a1b2c3d4e5f6789012381", name: "Laptops", slug: "laptops" },
  { _id: "674a1b2c3d4e5f6789012382", name: "Sneakers", slug: "sneakers" },
  {
    _id: "674a1b2c3d4e5f6789012383",
    name: "Fiction Books",
    slug: "fiction-books",
  },
  {
    _id: "674a1b2c3d4e5f6789012384",
    name: "Garden Tools",
    slug: "garden-tools",
  },
];

const demoVariants: Variant[] = [
  {
    _id: "674a1b2c3d4e5f6789012390",
    id: "VAR001",
    color: "Space Black",
    sizes: [
      { size: "128GB", quantity: 8 },
      { size: "256GB", quantity: 6 },
      { size: "512GB", quantity: 4 },
    ],
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
  {
    _id: "674a1b2c3d4e5f6789012391",
    id: "VAR002",
    color: "Silver",
    sizes: [
      { size: "128GB", quantity: 5 },
      { size: "256GB", quantity: 7 },
      { size: "512GB", quantity: 3 },
    ],
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
];

const demoDiscounts: Discount[] = [
  {
    _id: "674a1b2c3d4e5f6789012395",
    percentage: 20,
    validUntil: "2024-12-31T23:59:59Z",
    type: "seasonal",
  },
];

const demoUsers: User[] = [
  {
    _id: "674a1b2c3d4e5f6789012345",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1-555-0123",
    role: "customer",
    status: "active",
    country: "United States",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
    },
  },
  {
    _id: "674a1b2c3d4e5f6789012346",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "+1-555-0124",
    role: "customer",
    status: "active",
    country: "Canada",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
];

const demoProducts: Product[] = [
  {
    _id: "674a1b2c3d4e5f6789012350",
    id: "PROD001",
    name: "iPhone 15 Pro",
    description: "Latest iPhone with A17 Pro chip and titanium design.",
    slug: "iphone-15-pro",
    category: demoSubcategories[0],
    title: "Apple iPhone 15 Pro - Premium Smartphone",
    variants: [demoVariants[0], demoVariants[1]],
    totalQuantity: 100,
    stockQuantity: 45,
    minOrderQuantity: 1,
    images: ["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400"],
    basePrice: 999.99,
    pricing: [
      { minQuantity: 1, maxQuantity: 5, price: 999.99 },
      { minQuantity: 6, maxQuantity: 20, price: 949.99 },
    ],
    status: "active",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
  {
    _id: "674a1b2c3d4e5f6789012351",
    id: "PROD002",
    name: "MacBook Air M3",
    description: "Ultra-thin laptop with M3 chip.",
    slug: "macbook-air-m3",
    category: demoSubcategories[1],
    title: "Apple MacBook Air M3 - Ultra-Portable Laptop",
    variants: [],
    totalQuantity: 50,
    stockQuantity: 30,
    minOrderQuantity: 1,
    images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400"],
    basePrice: 1199.99,
    pricing: [{ minQuantity: 1, maxQuantity: 3, price: 1199.99 }],
    status: "active",
    createdAt: "2024-01-11T10:30:00Z",
    updatedAt: "2024-01-11T10:30:00Z",
  },
];

const demoPayments: Payment[] = [
  {
    _id: "674a1b2c3d4e5f6789012400",
    method: "Credit Card",
    transactionId: "txn_1234567890",
    status: "completed",
  },
  {
    _id: "674a1b2c3d4e5f6789012401",
    method: "PayPal",
    transactionId: "pp_9876543210",
    status: "completed",
  },
];

const demoShippingAddresses: ShippingAddress[] = [
  {
    _id: "674a1b2c3d4e5f6789012410",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
  },
  {
    _id: "674a1b2c3d4e5f6789012411",
    street: "789 Maple Street",
    city: "Toronto",
    state: "ON",
    postalCode: "M5V 3A8",
    country: "Canada",
  },
];

const demoOrderItems: OrderItem[] = [
  {
    _id: "item1",
    id: "OI001",
    productId: "674a1b2c3d4e5f6789012350",
    product: demoProducts[0],
    itemVariants: [
      {
        color: "Space Black",
        sizes: [{ size: "256GB", quantity: 1 }],
      },
    ],
    totalQuantity: 1,
    perUnitPrice: 999.99,
    totalPrice: 999.99,
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    _id: "item2",
    id: "OI002",
    productId: "674a1b2c3d4e5f6789012351",
    product: demoProducts[1],
    itemVariants: [],
    totalQuantity: 1,
    perUnitPrice: 1199.99,
    totalPrice: 1199.99,
    createdAt: "2024-01-21T15:45:00Z",
    updatedAt: "2024-01-21T15:45:00Z",
  },
  {
    _id: "item3",
    id: "OI003",
    productId: "674a1b2c3d4e5f6789012350",
    product: demoProducts[0],
    itemVariants: [
      {
        color: "Silver",
        sizes: [{ size: "128GB", quantity: 2 }],
      },
    ],
    totalQuantity: 2,
    perUnitPrice: 999.99,
    totalPrice: 1999.98,
    createdAt: "2024-01-22T08:20:00Z",
    updatedAt: "2024-01-22T08:20:00Z",
  },
];

const demoOrders: Order[] = [
  {
    _id: "674a1b2c3d4e5f6789012355",
    id: "ORD001",
    orderName: "Order #ORD001 - iPhone 15 Pro",
    userId: "674a1b2c3d4e5f6789012345",
    user: demoUsers[0],
    subtotal: 999.99,
    discount: 0,
    shippingCharge: 25.0,
    total: 1024.99,
    items: [demoOrderItems[0]],
    status: "delivered",
    paymentId: "674a1b2c3d4e5f6789012400",
    payment: demoPayments[0],
    paymentStatus: "completed",
    shippingAddress: demoShippingAddresses[0],
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-22T14:20:00Z",
  },
  {
    _id: "674a1b2c3d4e5f6789012356",
    id: "ORD002",
    orderName: "Order #ORD002 - MacBook Air M3",
    userId: "674a1b2c3d4e5f6789012346",
    user: demoUsers[1],
    subtotal: 1199.99,
    discount: 50.0,
    shippingCharge: 30.0,
    total: 1179.99,
    items: [demoOrderItems[1]],
    status: "shipped",
    paymentId: "674a1b2c3d4e5f6789012401",
    payment: demoPayments[1],
    paymentStatus: "completed",
    shippingAddress: demoShippingAddresses[1],
    createdAt: "2024-01-21T15:45:00Z",
    updatedAt: "2024-01-23T09:10:00Z",
  },
  {
    _id: "674a1b2c3d4e5f6789012357",
    id: "ORD003",
    orderName: "Order #ORD003 - iPhone 15 Pro Bundle",
    userId: "674a1b2c3d4e5f6789012345",
    user: demoUsers[0],
    subtotal: 1999.98,
    discount: 100.0,
    shippingCharge: 0.0,
    total: 1899.98,
    items: [demoOrderItems[2]],
    status: "processing",
    paymentId: "674a1b2c3d4e5f6789012400",
    payment: demoPayments[0],
    paymentStatus: "pending",
    shippingAddress: demoShippingAddresses[0],
    createdAt: "2024-01-22T08:20:00Z",
    updatedAt: "2024-01-22T08:20:00Z",
  },
];

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For demo purposes, we'll return mock data instead of making real requests
    console.log(`Demo API call to: ${endpoint}`);
    throw new Error("Demo mode - this should be handled by specific methods");
  }

  // Customers API
  async getCustomers(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    } = {}
  ): Promise<PaginationResponse<User>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredUsers = [...demoUsers];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (params.status) {
      filteredUsers = filteredUsers.filter(
        (user) => user.status === params.status
      );
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filteredUsers.slice(start, end),
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
      },
    };
  }

  async getCustomer(id: string): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const customer = demoUsers.find((user) => user._id === id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  }

  async getCustomerOrders(id: string): Promise<Order[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return demoOrders.filter((order) => order.userId === id);
  }

  // Products API
  async getProducts(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      status?: string;
    } = {}
  ): Promise<PaginationResponse<Product>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredProducts = [...demoProducts];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.title.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (params.category) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.slug === params.category ||
          product.category.name.toLowerCase() === params.category.toLowerCase()
      );
    }

    // Apply status filter
    if (params.status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === params.status
      );
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filteredProducts.slice(start, end),
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
      },
    };
  }

  async getProduct(id: string): Promise<Product> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const product = demoProducts.find((product) => product._id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  // Orders API
  async getOrder(id: string): Promise<Order> {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const order = demoOrders.find((order) => order._id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  async getOrders(
    params: {
      page?: number;
      limit?: number;
      status?: string;
    } = {}
  ): Promise<PaginationResponse<Order>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredOrders = [...demoOrders];

    // Apply status filter
    if (params.status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === params.status
      );
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      data: filteredOrders.slice(start, end),
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit),
      },
    };
  }
}

export const apiClient = new ApiClient();
