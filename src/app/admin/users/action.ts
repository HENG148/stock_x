'use server'

import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id))
  revalidatePath("/admin/users")
}