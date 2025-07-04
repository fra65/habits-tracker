import NextAuth, { NextAuthConfig } from "next-auth"

export const authOption = {
    providers: [],
    pages: {}
} satisfies NextAuthConfig
 
export const { handlers, signIn, signOut, auth } = NextAuth(authOption)