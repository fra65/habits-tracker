/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    username?: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      username?: string | null;
    } & DefaultSession["user"];
  }
}