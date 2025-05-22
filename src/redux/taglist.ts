export enum tagTypes {
  USER = "user",
  AUTH = "auth",
}

// Automatically derive the list from the enum
export const tagTypeList = Object.values(tagTypes);
