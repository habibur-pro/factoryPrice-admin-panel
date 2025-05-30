import { z } from "zod";
export const productSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().min(1, { message: "Subcategory is required" }),
  // basePrice: z.number().positive({ message: "Base price must be positive" }),
  minOrderQuantity: z
    .number()
    .positive({ message: "minOrderQuantity must be positive" }),
  description: z.string().min(1, { message: "Description is required" }),

  isActive: z.boolean().default(false),
});
export type ProductFormValues = z.infer<typeof productSchema>;
