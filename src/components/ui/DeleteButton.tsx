"use client"

import { deleteProduct } from "@/src/app/admin/products/action";

type DeleteProductFormProps = {
  id: string;
  // productId: string | number;
  confirmMessage?: string;
  buttonLabel?: string;
}

export default function DeleteProductForm({
  // productId,
  id,
  confirmMessage = "Delete the products?",
  buttonLabel = "Delete"
}: DeleteProductFormProps) {
  return (
    <form action={deleteProduct.bind(null, String(id))}>
      <button
        type="submit"
        className="text-xs font-medium text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer px-2 py-1 rounded hover:bg-red-50 transition-colors font-[inherit]"
        onClick={(e) => {
          if (!confirm("Delete this product?")) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}