"use client"

import { toggleFeatured } from "@/src/app/admin/products/action";

interface ToggleFeatureButtonProps {
  id: string;
  isFeatured: boolean;
}

export default function ToggeleFeature({id, isFeatured}: ToggleFeatureButtonProps) {
  return (
    <form action={toggleFeatured.bind(null, String(id), isFeatured)}>
      <button type="submit"
        className={`text-xs font-semibold px-2 py-0.5 rounded-full border-none cursor-pointer transition-colors ${isFeatured 
          ? "bg-[#08a05c] text-white hover:bg-[#069050]"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}>
        {isFeatured ? "Featured" : "Hidden"}
      </button>
    </form>
  )
}