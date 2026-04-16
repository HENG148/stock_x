import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password"}
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1)
        
        if (!user[0]) return null;
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user[0].password!
        );
        if (!passwordMatch) return null;
        return user[0]
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login'
  }
})