import { UserRole } from "@/enum";

// permissions.ts
export const rolePermissions: Record<string, string[]> = {
  sales: [
    "/",
    "/products",
    "/orders",
    "/discount",
    "/query",
    "/change-password",
  ],
  accounts: ["/", "/accounts", "/payments", "/query", "/change-password"],
  shipping: ["/", "/orders", "/orders/*", "/query", "/change-password"],
  admin: [
    "/",
    "/orders",
    "/products",
    "/query",
    "/payments",
    "/permission-management",
    "/change-password",
    "/discounts",
    "/countries",
  ], // * means all paths allowed
  super_admin: [
    "/",
    "/orders",
    "/products",
    "/query",
    "/payments",
    "/permission-management",
    "/change-password",
    "/discounts",
  ], // * means all paths allowed
};

export const roleBasedRedirects: Record<UserRole, string> = {
  accounts: "/payments",
  admin: "/",
  super_admin: "/",
  shipping: "/orders",
  sales_marketting: "/",
};
