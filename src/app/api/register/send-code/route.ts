import { db } from "@/src/db";
import { users, verificationTokens } from "@/src/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name } = await req.json();

  const existing = await db
    .select()
    .from(users)
    .where(sql`${users.email} = ${email}`)
    .limit(1)
    .then(r => r[0]);

  if (existing) {
    return NextResponse.json({ message: "Email already registered" }, { status: 400 });
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.delete(verificationTokens)
    .where(sql`${verificationTokens.email} = ${email}`);

  await db.insert(verificationTokens).values({ email, code, expiresAt });

  await resend.emails.send({
    from: "StockX <onboarding@resend.dev>",
    to: email,
    subject: "Your StockX verification code",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; font-weight: 800; color: #111;">Welcome to StockX 👟</h1>
        <p style="color: #555; margin-top: 8px;">Hi ${name}, here's your verification code:</p>
        <div style="margin: 24px 0; text-align: center;">
          <span style="font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #111;">${code}</span>
        </div>
        <p style="color: #999; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}