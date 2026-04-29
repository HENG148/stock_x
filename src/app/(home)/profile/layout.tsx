import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { signOut } from "@/src/auth";

const NAV_ITEMS = [
  { label: "Profile", sub: "Shipping, Email, Password, Shoe Size", href: "/profile",  },
  { label: "Buying", sub: "Active Bids, In-Progress, Completed Orders", href: "/profile/buying",  },
  { label: "Selling", sub: "Active Asks, Sales, Seller Profile", href: "/profile/selling",  },
  { label: "Favorites", sub: "Items and lists you've saved", href: "/profile/favorites",  },
  { label: "Message Center", sub: "See the latest news", href: "/profile/messages", },
  { label: "Wallet", sub: "Payments, Payouts, Gift Cards, Credits", href: "/profile/wallet", },
  { label: "Settings", sub: "Security and Notifications", href: "/profile/settings" },
];

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((r) => r[0]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-355 mx-auto flex">
        <aside className="w-64 shrink-0 border-r border-gray-100 min-h-screen py-8 pr-6 sticky top-0 h-screen overflow-y-auto">
          <div className="px-4 mb-6">
            <h2 className="text-lg font-bold text-gray-900">{user?.name ?? "User"}</h2>
          </div>

          <nav className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 px-4 py-3 rounded-xl no-underline hover:bg-gray-50 transition-colors"
              >
                {/* <span className="text-lg mt-0.5 w-6 text-center">{item.icon}</span> */}
                <div>
                  <p className="text-md font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{item.sub}</p>
                </div>
              </Link>
            ))}

            <div className="mt-4 border-t border-gray-100 pt-4 ">
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors bg-transparent hover:text-red-700 border-none cursor-pointer font-[inherit] text-left"
                >
                  <span className="text-lg w-6 text-center">→</span>
                  <span className="text-sm font-semibold text-gray-900">Log Out</span>
                </button>
              </form>
            </div>
          </nav>
        </aside>

        <main className="flex-1 py-8 px-10 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}