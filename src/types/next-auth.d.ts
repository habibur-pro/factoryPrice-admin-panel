// Create this file: src/types/next-auth.d.ts
import { UserRole } from "@/enum";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      accessToken?: string;
      photo?: string;
      role:UserRole
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    accessToken?: string;
    photo?: string;
    role:UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    accessToken?: string;
    photo?: string;
    role:UserRole
  }
}
