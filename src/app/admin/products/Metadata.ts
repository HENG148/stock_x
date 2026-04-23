import { db } from "@/src/db";
import { products } from "@/src/db/schema";
import { eq, or } from "drizzle-orm";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
 
  const product = await db
    .select({
      name: products.name,
      brand: products.brand,
      lowestAsk: products.lowestAsk,
      price: products.price,
      imageUrl: products.imageUrl
    })
    .from(products)
    .where(or(eq(products.slug, slug), eq(products.id, slug)))
    .then((r) => r[0]);
 
  if (!product) return { title: "Product Not Found" };
 
  return {
    title: product.name,
    description: `Buy ${product.name} by ${product.brand ?? ""}. Lowest Ask: $${Number(product.lowestAsk ?? product.price).toLocaleString()}. Verified authentic.`,
    openGraph: {
      title:  `${product.name} | StockX`,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}