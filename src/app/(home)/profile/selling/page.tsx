import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { listings, orders, products } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SellingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [myListings, mySales] = await Promise.all([
    db.select({
        id: listings.id, askPrice: listings.askPrice, size: listings.size,
        isActive: listings.isActive, createdAt: listings.createdAt,
        productName: products.name, productSlug: products.slug,
      })
      .from(listings)
      .leftJoin(products, eq(listings.productId, products.id))
      .where(eq(listings.sellerId, userId))
      .orderBy(desc(listings.createdAt)),

    db.select({ id: orders.id, total: orders.total, status: orders.status, createdAt: orders.createdAt })
      .from(orders).where(eq(orders.sellerId, userId)).orderBy(desc(orders.createdAt)),
  ]);

  const activeListings = myListings.filter((l) => l.isActive);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Selling</h1>

      <Section title="Active Asks" count={activeListings.length}>
        {activeListings.length === 0 ? (
          <Empty message="No active listings." cta="Start selling" href="/sell" />
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              <Th>Product</Th><Th>Size</Th><Th>Ask Price</Th><Th>Date</Th>
            </tr></thead>
            <tbody>
              {activeListings.map((listing) => (
                <tr key={listing.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link href={`/products/${listing.productSlug}`} className="text-sm font-medium text-gray-900 no-underline hover:underline">
                      {listing.productName ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{listing.size ?? "All"}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">${Number(listing.askPrice).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Sales" count={mySales.length}>
        {mySales.length === 0 ? (
          <Empty message="No sales yet." cta="List a product" href="/sell" />
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100">
              <Th>Order ID</Th><Th>Total</Th><Th>Status</Th><Th>Date</Th>
            </tr></thead>
            <tbody>
              {mySales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{sale.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3 font-semibold">${Number(sale.total).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize bg-green-50 text-green-600">
                      {sale.status ?? "completed"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
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