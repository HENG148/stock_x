import { auth } from "@/src/auth";
import { ProductCard } from "@/src/components/ProductCard";
import { db } from "@/src/db";
import { products, watchlist } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const watched = await db
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
      slug: products.slug,
    })
    .from(watchlist)
    .innerJoin(products, eq(watchlist.productId, products.id))
    .where(eq(watchlist.userId, userId));

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-360 mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {watched.length} {watched.length === 1 ? "product" : "products"}
          </p>
        </div>

        {watched.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🤍</div>
            <p className="text-lg font-semibold text-gray-700">No favorites yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-5">
              Click the heart on any product to save it here
            </p>
            <Link
              href="/browse"
              className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg no-underline hover:bg-gray-700 transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {watched.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWatched={true}
                userId={userId}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}