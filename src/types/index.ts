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
  slug?: string;
  category: ICategory;
  variants: Array<IVariant>;
  specs: Array<{
    group: string;
    key: string;
    value: string;
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
