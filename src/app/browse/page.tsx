import { auth } from "@/src/auth";
import { buildUrl } from "@/src/components/BuildUrl";
import { ProductCard } from "@/src/components/ProductCard";
import { db } from "@/src/db";
import { products, watchlist } from "@/src/db/schema";
import { BRANDS, CATEGORIES, SORT_OPTIONS } from "@/src/types/type";
import { desc, inArray } from "drizzle-orm";
import Link from "next/link";

export default async function ProductPage({ searchParams }: {
  searchParams: Promise<{
    q?: string;
    brand?: string;
    cat?: string;
    sort?: string;
    section?: string;
  }>
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const brand = params.brand ?? "";
  const cat = params.cat?.trim() ?? "";
  const sort = params.sort ?? "newest"
  const session = await auth();
  const userId = session?.user?.id;

  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      imageUrl: products.imageUrl,
      lowestAsk: products.lowestAsk,
      price: products.price,
      category: products.category,
      section: products.section,
      createdAt: products.createdAt,
    })
    .from(products)
    .orderBy(desc(products.createdAt));
  
  let filtered = allProducts;
  if (query) {
    filtered = filtered.filter(
      (p) => p.brand?.toLowerCase()===brand.toLowerCase()
    )
  };
  if (cat) {
    filtered = filtered.filter(
      (p)=>p.category?.toLowerCase()===cat.toLowerCase()
    )
  }

  if (sort === "lowest_ask") {
    filtered = [...filtered].sort(
      (a, b) => Number(a.lowestAsk ?? 9999999) - Number(b.lowestAsk ?? 9999999)
    );
  } else if (sort === "hightest_ask") {
    filtered = [...filtered].sort(
      (a, b) => Number(b.lowestAsk ?? 0) - Number(a.lowestAsk ?? 0)
    );
  } else if (sort === "price_asc") {
    filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === "price_desc") {
    filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
  }

  let watchedIds = new Set<string>();
  if (userId && filtered.length > 0) {
    const ids     = filtered.map((p) => p.id);
    const watched = await db
      .select({ productId: watchlist.productId })
      .from(watchlist)
      .where(inArray(watchlist.productId, ids));
    watchedIds = new Set(watched.map((w) => w.productId));
  }
  const activeFilters = [query, brand, cat].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-360 mx-auto px-6 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {query ? `Results for "${query}"` :
             brand  ? `${brand}` :
             cat    ? cat :
             "All Products"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>
 
        <div className="flex gap-8">
          <aside className="w-44 shrink-0 hidden md:block">
            {activeFilters > 0 && (
              <Link
                href="/browse"
                className="flex items-center gap-1 text-xs font-semibold text-red-500 no-underline hover:text-red-700 mb-5"
              >
                ✕ Clear all
              </Link>
            )}
            <div className="mb-6">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Sort By
              </p>
              <div className="flex flex-col gap-0.5">
                {SORT_OPTIONS.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildUrl(params, { sort: opt.value })}
                    className={`text-[13px] px-2.5 py-1.5 rounded-lg no-underline transition-colors ${
                      sort === opt.value
                        ? "bg-gray-900 text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Brand
              </p>
              <div className="flex flex-col gap-0.5">
                {BRANDS.map((b) => (
                  <Link
                    key={b}
                    href={buildUrl(params, { brand: brand === b ? "" : b })}
                    className={`text-[13px] px-2.5 py-1.5 rounded-lg no-underline transition-colors ${
                      brand === b
                        ? "bg-gray-900 text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {b}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Category
              </p>
              <div className="flex flex-col gap-0.5">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c}
                    href={buildUrl(params, { cat: cat === c ? "" : c })}
                    className={`text-[13px] px-2.5 py-1.5 rounded-lg no-underline transition-colors ${
                      cat === c
                        ? "bg-gray-900 text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">👟</div>
                <p className="text-lg font-semibold text-gray-700">
                  No products found
                </p>
                <p className="text-sm text-gray-400 mt-1 mb-5">
                  Try adjusting your filters or search
                </p>
                <Link
                  href="/browse"
                  className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg no-underline hover:bg-gray-700 transition-colors"
                >
                  View all products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWatched={watchedIds.has(product.id)}
                    userId={userId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}