import ExpandableDescription from "@/src/components/EnableDescription";
import ProductGallery from "@/src/components/ProductGallery";
import { Breadcrumb } from "@/src/components/ui/Breadcrump";
import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { SIZES } from "@/src/types/type";
import { eq, or } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function ProductDetail({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;

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

            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Size:</span>
                <span className="text-xs text-gray-400">US Men's</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    className="py-2 text-xs font-medium rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all cursor-pointer bg-white text-gray-700"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-5 mb-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">Buy Now for</p>
                  <p className="text-3xl font-black text-gray-900">
                    ${Number(product.lowestAsk ?? product.price).toLocaleString()}
                  </p>
                </div>
                {/* Sold count */}
                <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg">
                  <span className="text-base">⚡</span>
                  <p className="text-xs font-bold text-gray-800">
                    {Math.floor(Math.random() * 400) + 50} Sold in Last 3 Days!
                  </p>
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button className="py-3 rounded-full border-2 border-gray-900 text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors bg-white cursor-pointer">
                  Make Offer
                </button>
                <button className="py-3 rounded-full bg-[#08a05c] text-sm font-bold text-white hover:bg-[#069050] transition-colors border-none cursor-pointer">
                  Buy Now
                </button>
              </div>
 
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Last Sale:{" "}
                  <span className="font-semibold text-gray-900">
                    ${Number(product.lastSalePrice ?? product.price).toLocaleString()}
                  </span>
                </span>
                <button className="text-[#08a05c] font-semibold text-xs hover:underline bg-transparent border-none cursor-pointer">
                  View Market Data
                </button>
              </div>
            </div>
 
            <div className="text-center mb-6">
              <Link
                href="/sell"
                className="text-[#08a05c] font-bold text-sm no-underline hover:underline"
              >
                Sell Now for ${Number(product.highestBid ?? product.price).toLocaleString()} or Ask for More →
              </Link>
            </div>
 
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