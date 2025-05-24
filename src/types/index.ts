import { DiscountStatus } from "@/enum";

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
