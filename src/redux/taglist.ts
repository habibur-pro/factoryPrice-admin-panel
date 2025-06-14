export enum tagTypes {
  USER = "user",
  AUTH = "auth",
  CATEGORY = "category",
  SUBCATEGORY = "subcategory",
  PRODUCT = "product",
}

// Automatically derive the list from the enum
export const tagTypeList = Object.values(tagTypes);
