export enum tagTypes {
  USER = "user",
  AUTH = "auth",
  CATEGORY = "category",
  SUBCATEGORY = "subcategory",
}

// Automatically derive the list from the enum
export const tagTypeList = Object.values(tagTypes);
