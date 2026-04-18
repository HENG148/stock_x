import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig =({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) return null;
        // if (!credentials?.email || !credentials?.password) return null;
        const result = await db
          .select()
          .from(users)
          // .where(eq(users.email, credentials.email!))
          .where(sql`${users.email} = ${email}`)
          .limit(1);
        
        const user = result[0]
        if (!user) return null;

        const isValid = await bcrypt.compare(password as string, user.password as string ?? "");
        if (!isValid) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export const {handlers, auth, signIn, signOut} = NextAuth(authConfig)