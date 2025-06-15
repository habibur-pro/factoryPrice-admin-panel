export enum tagTypes {
  USER = "user",
  AUTH = "auth",
  CATEGORY = "category",
  SUBCATEGORY = "subcategory",
  PRODUCT = "product",
  ORDER = "order",
  ADDRESSES = "addresses",
  TIMELINE = "timeline",
}

// Automatically derive the list from the enum
export const tagTypeList = Object.values(tagTypes);
