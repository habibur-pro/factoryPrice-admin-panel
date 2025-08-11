import { UserRole } from "@/enum";

// permissions.ts
export const rolePermissions: Record<string, string[]> = {
    sales: ["/", "/products", "/orders", "/discount", "/query"],
    accounts: ["/", "/accounts", "/payments", "/query"],
    shipping: ["/","/orders", "/orders/*", "/query"],
    super_admin: ["*"], // * means all paths allowed
    admin: ["/","/orders","/products","/query","/payments"] // * means all paths allowed
  };

  export const roleBasedRedirects: Record<UserRole, string> = {
    accounts: "/payments",
    admin: "/",
    super_admin: "/",
    shipping: "/orders",
    sales_marketting: "/",
  };
  