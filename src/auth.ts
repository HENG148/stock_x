import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig ={
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
        const result = await db
          .select()
          .from(users)
          .where(sql`${users.email} = ${email}`)
          .limit(1);
        
        const user = result[0]
        console.log("1. User found:", user ? "YES" : "NO");
        console.log("2. User role:", user?.role);
        console.log("3. User email:", user?.email);
        if (!user) return null;
        
        const isValid = await bcrypt.compare(password as string, user.password as string ?? "");
        console.log("Password from DB:", user.password);
        console.log("Password entered:", password);
        console.log("4. Password valid:", isValid);
        if (!isValid) return null;
        
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role ?? "customer",
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
      if (user) {
        token.id = user.id;
        token.role = (user.role as string) ?? "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)