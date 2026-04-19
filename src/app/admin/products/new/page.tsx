import { ProductForm } from "@/src/components/form/ProductForm";
import { redirect } from "next/navigation";
import { createProduct } from "../action";

async function handleCreate(formData: FormData) {
  "use server";
  await createProduct(formData)
  redirect("/admin/products")
}

export default function NewProductPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
        <p className="text-sm text-gray-500 mt-0.5">Fill in the details to add a new products</p>
      </div>
      <ProductForm action={handleCreate} submitLabel="Add Product" />
    </div>
  )
}