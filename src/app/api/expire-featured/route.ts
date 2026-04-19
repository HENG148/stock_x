import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { and, eq, isNotNull, lt } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const expired = await db
    .update(products)
    .set({ isFeatured: false })
    .where(
      and(
        eq(products.isFeatured, true),
        isNotNull(products.featuredUntil),
        lt(products.featuredUntil, now)
    )
  )
    .returning({ id: products.id, name: products.name })
  
  return NextResponse.json({
    message: `${expired.length} products expired`,
    expired
  })
}