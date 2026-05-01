import { db } from "@/src/db";
import { verificationTokens } from "@/src/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const token = await db
    .select()
    .from(verificationTokens)
    .where(sql`${verificationTokens.email} = ${email} AND ${verificationTokens.code} = ${code}`)
    .limit(1)
    .then(r => r[0]);
  
  if (!token) {
    return NextResponse.json({ message: "Invalid code" }, { status: 400 });
  }
  if (new Date() > token.expiresAt) {
    return NextResponse.json({ message: "Code expired" }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}