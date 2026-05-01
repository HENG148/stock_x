import { auth } from "@/src/auth";
import Link from "next/link";
import { NavSearch } from "../NavSearch";
import { NavLink } from "../NavLink";
import { BellButton } from "../ui/bellButton";
import { AvatarMenu } from "../ui/avatarMenu";
import CategoryBar from "../CategoryBar";
import { db } from "@/src/db";
import { notifications } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";

export async function Navbar() {
  const session = await auth()
  const user = session?.user;

  let userNotifications: any[] = [];
  if (user?.id) {
    userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(20);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="border-b border-gray-100">
        <div className="max-w-360 mx-auto px-6 h-15 flex items-center gap-5">
          <Link href="/"
            className="shrink-0 text-xl font-black text-[#08a05c] tracking-tight no-underline"
          >
            StockX
          </Link>
          <NavSearch />

          <nav className="flex items-center gap-1 shrink-0 ml-auto">
            <NavLink href="/news">News</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/help">Help</NavLink>
            <NavLink href="/sell">Sell</NavLink>

            {user ? (
              <>
                <div className="gap-3 flex items-center shrink-0">
                  <BellButton
                    notifications={userNotifications}
                    userId={user.id}
                  />
                  <AvatarMenu name={user.name} email={user.email} />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-full border-[1.5px] border-gray-800 text-[13px] font-semibold text-gray-900 no-underline hover:bg-gray-50 transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 rounded-full bg-gray-900 text-[13px] font-semibold text-white no-underline hover:bg-gray-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
      <CategoryBar />
    </header>
  )
}