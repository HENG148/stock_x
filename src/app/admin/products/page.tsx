import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import DeleteProductForm from "@/src/components/ui/DeleteButton";
import ToggeleFeature from "@/src/components/ui/ToggleFeature";

export default async function AdminProductsPage() {
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{allProducts.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg no-underline hover:bg-gray-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Brand</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Lowest Ask</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Featured</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No products yet.{" "}
                    <Link href="/admin/products/new" className="text-gray-900 underline">
                      Add your first product
                    </Link>
                  </td>
                </tr>
              ) : (
                allProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                          {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-1" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">👟</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.sku ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.brand ?? "—"}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      ${Number(product.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {product.lowestAsk ? `$${Number(product.lowestAsk).toLocaleString()}` : "—"}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        (product.stock ?? 0) > 0
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}>
                        {product.stock ?? 0}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <ToggeleFeature id={product.id} isFeatured={product.isFeatured ?? false} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-xs font-medium text-gray-600 hover:text-gray-900 no-underline px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                        >
                          Edit
                        </Link>
                        <DeleteProductForm id={product.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}