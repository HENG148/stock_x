'use server'

import { and, asc, eq } from "drizzle-orm";
import { db } from "../db";
import { bids, listings, orderItems, orders, products } from "../db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { notifyAdmins } from "./notifications";

interface CreateListingProps{
  productId: string;
  sellerId: string;
  askPrice: number
  size: string
}

interface PlaceBidProp{
  productId: string;
  buyerId: string
  bidPrice: number;
  size: string;
}

export async function createListing({
  productId,
  sellerId,
  askPrice,
  size,
}: CreateListingProps) {
  await db.insert(listings).values({
    productId, sellerId, askPrice: String(askPrice),
    size,
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  })
  const product = await db
    .select({ lowestAsk: products.lowestAsk })
    .from(products)
    .where(eq(products.id, productId))
    .then((r) => r[0])
  if (!product.lowestAsk || askPrice < Number(product.lowestAsk)) {
    await db
      .update(products)
      .set({ lowestAsk: String(askPrice) })
    .where(eq(products.id, productId))
  }
  revalidatePath(`/sneakers`);
  revalidatePath(`/shoes`);
}

export async function placeBid({ productId, buyerId, bidPrice, size }: PlaceBidProp) {
   await db.insert(bids).values({
    productId,
    buyerId,
    bidPrice: String(bidPrice),
    size,
    isActive: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
   });
  
  await notifyAdmins({
    type: "new_bid",
    title: "New Bid Placed",
    message: `A buyer placed a bid of $${bidPrice} for size ${size}`,
    link: "/admin/orders"
  })
 
  const product = await db
    .select({ highestBid: products.highestBid })
    .from(products)
    .where(eq(products.id, productId))
    .then((r) => r[0]);
  if (!product.highestBid || bidPrice > Number(product.highestBid)) {
    await db
      .update(products)
      .set({ highestBid: String(bidPrice) })
      .where(eq(products.id, productId));
  }
  revalidatePath(`/sneakers`);
  revalidatePath(`/shoes`);
}

export async function buyNow({
  productId,
  buyerId,
  size,
}: {
  productId: string;
  buyerId: string;
  size: string;
}) {
  const listing = await db
    .select()
    .from(listings)
    .where(
      and(
        eq(listings.productId, productId),
        eq(listings.size, size),
        eq(listings.isActive, true)
      )
    )
    .orderBy(asc(listings.askPrice))
    .limit(1)
    .then((r) => r[0]);
 
  if (!listing) throw new Error("No listing available for this size");
 
  const price = Number(listing.askPrice);
 
  // Create order
  const order = await db
    .insert(orders)
    .values({
      userId: buyerId,
      sellerId: listing.sellerId,
      total: String(price),
      status: "pending",
    })
    .returning()
    .then((r) => r[0]);
 
  // Create order item
  await db.insert(orderItems).values({
    orderId: order.id,
    productId,
    quantity: 1,
    price: String(price),
    size,
  });

  await notifyAdmins({
    type: "new_bid",
    title: "New Bid Placed",
    message: `A buyer purchased size ${size}`
  })
 
  await db
    .update(listings)
    .set({ isActive: false })
    .where(eq(listings.id, listing.id));
 
  const nextListing = await db
    .select({ askPrice: listings.askPrice })
    .from(listings)
    .where(
      and(
        eq(listings.productId, productId),
        eq(listings.isActive, true)
      )
    )
    .orderBy(asc(listings.askPrice))
    .limit(1)
    .then((r) => r[0]);
  await db
    .update(products)
    .set({
      lastSalePrice: String(price),
      lowestAsk: nextListing?.askPrice ?? null,
    })
    .where(eq(products.id, productId));
  revalidatePath(`/sneakers`);
  revalidatePath(`/shoes`);
  return order.id;
}

export async function cancelListing(listingId: string) {
  await db
    .update(listings)
    .set({ isActive: false })
    .where(eq(listings.id, listingId));
  revalidatePath("/profile/selling");
}

export async function cancelBid(bidId: string) {
  await db
    .update(bids)
    .set({ isActive: false })
    .where(eq(bids.id, bidId));
  revalidatePath("/profile/buying");
}

export async function cancelOrder(orderId: string) {
  await db
    .update(orders)
    .set({ status: "cancelled" })
    .where(eq(orders.id, orderId));
  revalidatePath("/profile/buying");
  redirect("/profile/buying")
}