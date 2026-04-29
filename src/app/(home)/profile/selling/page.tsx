import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { listings, orderItems, orders, products } from "@/src/db/schema";
import { cancelListing } from "@/src/server/market";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SellingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // Fetch active listings
  const activeListings = await db
    .select({
      id: listings.id,
      askPrice: listings.askPrice,
      size: listings.size,
      createdAt: listings.createdAt,
      expiresAt: listings.expiresAt,
      isActive: listings.isActive,
      productName: products.name,
      productImage: products.imageUrl,
      productSlug: products.slug,
      productCategory: products.category,
      productId: listings.productId,
    })
    .from(listings)
    .leftJoin(products, eq(products.id, listings.productId))
    .where(eq(listings.sellerId, userId))
    .orderBy(desc(listings.createdAt));

  // Fetch completed sales
  const completedSales = await db
    .select({
      orderId: orders.id,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
      size: orderItems.size,
      price: orderItems.price,
      productName: products.name,
      productImage: products.imageUrl,
      productSlug: products.slug,
      productCategory: products.category,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .leftJoin(products, eq(products.id, orderItems.productId))
    .where(eq(orders.sellerId, userId))
    .orderBy(desc(orders.createdAt));

  const STATUS_COLOR: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-blue-50 text-blue-700",
    shipped: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-500",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Selling</h1>
      <p className="text-sm text-gray-400 mb-8">Your active listings and completed sales</p>

      {/* Active Listings */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Active Listings{" "}
          <span className="text-gray-400 font-normal text-sm">({activeListings.filter(l => l.isActive).length})</span>
        </h2>

        {activeListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-gray-200">
            <span className="text-3xl mb-2">📦</span>
            <p className="text-sm font-semibold text-gray-700">No active listings</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Go to a product page and click Sell to list an item</p>
            <Link href="/browse" className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg no-underline hover:bg-gray-700">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activeListings.map((listing) => {
              const href = `/${listing.productCategory?.toLowerCase() ?? "products"}/${listing.productSlug ?? listing.productId}`;
              return (
                <div key={listing.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="relative w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                    {listing.productImage && (
                      <Image src={listing.productImage} alt={listing.productName ?? ""} fill className="object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={href} className="text-sm font-semibold text-gray-900 line-clamp-1 no-underline hover:underline">
                      {listing.productName}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Size: {listing.size} · Ask: <span className="font-semibold text-gray-700">${Number(listing.askPrice).toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Expires: {listing.expiresAt ? new Date(listing.expiresAt).toLocaleDateString() : "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${listing.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                      {listing.isActive ? "Active" : "Inactive"}
                    </span>
                    {listing.isActive && (
                      <form action={cancelListing.bind(null, listing.id)}>
                        <button
                          type="submit"
                          className="text-xs text-red-500 hover:text-red-700 font-semibold bg-transparent border-none cursor-pointer"
                        >
                          Cancel
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Completed Sales */}
      <section>
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Completed Sales{" "}
          <span className="text-gray-400 font-normal text-sm">({completedSales.length})</span>
        </h2>

        {completedSales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-gray-200">
            <span className="text-3xl mb-2">💰</span>
            <p className="text-sm font-semibold text-gray-700">No sales yet</p>
            <p className="text-xs text-gray-400 mt-1">Your completed sales will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {completedSales.map((sale) => {
              const href = `/${sale.productCategory?.toLowerCase() ?? "products"}/${sale.productSlug}`;
              return (
                <div key={sale.orderId} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="relative w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                    {sale.productImage && (
                      <Image src={sale.productImage} alt={sale.productName ?? ""} fill className="object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={href} className="text-sm font-semibold text-gray-900 line-clamp-1 no-underline hover:underline">
                      {sale.productName}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Size: {sale.size} · Sold for: <span className="font-semibold text-green-600">${Number(sale.price).toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-gray-400">{sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : "—"}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[sale.status ?? "pending"] ?? "bg-gray-100 text-gray-600"}`}>
                    {sale.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}