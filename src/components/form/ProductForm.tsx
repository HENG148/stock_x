"use client";

import { SUBCATEGORIES } from "@/src/types/type";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductFormProps = {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name?: string;
    brand?: string | null;
    sku?: string | null;
    description?: string | null;
    price?: string;
    lowestAsk?: string | null;
    highestBid?: string | null;
    lastSalePrice?: string | null;
    imageUrl?: string | null;
    category?: string | null;
    isFeatured?: boolean | null;
    featuredUntil?: Date | null;
    section?: string | null;
    subcategory?: string | null;
    stock?: number | null;
  };
  submitLabel?: string;
};

const CATEGORIES = [
  "Sneakers", "Apparel", "Accessories", "Collectibles", "Trading Cards", "Shoes", "Men", "Women"
];

const SECTIONS = [
  { value: "all", label: "All Products", description: "General browse only, no promotion" },
  { value: "recommended", label: "Recommended For You", description: "Shows in Recommended section" },
  { value: "trending", label: "Trending Now", description: "Shows in Trending section" },
  { value: "new_arrivals", label: "New Arrivals", description: "Shows in New Arrivals section" },
];

export function ProductForm({ action, defaultValues = {}, submitLabel = "Save Product" }: ProductFormProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(defaultValues.category ?? "");

  const featuredUntilValue = defaultValues.featuredUntil
    ? new Date(defaultValues.featuredUntil).toISOString().slice(0, 16)
    : "";
  
  const subcategories = SUBCATEGORIES[selectedCategory.toLowerCase()] ?? [];

  return (
    <form action={action} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Product Name *</label>
            <input
              name="name"
              required
              defaultValue={defaultValues.name ?? ""}
              placeholder="Jordan 1 Retro High OG..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="brand" className="block text-xs font-semibold text-gray-500 mb-1.5">Brand</label>
            <select
              id="brand"
              name="brand"
              defaultValue={defaultValues.brand ?? ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors bg-white"
            >
              <option value="">Select brand...</option>
              <option value="Nike">Nike</option>
              <option value="Adidas">Adidas</option>
              <option value="Puma">Puma</option>
              <option value="New Balance">New Balance</option>
              <option value="Converse">Converse</option>
              <option value="Vans">Vans</option>
              <option value="Reebok">Reebok</option>
              <option value="Jordan">Jordan</option>
              <option value="Yeezy">Yeezy</option>
              <option value="Asics">Asics</option>
              <option value="Under Armour">Under Armour</option>
              <option value="Balenciaga">Balenciaga</option>
              <option value="Off-White">Off-White</option>
              <option value="Supreme">Supreme</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">SKU</label>
            <input
              name="sku"
              defaultValue={defaultValues.sku ?? ""}
              placeholder="DD1391-100"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-gray-500 mb-1.5">Category</label>
            <select
              id="category"
              name="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              // defaultValue={defaultValues.category ?? ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors bg-white"
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subcategory" className="block text-xs font-semibold text-gray-500 mb-1.5">
              Subcategory
              {subcategories.length === 0 && (
                <span className="text-gray-400 font-normal ml-1">(select a category first)</span>
              )}
            </label>
            <select
              id="subcategory"
              name="subcategory"
              defaultValue={defaultValues.subcategory ?? ""}
              disabled={subcategories.length === 0}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">Select subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Stock</label>
            <input
              name="stock"
              type="number"
              min="0"
              placeholder="0"
              defaultValue={defaultValues.stock ?? 0}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Description</label>
            <textarea
              name="description"
              defaultValue={defaultValues.description ?? ""}
              rows={3}
              placeholder="Product description..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Pricing</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "price", label: "Retail Price *", required: true,  placeholder: "180.00" },
            { name: "lowestAsk", label: "Lowest Ask", required: false, placeholder: "362.00" },
            { name: "highestBid", label: "Highest Bid", required: false, placeholder: "340.00" },
            { name: "lastSalePrice", label: "Last Sale", required: false, placeholder: "355.00" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{field.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  name={field.name}
                  type="number"
                  step="0.01"
                  min="0"
                  required={field.required}
                  defaultValue={
                    defaultValues[field.name as keyof typeof defaultValues] as string ?? ""
                  }
                  placeholder={field.placeholder}
                  className="w-full pl-6 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Media</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Image URL</label>
          <input
            name="imageUrl"
            type="url"
            defaultValue={defaultValues.imageUrl ?? ""}
            placeholder="https://images.stockx.com/..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">Right-click any product image → Copy image address</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Visibility & Promotion</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Section *</label>
            <div className="grid grid-cols-2 gap-2">
              {SECTIONS.map((s) => (
                <label
                  key={s.value}
                  className="flex items-start gap-2.5 p-3 rounded-lg border border-gray-200 cursor-pointer has-checked:border-gray-900 has-checked:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="section"
                    value={s.value}
                    defaultChecked={(defaultValues.section ?? "all") === s.value}
                    className="mt-0.5 accent-gray-900"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="isFeatured" className="block text-xs font-semibold text-gray-500 mb-1.5">Homepage Promotion</label>
              <select
                id="isFeatured"
                name="isFeatured"
                defaultValue={defaultValues.isFeatured ? "true" : "false"}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors bg-white"
              >
                <option value="false">Hidden — not promoted</option>
                <option value="true">Featured — show on homepage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Featured Until
                <span className="text-gray-400 font-normal ml-1">(blank = 2 weeks auto)</span>
              </label>
              <input
                name="featuredUntil"
                type="datetime-local"
                defaultValue={featuredUntilValue}
                placeholder="...."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>

          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 leading-relaxed">
            💡 <strong className="text-gray-600">How it works:</strong> Select a section to control where this product appears.
            Set it as Featured to promote it on the homepage. After the expiry date (default 2 weeks),
            it automatically moves to general browse only.
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 pb-8">
        <button
          type="submit"
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors border-none cursor-pointer font-[inherit]"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-white text-gray-600 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer font-[inherit]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}