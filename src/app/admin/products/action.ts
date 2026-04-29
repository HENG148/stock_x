'use server'

import { db } from "@/src/db";
import { listings, products } from "@/src/db/schema";
import { generateSlug } from "@/src/lib/Slug";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ADMIN_SELLER_ID = "a189c8ec-3cd0-4592-b1e1-8e5e675c9fdb"

async function makeUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = generateSlug(name);
  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, base))
    .then((r) => r[0]);

  if (!existing) return base;
  if (excludeId && existing.id === excludeId) return base;
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const sku = formData.get("sku") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const lowestAsk = formData.get("lowestAsk") as string;
  const highestBid = formData.get("highestBid") as string;
  const lastSalePrice = formData.get("lastSalePrice") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const category = formData.get("category") as string;
  const subcategory = formData.get("subcategory") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  const stock = Number(formData.get("stock") ?? 0);
  const slug = await makeUniqueSlug(name);

  const section = formData.get("section") as string || "all"

  const featuredUntil = isFeatured
    ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    : null

  const newProduct = await db.insert(products).values({
    name,
    slug,
    brand: brand || null,
    sku: sku || null,
    description: description || null,
    price,
    lowestAsk: lowestAsk || null,
    highestBid: highestBid || null,
    lastSalePrice: lastSalePrice || null,
    imageUrl: imageUrl || null,
    category: category || null,
    subcategory: subcategory || null,
    isFeatured,
    featuredUntil,
    stock,
    section
  }).returning().then(r => r[0])

  const sizes = formData.getAll("sizes") as string[]
  console.log("sizes received:", sizes)
  console.log("all form keys:", [...formData.keys()])  
  if (sizes.length > 0) {
    let minAskPrice = Infinity
    for (const size of sizes){
      const sizePrice = formData.get(`size_price_${size}`) as string;
      const askPrice = sizePrice && Number(sizePrice) > 0 ? Number(sizePrice) : Number(price);
      minAskPrice = Math.min(minAskPrice, askPrice)
      await db.insert(listings).values({
        productId: newProduct.id,
        sellerId: ADMIN_SELLER_ID,
        askPrice: String(askPrice),
        size,
        isActive: true,
        expiresAt: new Date(Date.now()+365*24*60*60*1000)
      })
    }
    await db.update(products)
      .set({ lowestAsk: String(minAskPrice) })
    .where(eq(products.id, newProduct.id))
  }
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const sku = formData.get("sku") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const lowestAsk = formData.get("lowestAsk") as string;
  const highestBid = formData.get("highestBid") as string;
  const lastSalePrice = formData.get("lastSalePrice") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const category = formData.get("category") as string;
  const subcategory = formData.get("subcategory") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  const stock = Number(formData.get("stock") ?? 0);
  const slug = await makeUniqueSlug(name, id)

  const section = formData.get("section") as string || "all";
 
  await db
    .update(products)
    .set({
      name,
      slug,
      brand: brand || null,
      sku: sku || null,
      description: description || null,
      price,
      lowestAsk: lowestAsk || null,
      highestBid: highestBid || null,
      lastSalePrice: lastSalePrice || null,
      imageUrl: imageUrl || null,
      category: category || null,
      subcategory: subcategory || null,
      isFeatured,
      stock,
      section
    })
    .where(eq(products.id, id));
 
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products")
}
 
export async function deleteProduct(id: string) {
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/");
}
 
export async function toggleFeatured(id: string, current: boolean) {
  const isFeatured = !current;
  const featuredUntil = isFeatured
    ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    : null;
  await db
    .update(products)
    .set({ isFeatured, featuredUntil })
    .where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/");
}