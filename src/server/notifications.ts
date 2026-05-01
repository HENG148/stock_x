'use server'

import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { notifications, users } from "../db/schema";
import { revalidatePath } from "next/cache";

interface CreateNotificationProps {
  userId: string;
  type: string;
  title: string;
  message?: string;
  link?: string;
}

interface NotifyAdminsProps {
  type: string;
  title: string;
  message?: string;
  link?: string;
}

export async function createNotification({ userId, type, title, message, link }: CreateNotificationProps) {
  await db.insert(notifications).values({
    userId, type, title, message, link
  })
}

export async function notifyAdmins({ type, title, message, link }: NotifyAdminsProps) {
  const admins = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "admin"));
  for (const admin of admins) {
    await createNotification({ userId: admin.id, type, title, message, link });
  }
}

export async function markAsRead(notificationsId: string) {
  await db.update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.id, notificationsId))
  revalidatePath("/")
}

export async function markAllAsRead(userId: string) {
  await db.update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      ))
  revalidatePath("/");
}