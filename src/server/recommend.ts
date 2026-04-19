import { eq } from "drizzle-orm";
import { db } from "../db";
import { watchlist } from "../db/schema";

interface toggleWatchlistProps {
  productId: string;
  userId: string;
  isWatched: boolean;
}

export async function toggleWatchlist({productId, userId, isWatched}: toggleWatchlistProps) {
  "use server";
  if (isWatched) {
    await db
      .delete(watchlist)
      .where(eq(watchlist.productId, productId));
  } else {
    await db.insert(watchlist).values({ userId, productId });
  }
}