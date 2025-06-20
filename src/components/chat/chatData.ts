export interface ProductPreview {
  name: string;
  sku: string;
  link: string;
  image: string;
  description?: string;
  video?: string;
}

export interface ChatFile {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface ReplyReference {
  id: string;
  content: string;
  sender: string;
}

export interface ChatReply {
  content: string;
  timestamp: string;
  sender: string;
  files?: ChatFile[];
  replyTo?: ReplyReference;
}

export interface ChatMessageData {
  id: string;
  customerName: string;
  timestamp: string;
  status: "read" | "unread";
  content: string;
  product?: ProductPreview;
  replies?: ChatReply[];
  files?: ChatFile[];
  replyTo?: ReplyReference;
}

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessageData[];
}

export const mockChatUsers: ChatUser[] = [
  {
    id: "1",
    name: "John Smith",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    isOnline: true,
    lastMessage: "Hi, I'm interested in this wireless headphone...",
    lastMessageTime: "2 minutes ago",
    unreadCount: 2,
    messages: [
      {
        id: "1",
        customerName: "John Smith",
        timestamp: "2 minutes ago",
        status: "unread",
        content:
          "Hi, I'm interested in this wireless headphone. Can you tell me more about the battery life and if it supports noise cancellation?",
        product: {
          name: "Wireless Headphones Pro",
          sku: "WHP-001",
          link: "/products/wireless-headphones-pro",
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop",
          description:
            "Premium wireless headphones with active noise cancellation",
        },
        replies: [
          {
            content:
              "Hi John! The Wireless Headphones Pro offers up to 30 hours of battery life and features advanced active noise cancellation. Would you like me to send you more detailed specifications?",
            timestamp: "1 minute ago",
            sender: "admin",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b9a29420?w=40&h=40&fit=crop&crop=face",
    isOnline: false,
    lastMessage: "I received this laptop but it won't turn on...",
    lastMessageTime: "15 minutes ago",
    unreadCount: 1,
    messages: [
      {
        id: "2",
        customerName: "Sarah Johnson",
        timestamp: "15 minutes ago",
        status: "unread",
        content:
          "I received this laptop but it won't turn on. I've tried charging it for several hours. Could you please help?",
        product: {
          name: "Ultra HD Smart Laptop",
          sku: "LAP-002",
          link: "/products/ultra-hd-laptop",
          image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&h=150&fit=crop",
          description: "High-performance laptop with 16GB RAM and 512GB SSD",
        },
        files: [
          {
            name: "laptop_issue.pdf",
            size: 1024000,
            type: "application/pdf",
            url: "https://example.com/laptop_issue.pdf",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Mike Wilson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    isOnline: true,
    lastMessage: "Great! I need about 10 units for our office...",
    lastMessageTime: "30 minutes ago",
    unreadCount: 0,
    messages: [
      {
        id: "3",
        customerName: "Mike Wilson",
        timestamp: "1 hour ago",
        status: "read",
        content:
          "Do you have this coffee machine in stock? I'd like to place a bulk order for my office.",
        product: {
          name: "Premium Coffee Machine",
          sku: "COF-003",
          link: "/products/premium-coffee-machine",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
          description:
            "Professional-grade espresso machine with built-in grinder",
        },
        replies: [
          {
            content:
              "Hi Mike! Yes, we have the Premium Coffee Machine in stock. For bulk orders, I can offer you a 15% discount. How many units are you looking to purchase?",
            timestamp: "45 minutes ago",
            sender: "admin",
          },
          {
            content:
              "Great! I need about 10 units for our office. Can you send me a quote?",
            timestamp: "30 minutes ago",
            sender: "customer",
            files: [
              {
                name: "office_requirements.txt",
                size: 2048,
                type: "text/plain",
                url: "https://example.com/office_requirements.txt",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const mockChatMessages: ChatMessageData[] = [
  {
    id: "1",
    customerName: "John Smith",
    timestamp: "2 minutes ago",
    status: "unread",
    content:
      "Hi, I'm interested in this wireless headphone. Can you tell me more about the battery life and if it supports noise cancellation?",
    product: {
      name: "Wireless Headphones Pro",
      sku: "WHP-001",
      link: "/products/wireless-headphones-pro",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop",
      description: "Premium wireless headphones with active noise cancellation",
    },
    replies: [
      {
        content:
          "Hi John! The Wireless Headphones Pro offers up to 30 hours of battery life and features advanced active noise cancellation. Would you like me to send you more detailed specifications?",
        timestamp: "1 minute ago",
        sender: "admin",
      },
    ],
  },
];
