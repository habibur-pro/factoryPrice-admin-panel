export enum tagTypes {
  USER = "user",
  AUTH = "auth",
  CATEGORY = "category",
  SUBCATEGORY = "subcategory",
  PRODUCT = "product",
  ORDER = "order",
  ADDRESSES = "addresses",
  TIMELINE = "timeline",
  CHAT = "chat",
  REPORT = "report",
  PAYMENT = "payment",
  DISCOUNT = "discount",
  COUNTRY = "country",
}

// Automatically derive the list from the enum
export const tagTypeList = Object.values(tagTypes);
