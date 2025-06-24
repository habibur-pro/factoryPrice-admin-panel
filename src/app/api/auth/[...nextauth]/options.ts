/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOption: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // LinkedInProvider({
    //   clientId: process.env.LINKEDIN_CLIENT_ID!,
    //   clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    // }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "email",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const baseurl = process.env.NEXT_PUBLIC_API_URL;
        try {
          const res = await fetch(`${baseurl}/auth/sign-in`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });
          if (!res.ok) {
            throw new Error("user not found");
          }
          const result = await res.json();
          if (!result.data) {
            throw new Error("user not found");
          }
          const user = result.data;
          return user;
        } catch (error: any) {
          throw new Error(error?.message || "user not found");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (
        account?.provider === "google" ||
        account?.provider === "github" ||
        account?.provider === "facebook"
      ) {
        if (user) {
          try {
            const baseurl = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch(`${baseurl}/auth/auto-sign-in`, {
              method: "POST",
              body: JSON.stringify(user),
              headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) {
              return false;
            }
            const result = await res.json();
            console.log("result google login", result);
            user.id = result.data.id;
            user.accessToken = result.data.accessToken;
            user.name = result.data.name;
            return true;
          } catch {
            return false;
          }
        }
        return false;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.photo = user.photo;
        token.accessToken = user.accessToken;
      }
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.photo = token.photo as string;
        session.user.name = token.name as string;
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
