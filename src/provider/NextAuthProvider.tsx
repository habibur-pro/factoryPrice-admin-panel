"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
export type TNextAuthProvider = { children: ReactNode };
const NextAuthProvider = ({ children }: TNextAuthProvider) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;
