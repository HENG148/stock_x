import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { products, watchlist } from "@/src/db/schema";
import { and, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { EmptyState } from "../EmptyState";
import { ProductCard } from "../ProductCard";

export async function RecommendedSection() {
  const session = await auth();
  const userId = session?.user?.id;

  const recommended = await db
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      imageUrl: products.imageUrl,
      lowestAsk: products.lowestAsk,
    })
    .from(products)
    // .where(eq(products.isFeatured, true))
    .where(
      and(
        eq(products.isFeatured, true),
        or(
          isNull(products.featuredUntil),
          gt(products.featuredUntil, new Date())
        )
      )
    )
    .limit(12);
  
  let watchedIds = new Set<string>();
  if (userId && recommended.length > 0) {
    const ids = recommended.map((p) => p.id);
    const watched = await db
      .select({ productId: watchlist.productId })
      .from(watchlist)
      .where(inArray(watchlist.productId, ids));
    watchedIds = new Set(watched.map((w) => w.productId));
  }

  return (
    <section className="max-w-350 mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
          Recommended For You
        </h2>
        <button
          aria-label="About recommendations"
          className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 text-[11px] font-bold flex items-center justify-center hover:border-gray-500 hover:text-gray-600 transition-colors bg-transparent cursor-pointer"
        >
          ?
        </button>
      </div>

      {recommended.length === 0 ? (
        <EmptyState />
      ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommended.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                isWatched={watchedIds.has(product.id)}
                userId={userId}
              />
            ))}
          </div>
      )}
    </section>
  )
}