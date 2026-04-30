import { auth } from "@/src/auth";
import { MarketAction } from "@/src/components/action/Marketactions";
import ExpandableDescription from "@/src/components/EnableDescription";
import ProductGallery from "@/src/components/ProductGallery";
import { Breadcrumb } from "@/src/components/ui/Breadcrump";
import { db } from "@/src/db";
import { listings, products } from "@/src/db/schema";
import { and, eq, or } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

export default async function ProductDetail({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const session = await auth()
  const userId = session?.user?.id

  const product = await db
    .select()
    .from(products)
    .where(or(
      eq(products.slug, slug),
    ))
    .then((r) => r[0]);
  if (!product) notFound();

  if (product.category?.toLowerCase() !== category.toLowerCase()) {
    redirect(`/${product.category?.toLowerCase()}/${slug}`);
  }

  const activeListings = await db
    .select({ size: listings.size, askPrice: listings.askPrice })
    .from(listings)
    .where(
      and(
        eq(listings.productId, product.id),
        eq(listings.isActive, true)
    )
  )
  const availableSizes = new Set(activeListings.map((l) => l.size));
  const sizePriceMap = activeListings.reduce((acc, l) => {
  const key = l.size ?? ""
  if (!acc[key] || Number(l.askPrice) < Number(acc[key])) {
    acc[key] = l.askPrice ?? ""
  }
  return acc
}, {} as Record<string, string>)
  
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-300 mx-auto px-6 py-6">
        <Breadcrumb />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-2">
          <ProductGallery product={product} />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-600">
                  {product.sku ?? "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button aria-label="down" className="p-2 rounded-full hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <button aria-label="down" className="p-2 rounded-full hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-1">
              {product.name.split(" ").slice(0, 4).join(" ")}
            </h1>
            <p className="text-base text-gray-500 mb-4">
              {product.name.split(" ").slice(4).join(" ")}
            </p>
 
            <div className="flex items-center gap-1.5 text-xs mb-5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#08a05c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span className="font-bold text-gray-800">Xpress Ship available.</span>
              <span className="text-gray-500">Get it by Apr 24 - 30</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" /><path d="M12 8v4l3 3" />
              </svg>
            </div>

            <MarketAction
              productId={product.id}
              userId={userId}
              lowestAsk={product.lowestAsk}
              highestBid={product.highestBid}
              price={product.price}
              availableSizes={availableSizes} 
              sizePriceMap={sizePriceMap}
            />
 
            <div className="border-t border-gray-100 divide-y divide-gray-100">
              {[
                { icon: "🚚", label: "Worry Free Purchasing" },
                { icon: "🛡️", label: "Buyer Promise" },
                { icon: "⚙️", label: "Our Process", sub: `Condition: New` },
              ].map((item) => (
                <details key={item.label} className="group py-4 cursor-pointer">
                  <summary className="flex items-center justify-between list-none">
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                      {item.sub && (
                        <span className="text-xs text-gray-400">{item.sub}</span>
                      )}
                    </div>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="group-open:rotate-180 transition-transform"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <div className="mt-3 text-sm text-gray-500 leading-relaxed pl-6">
                    {item.label === "Worry Free Purchasing" &&
                      "Every item is verified for authenticity by our team of experts before it reaches you."}
                    {item.label === "Buyer Promise" &&
                      "If your item doesn't pass our verification, you'll get a full refund — no questions asked."}
                    {item.label === "Our Process" &&
                      "Items go through a rigorous multi-point inspection process to ensure they meet our standards."}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-10 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Product Details</h2>
          <div className="flex flex-col lg:flex-row gap-36">
            <div className="space-y-4">
              {[
                { label: "Style", value: product.sku ?? "—" },
                { label: "Brand", value: product.brand ?? "—" },
                { label: "Category", value: product.category ?? "—" },
                { label: "Retail Price", value: `$${Number(product.price).toLocaleString()}` },
                { label: "Condition", value: "New" },
                { label: "SKU", value: product.sku ?? "—" },
              ].map((row) => (
                <div key={row.label} className="flex gap-6 border-b border-gray-50 pb-3">
                  <span className="w-44 shrink-0 text-sm text-gray-500">{row.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="text-md font-semibold text-gray-900 mb-3">Product Description</p>
              {product.description ? (
                <ExpandableDescription description={product.description} />
              ) : (
                <p className="text-sm text-gray-400 italic">No description available.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}