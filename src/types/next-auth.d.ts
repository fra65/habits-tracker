import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: number | string;
    role?: "USER" | "ADMIN" | "MODERATOR";
    username?: string | null;
  }

  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: number | string;
      role?: "USER" | "ADMIN" | "MODERATOR";
      username?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number | string;
    role?: "USER" | "ADMIN" | "MODERATOR";
    username?: string | null;
  }
}
