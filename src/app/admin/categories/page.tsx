"use server"

import { db } from "@/src/db";
import { categories } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const imageUrl = formData.get("imageUrl") as string;

  await db.insert(categories).values({
    name,
    slug,
    imageUrl: imageUrl || null,
  }).onConflictDoNothing();

  revalidatePath("/admin/categories");
}

async function deleteCategory(id: string) {
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
  const allCategories = await db.select().from(categories);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-500 mt-0.5">{allCategories.length} categories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-fit">
          <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Add Category</h2>
          <form action={createCategory} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Name *</label>
              <input
                name="name"
                required
                placeholder="Sneakers"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Image URL</label>
              <input
                name="imageUrl"
                type="url"
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors border-none cursor-pointer font-[inherit]"
            >
              Add Category
            </button>
          </form>
        </div>
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden h-fit">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {allCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No categories yet.
                  </td>
                </tr>
              ) : (
                allCategories.map((cat) => (
                  <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{cat.slug}</td>
                    <td className="px-4 py-3">
                      <form action={deleteCategory.bind(null, cat.id)}>
                        <button
                          type="submit"
                          className="text-xs font-medium text-red-500 hover:text-red-700 bg-transparent border-none cursor-pointer px-2 py-1 rounded hover:bg-red-50 transition-colors font-[inherit]"
                        >
                          Delete
                        </button>
                      </form>
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