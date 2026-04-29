import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { bids, orderItems, orders, products } from "@/src/db/schema";
import { cancelBid } from "@/src/server/market";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function BuyingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  // Fetch orders with items
  const userOrders = await db
    .select({
      orderId: orders.id,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
      productId: orderItems.productId,
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
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  // Fetch active bids
  const activeBids = await db
    .select({
      id: bids.id,
      bidPrice: bids.bidPrice,
      size: bids.size,
      createdAt: bids.createdAt,
      expiresAt: bids.expiresAt,
      productName: products.name,
      productImage: products.imageUrl,
      productSlug: products.slug,
      productCategory: products.category,
      productId: bids.productId,
    })
    .from(bids)
    .leftJoin(products, eq(products.id, bids.productId))
    .where(eq(bids.buyerId, userId))
    .orderBy(desc(bids.createdAt));

  const STATUS_COLOR: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-blue-50 text-blue-700",
    shipped: "bg-purple-50 text-purple-700",
    delivered: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-500",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Buying</h1>
      <p className="text-sm text-gray-400 mb-8">Your orders and active bids</p>

      {/* Active Bids */}
      <section className="mb-10">
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Active Bids{" "}
          <span className="text-gray-400 font-normal text-sm">({activeBids.filter(b => b.id).length})</span>
        </h2>

        {activeBids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-gray-200">
            <span className="text-3xl mb-2">🏷️</span>
            <p className="text-sm font-semibold text-gray-700">No active bids</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Place a bid on any product</p>
            <Link href="/browse" className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg no-underline hover:bg-gray-700">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activeBids.map((bid) => {
              const href = `/${bid.productCategory?.toLowerCase() ?? "products"}/${bid.productSlug ?? bid.productId}`;
              return (
                <div key={bid.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="relative w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                    {bid.productImage && (
                      <Image src={bid.productImage} alt={bid.productName ?? ""} fill className="object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={href} className="text-sm font-semibold text-gray-900 line-clamp-1 no-underline hover:underline">
                      {bid.productName}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">Size: {bid.size} · Bid: <span className="font-semibold text-gray-700">${Number(bid.bidPrice).toLocaleString()}</span></p>
                    <p className="text-xs text-gray-400">Expires: {bid.expiresAt ? new Date(bid.expiresAt).toLocaleDateString() : "—"}</p>
                  </div>
                  <form action={cancelBid.bind(null, bid.id)}>
                    <button
                      type="submit"
                      className="text-xs text-red-500 hover:text-red-700 font-semibold bg-transparent border-none cursor-pointer"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Orders */}
      <section>
        <h2 className="text-base font-bold text-gray-900 mb-4">
          Orders{" "}
          <span className="text-gray-400 font-normal text-sm">({userOrders.length})</span>
        </h2>

        {userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-gray-200">
            <span className="text-3xl mb-2">🛍️</span>
            <p className="text-sm font-semibold text-gray-700">No orders yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Buy something to see it here</p>
            <Link href="/browse" className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg no-underline hover:bg-gray-700">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {userOrders.map((order) => {
              const href = `/${order.productCategory?.toLowerCase() ?? "products"}/${order.productSlug ?? order.productId}`;
              return (
                <div key={order.orderId} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="relative w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                    {order.productImage && (
                      <Image src={order.productImage} alt={order.productName ?? ""} fill className="object-contain p-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={href} className="text-sm font-semibold text-gray-900 line-clamp-1 no-underline hover:underline">
                      {order.productName}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Size: {order.size} · ${Number(order.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[order.status ?? "pending"] ?? "bg-gray-100 text-gray-600"}`}>
                    {order.status}
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