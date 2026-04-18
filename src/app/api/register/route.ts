import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  console.log("Register attempt:", { name, email });

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  console.log("Existing user check:", existing)

  if (existing[0]) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const inserted = await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    role: "customer",
  }).returning();
  console.log("Inserted user:", inserted)

  return NextResponse.json(
    { message: "Account created successfully" },
    { status: 201 }
  );
}