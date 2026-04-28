import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { products, watchlist } from "@/src/db/schema";
import { and, desc, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { EmptyState } from "../EmptyState";
import { ProductCard } from "../ProductCard";
import Link from "next/link";

export async function TrendingSection() {
  const session = await auth();
  const userId = session?.user?.id;

  const trending = await db
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      imageUrl: products.imageUrl,
      lowestAsk: products.lowestAsk,
      slug: products.slug,
    })
    .from(products)
    .where(
      and(
        eq(products.section, "trending"),
        or(isNull(products.featuredUntil), gt(products.featuredUntil, new Date()))
      )
    )
    .orderBy(desc(products.createdAt))
    .limit(7);

  const hasMore = trending.length > 6;
  const displayList = trending.slice(0, 6);

  let watchedIds = new Set<string>();
  if (userId && trending.length > 0) {
    const ids = trending.map((p) => p.id);
    const watched = await db
      .select({ productId: watchlist.productId })
      .from(watchlist)
      .where(inArray(watchlist.productId, ids));
    watchedIds = new Set(watched.map((w) => w.productId));
  }

  return (
    <section className="max-w-350 mx-auto px-6 py-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
            Trending Now
          </h2>
          <button
            aria-label="About trending"
            className="w-5 h-5 rounded-full border border-gray-300 text-gray-400 text-[11px] font-bold flex items-center justify-center hover:border-gray-500 hover:text-gray-600 transition-colors bg-transparent cursor-pointer"
          >
            ?
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-max max-w-60 invisible peer-hover:visible opacity-0 peer-hover:opacity-100 transition-all duration-200 pointer-events-none">
            <div className="bg-gray-900 text-white text-[13px] font-medium leading-snug text-center rounded-lg px-4 py-2.5 shadow-lg">
              'Trending' products are a curated collection of our best selling items
            </div>
            <div className="flex justify-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900" />
            </div>
          </div>
        </div>
        {hasMore && (
          <Link
            href="/browse/"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 no-underline hover:text-gray-600 transition-colors group"
          >
            See All
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-0.5 transition-transform"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {displayList.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayList.map((product) => (
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
  );
}