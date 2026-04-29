import { db } from "@/src/db"
import { products } from "@/src/db/schema"
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { updateProduct } from "../../action";
import { ProductForm } from "@/src/components/form/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string}>
  }) {
  const { id } = await params;
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .then((r) => r[0]);
  if (!product) notFound();

  const handleUpdate = updateProduct.bind(null, id);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-sm text-gray-500 mt-0.5 truncate">
          Editing: <span className="font-medium text-gray-700">{product.name}</span>
        </p>
      </div>

      <ProductForm
        action={handleUpdate}
        submitLabel="Save Changes"
        defaultValues={{
          name: product.name,
          brand: product.brand,
          sku: product.sku,
          description: product.description,
          price: product.price,
          lowestAsk: product.lowestAsk,
          highestBid: product.highestBid,
          lastSalePrice: product.lastSalePrice,
          imageUrl: product.imageUrl,
          category: product.category,
          section: product.section,
          isFeatured: product.isFeatured,
          featuredUntil: product.featuredUntil,
          stock: product.stock,
        }}
      />
    </div>
  );
}