export enum DiscountStatus {
  UPCOMING = "upcoming",
  ACTIVE = "active",
  EXPIRED = "expired",
  DISABLED = "disabled",
}
export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
  COMING_SOON = "coming_soon",
}

export enum PaymentStatus {
  pending = "pending",
  paid = "paid",
  unpaid = "unpaid",
  failed = "failed",
  refunded = "refunded",
  expired = "expired",
  canceled = "canceled",
}
export enum OrderStatus {
  Pending = "pending",
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
  Refunded = "refunded",
  Failed = "failed",
}

export enum ProductVariantType {
  NO_VARIANT = "no_variant",
  DOUBLE_VARIANT = "double_variant",
}

export enum UserRole {
  admin = "admin",
  super_admin = "super_admin",
  sales_marketting = "sales_marketting",
  shipping = "shipping",
  accounts = "accounts",
}
