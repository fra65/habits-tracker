import NextAuth, { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"

export const authOption = {
    providers: [
        GitHub
    ],
    pages: {}
} satisfies NextAuthConfig
 
export const { handlers, signIn, signOut, auth } = NextAuth(authOption)