'use server'

import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
  const isFeatured = formData.get("isFeatured") === "true";
  const stock = Number(formData.get("stock") ?? 0);

  const featuredUntil = isFeatured
    ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    : null

  await db.insert(products).values({
    name,
    brand: brand || null,
    sku: sku || null,
    description: description || null,
    price,
    lowestAsk: lowestAsk || null,
    highestBid: highestBid || null,
    lastSalePrice: lastSalePrice || null,
    imageUrl: imageUrl || null,
    category: category || null,
    isFeatured,
    featuredUntil,
    stock,
  });
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
  const isFeatured = formData.get("isFeatured") === "true";
  const stock = Number(formData.get("stock") ?? 0);
 
  await db
    .update(products)
    .set({
      name,
      brand: brand || null,
      sku: sku || null,
      description: description || null,
      price,
      lowestAsk: lowestAsk || null,
      highestBid: highestBid || null,
      lastSalePrice: lastSalePrice || null,
      imageUrl: imageUrl || null,
      category: category || null,
      isFeatured,
      stock,
    })
    .where(eq(products.id, id));
 
  revalidatePath("/admin/products");
  revalidatePath("/");
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