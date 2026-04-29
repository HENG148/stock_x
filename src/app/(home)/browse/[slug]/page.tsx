import { auth } from "@/src/auth";
import { ProductCard } from "@/src/components/ProductCard";
import Pagination from "@/src/components/ui/pagination";
import { db } from "@/src/db";
import { products, watchlist } from "@/src/db/schema";
import { BRANDS, CATEGORIES, SLUG_MAP, SORT_OPTIONS, SUBCATEGORIES } from "@/src/types/type";
import { desc, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BrowseSlugPage({
  params,
  searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{
      sort?: string; brand?: string; sub?: string; section?: string;
      page?: string;
    }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const sort = sp.sort ?? "newest";
  const brandFilter = sp.brand ?? "";
  const section = sp.section ?? "" 
 
  const filter = SLUG_MAP[slug];
  if (!filter) notFound();
 
  const session = await auth();
  const userId = session?.user?.id
 
  const baseQuery = db
    .select({
      id: products.id,
      name: products.name,
      brand: products.brand,
      imageUrl: products.imageUrl,
      lowestAsk: products.lowestAsk,
      price: products.price,
      category: products.category,
      subcategory: products.subcategory,
      section: products.section,
      createdAt: products.createdAt,
      slug: products.slug
    })
    .from(products)
    .where(
      filter.type === "category"
        ? eq(products.category, filter.value ?? "")
        : filter.type === "subcategory"
        ? eq(products.subcategory, filter.value ?? "")
        : eq(products.section, filter.value ?? "")
    )
    .orderBy(desc(products.createdAt));
 
  let allProducts = await baseQuery;

  if (brandFilter) {
    allProducts = allProducts.filter(
      (p) => p.brand?.toLowerCase() === brandFilter.toLowerCase()
    );
  }

  const subFilter = sp.sub ?? "";

  if (subFilter) {
    allProducts = allProducts.filter(
      (p) => p.subcategory?.toLowerCase()===subFilter.toLowerCase()
    )
  }

 
  if (sort === "lowest_ask") {
    allProducts = [...allProducts].sort(
      (a, b) => Number(a.lowestAsk ?? 9999999) - Number(b.lowestAsk ?? 9999999)
    );
  } else if (sort === "highest_ask") {
    allProducts = [...allProducts].sort(
      (a, b) => Number(b.lowestAsk ?? 0) - Number(a.lowestAsk ?? 0)
    );
  } else if (sort === "price_asc") {
    allProducts = [...allProducts].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === "price_desc") {
    allProducts = [...allProducts].sort((a, b) => Number(b.price) - Number(a.price));
  }
  
  let watchedIds = new Set<string>();
  if (userId && allProducts.length > 0) {
    const ids     = allProducts.map((p) => p.id);
    const watched = await db
      .select({ productId: watchlist.productId })
      .from(watchlist)
      .where(inArray(watchlist.productId, ids));
    watchedIds = new Set(watched.map((w) => w.productId));
  }

  function buildSlugUrl(overrides: {
    sort?: string; 
    brand?: string;
    sub?: string;
    page?: string;
  }) {
    const merged = {
      sort,
      brand: brandFilter,
      section,
      sub: subFilter,
      page: String(page),
      ...overrides
    }
    const query = new URLSearchParams();
    if (merged.sort && merged.sort !== "newest") query.set("sort", merged.sort);
    if (merged.brand) query.set("brand", merged.brand);
    // if (merged.section) query.set("section", merged.section);
    if(merged.sub) query.set("sub", merged.sub)
    const qs = query.toString();
    return `/browse/${slug}${qs ? `?${qs}` : ""}`;
  }

  const page = Math.max(1, Number(sp.page ?? 1));
  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(allProducts.length / PAGE_SIZE)
  const paginated = allProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const subcategories = SUBCATEGORIES[slug.toLowerCase()];
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-360 mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
          <Link href="/browse" className="hover:text-gray-600 no-underline">All</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{filter.label}</span>
        </div>
 
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{filter.label}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {allProducts.length} {allProducts.length === 1 ? "product" : "products"}
          </p>
        </div>
 
        <div className="flex gap-8">
          <aside className="w-44 shrink-0 hidden md:block">
            <div className="mb-6">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Sort By
              </p>
              <div className="flex flex-col gap-0.5">
                {SORT_OPTIONS.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildSlugUrl({sort:opt.value})}
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

            {subcategories && (
              <div className="mb-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">
                  {filter.label}
                </p> 
                <div className="flex flex-col gap-0.5">
                  <Link
                    href={buildSlugUrl({ sub: "" })}
                    className={`text-[13px] px-2.5 py-1.5 rounded-lg no-underline transition-colors ${
                      !subFilter
                        ? "bg-gray-900 text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    All
                  </Link>
                  {subcategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={buildSlugUrl({ sub: subFilter === sub.label ? "" : sub.label })}
                      className={`text-[13px] px-2.5 py-1.5 rounded-lg no-underline transition-colors ${
                        subFilter === sub.label
                          ? "bg-gray-900 text-white font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Brands
              </p>
              <div className="flex flex-col gap-0.5">
                {BRANDS.map((b) => (
                  <Link
                    key={b}
                    href={buildSlugUrl({ brand: brandFilter === b ? "" : b })}
                    className={`text-[13px] px-2.5 py-1.5 rounded-lg no-underline transition-colors ${
                      brandFilter === b
                        ? "bg-gray-900 text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {b}
                  </Link>
                ))}
                {/* {Object.entries(SLUG_MAP).map(([s, f]) => (
                  <Link
                    key={s}
                    href={`/browse/${s}`}
                    className={`text-[13px] px-2.5 py-1.5 rounded-lg no-underline transition-colors ${
                      s === slug
                        ? "bg-gray-900 text-white font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {f.label}
                  </Link>
                ))} */}
              </div>
            </div>
          </aside>
 
          <div className="flex-1 min-w-0">
            {allProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">👟</div>
                <p className="text-lg font-semibold text-gray-700">
                  No {filter.label} yet
                </p>
                <p className="text-sm text-gray-400 mt-1 mb-5">
                  Check back soon or browse all products
                </p>
                <Link
                  href="/browse"
                  className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg no-underline hover:bg-gray-700 transition-colors"
                >
                  View all products
                </Link>
              </div>
            ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {paginated.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isWatched={watchedIds.has(product.id)}
                        userId={userId}
                      />
                    ))}
                  </div>
                  <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    params={{ sort, brand: brandFilter, sub: subFilter, slug}}
                  />
                </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}