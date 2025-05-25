import { DiscountStatus, ProductStatus } from "@/enum";

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
  group: string;
  label: string;
  value: string;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  id: string;
  name: string;
  title: string;
  description?: string;
  slug?: string;
  category: ICategory;
  variants: Array<IVariant>;
  basePrice: number;
  pricing: Array<{ minQuantity: number; maxQuantity: number; price: number }>;
  totalQuantity: number;
  stockQuantity: number;
  minOrderQuantity: number;
  images?: Array<string>;
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
