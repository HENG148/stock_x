"use server"

import { signOut } from "@/src/auth"

export async function handleSignOut() {
  await signOut({ redirectTo: "/" })
}