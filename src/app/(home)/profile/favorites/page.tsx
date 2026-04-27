import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { watchlist, products } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const savedItems = await db
    .select({
      id:           watchlist.id,
      createdAt:    watchlist.createdAt,
      productId:    products.id,
      productName:  products.name,
      productSlug:  products.slug,
      productImage: products.imageUrl,
      lowestAsk:    products.lowestAsk,
      brand:        products.brand,
    })
    .from(watchlist)
    .leftJoin(products, eq(watchlist.productId, products.id))
    .where(eq(watchlist.userId, userId))
    .orderBy(desc(watchlist.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
        <span className="text-sm text-gray-400">{savedItems.length} items</span>
      </div>

      {savedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🤍</div>
          <p className="text-lg font-semibold text-gray-700">No saved items yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-5">
            Tap the heart on any product to save it here
          </p>
          <Link
            href="/browse"
            className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg no-underline hover:bg-gray-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedItems.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.productSlug ?? item.productId}`}
              className="no-underline group"
            >
              <div className="bg-gray-50 rounded-xl overflow-hidden aspect-square relative mb-2 border border-gray-100 group-hover:border-gray-300 transition-colors">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName ?? ""}
                    fill
                    className="object-contain p-4"
                    sizes="200px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">👟</div>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-0.5">{item.brand}</p>
              <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{item.productName}</p>
              <p className="text-xs text-gray-400">Lowest Ask</p>
              <p className="text-sm font-bold text-gray-900">
                {item.lowestAsk ? `$${Number(item.lowestAsk).toLocaleString()}` : "—"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}