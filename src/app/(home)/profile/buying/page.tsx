import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { orders, bids, products } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-orange-50 text-orange-600",
  confirmed: "bg-blue-50 text-blue-600",
  shipped:   "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-500",
};

export default async function BuyingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [myOrders, myBids] = await Promise.all([
    db.select({ id: orders.id, total: orders.total, status: orders.status, createdAt: orders.createdAt })
      .from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt)),

    db.select({
        id: bids.id, bidPrice: bids.bidPrice, size: bids.size,
        isActive: bids.isActive, createdAt: bids.createdAt,
        productName: products.name, productSlug: products.slug,
      })
      .from(bids)
      .leftJoin(products, eq(bids.productId, products.id))
      .where(eq(bids.buyerId, userId))
      .orderBy(desc(bids.createdAt)),
  ]);

  const activeBids = myBids.filter((b) => b.isActive);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Buying</h1>

      <Section title="Active Bids" count={activeBids.length}>
        {activeBids.length === 0 ? (
          <Empty message="No active bids." cta="Browse products" href="/browse" />
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              <Th>Product</Th><Th>Size</Th><Th>Bid</Th><Th>Date</Th>
            </tr></thead>
            <tbody>
              {activeBids.map((bid) => (
                <tr key={bid.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/products/${bid.productSlug}`} className="text-sm font-medium text-gray-900 no-underline hover:underline">
                      {bid.productName ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{bid.size ?? "All"}</td>
                  <td className="px-4 py-3 font-semibold">${Number(bid.bidPrice).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {bid.createdAt ? new Date(bid.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Orders" count={myOrders.length}>
        {myOrders.length === 0 ? (
          <Empty message="No orders yet." cta="Start shopping" href="/browse" />
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              <Th>Order ID</Th><Th>Total</Th><Th>Status</Th><Th>Date</Th>
            </tr></thead>
            <tbody>
              {myOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{order.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3 font-semibold">${Number(order.total).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[order.status ?? "pending"] ?? "bg-gray-100 text-gray-500"}`}>
                      {order.status ?? "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">{children}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{children}</th>;
}

function Empty({ message, cta, href }: { message: string; cta: string; href: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm text-gray-500 mb-3">{message}</p>
      <Link href={href} className="text-sm font-semibold text-[#08a05c] no-underline hover:underline">{cta}</Link>
    </div>
  );
}