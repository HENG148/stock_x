import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      {status: 400}
    )
  }

  const result = await db
    .select()
    .from(users)
    .where(sql`${users.email} = ${email}`)
    .limit(1);
  
  const user = result[0];

  if (!user) {
    return NextResponse.json(
      { message: "Account not found. Please register first.", redirect: "/register" },
      { status: 404 }
    )
  }

  if (!user.password) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    )
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    )
  }

  return NextResponse.json(
    { message: "Login successful", user: { id: user.id, name: user.name, email: user.email } },
    { status: 200 }
  )
}