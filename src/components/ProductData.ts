export interface Product {
  id: string;
  name: string;
  sku: string;
  basePrice: number;
  category: string;
  isPopular?: boolean;
  rating?: number;
  variants: {
    color: string;
    sizes: { size: string; stock: number }[];
  }[];
  image: string;
  description?: string;
}

// Enhanced mock products data
export const mockProducts: Product[] = [
  {
    id: "PROD001",
    name: "Premium Cotton T-Shirt",
    sku: "CT-001",
    basePrice: 25.99,
    category: "Apparel",
    isPopular: true,
    rating: 4.8,
    description: "Soft, breathable cotton blend perfect for everyday wear",
    variants: [
      {
        color: "Midnight Black",
        sizes: [
          { size: "S", stock: 50 },
          { size: "M", stock: 30 },
          { size: "L", stock: 20 },
          { size: "XL", stock: 15 },
          { size: "XXL", stock: 8 },
        ],
      },
      {
        color: "Pure White",
        sizes: [
          { size: "S", stock: 40 },
          { size: "M", stock: 25 },
          { size: "L", stock: 18 },
          { size: "XL", stock: 12 },
        ],
      },
      {
        color: "Navy Blue",
        sizes: [
          { size: "S", stock: 35 },
          { size: "M", stock: 22 },
          { size: "L", stock: 16 },
        ],
      },
    ],
    image: "/placeholder.svg",
  },
  {
    id: "PROD002",
    name: "Classic Denim Jeans",
    sku: "DJ-002",
    basePrice: 79.99,
    category: "Apparel",
    rating: 4.6,
    description: "Timeless straight-cut jeans with premium denim",
    variants: [
      {
        color: "Dark Blue",
        sizes: [
          { size: "28", stock: 12 },
          { size: "30", stock: 18 },
          { size: "32", stock: 25 },
          { size: "34", stock: 20 },
          { size: "36", stock: 15 },
        ],
      },
      {
        color: "Light Blue",
        sizes: [
          { size: "30", stock: 10 },
          { size: "32", stock: 15 },
          { size: "34", stock: 12 },
        ],
      },
    ],
    image: "/placeholder.svg",
  },
  {
    id: "PROD003",
    name: "Wireless Bluetooth Headphones",
    sku: "WH-003",
    basePrice: 129.99,
    category: "Electronics",
    isPopular: true,
    rating: 4.9,
    description: "High-quality sound with active noise cancellation",
    variants: [
      {
        color: "Jet Black",
        sizes: [{ size: "One Size", stock: 45 }],
      },
      {
        color: "Pearl White",
        sizes: [{ size: "One Size", stock: 30 }],
      },
      {
        color: "Rose Gold",
        sizes: [{ size: "One Size", stock: 20 }],
      },
    ],
    image: "/placeholder.svg",
  },
  {
    id: "PROD004",
    name: "Athletic Running Shoes",
    sku: "RS-004",
    basePrice: 89.99,
    category: "Footwear",
    rating: 4.7,
    description: "Lightweight running shoes with superior cushioning",
    variants: [
      {
        color: "Black/White",
        sizes: [
          { size: "7", stock: 8 },
          { size: "8", stock: 15 },
          { size: "9", stock: 20 },
          { size: "10", stock: 18 },
          { size: "11", stock: 12 },
          { size: "12", stock: 6 },
        ],
      },
      {
        color: "Blue/Gray",
        sizes: [
          { size: "8", stock: 10 },
          { size: "9", stock: 15 },
          { size: "10", stock: 12 },
        ],
      },
    ],
    image: "/placeholder.svg",
  },
  {
    id: "PROD005",
    name: "Leather Wallet",
    sku: "LW-005",
    basePrice: 34.99,
    category: "Accessories",
    rating: 4.5,
    description: "Genuine leather bifold wallet with RFID protection",
    variants: [
      {
        color: "Brown",
        sizes: [{ size: "Standard", stock: 25 }],
      },
      {
        color: "Black",
        sizes: [{ size: "Standard", stock: 30 }],
      },
    ],
    image: "/placeholder.svg",
  },
];
