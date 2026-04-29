'use server'

import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { watchlist } from "../db/schema";

interface toggleWatchlistProps {
  productId: string;
  userId: string;
  isWatched: boolean;
}

export async function toggleWatchlist({productId, userId, isWatched}: toggleWatchlistProps) {
  if (isWatched) {
    await db
      .delete(watchlist)
      .where(
        and(
          eq(watchlist.productId, productId),
          eq(watchlist.userId, userId),
        )
      );
  } else {
    const existing = await db
      .select()
      .from(watchlist)
      .where(
        and(
          eq(watchlist.productId, productId),
          eq(watchlist.userId, userId)
      )
    )
    .limit(1)
    if (existing.length === 0) {
      await db.insert(watchlist).values({ userId, productId });
    }
  }
}