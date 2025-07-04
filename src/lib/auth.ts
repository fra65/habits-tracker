/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"

export const authOption = {
    providers: [
        GitHub,
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const user = {
                    email: "io@gmail.com",
                    password: "psw123",
                }
        
                // // logic to salt and hash password
                // const pwHash = saltAndHashPassword(credentials.password)
        
                // // logic to verify if the user exists
                // user = await getUserFromDb(credentials.email, pwHash)
        
                if (!user) {
                    throw new Error("Invalid credentials.")
                }
        
                // return user object with their profile data
                return user
            },
        }),        
    ],
    pages: {},

} satisfies NextAuthConfig
 
export const { handlers, signIn, signOut, auth } = NextAuth(authOption)