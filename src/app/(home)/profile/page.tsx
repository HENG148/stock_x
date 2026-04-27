import { auth } from "@/src/auth";
import { db } from "@/src/db";
import { users, orders, listings, bids, watchlist } from "@/src/db/schema";
import { eq, count } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ProfileSection } from "@/src/components/ProfileSection";

export const metadata: Metadata = { title: "Profile" };

const NAV_ITEMS = [
  { label: "Profile", sub: "Shipping, Email, Password, Shoe Size", href: "/profile", icon: "👤" },
  { label: "Buying", sub: "Active Bids, In-Progress, Completed Orders", href: "/profile/buying", icon: "🛍" },
  { label: "Selling", sub: "Active Asks, Sales, Seller Profile", href: "/profile/selling", icon: "📸" },
  { label: "Favorites", sub: "Items and lists you've saved", href: "/profile/favorites", icon: "🤍" },
  { label: "Message Center", sub: "See the latest news", href: "/profile/messages", icon: "🔔" },
  { label: "Wallet", sub: "Payments, Payouts, Gift Cards, Credits", href: "/profile/wallet", icon: "💳" },
  { label: "Settings", sub: "Security and Notifications", href: "/profile/settings", icon: "⚙️" },
];

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [user, [orderCount], [listingCount], [bidCount], [watchlistCount]] =
    await Promise.all([
      db.select().from(users).where(eq(users.id, userId)).then((r) => r[0]),
      db.select({ count: count() }).from(orders).where(eq(orders.userId, userId)),
      db.select({ count: count() }).from(listings).where(eq(listings.sellerId, userId)),
      db.select({ count: count() }).from(bids).where(eq(bids.buyerId, userId)),
      db.select({ count: count() }).from(watchlist).where(eq(watchlist.userId, userId)),
    ]);

  const username = `sneakerhead${userId.replace(/-/g, "").slice(0, 13)}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-300 mx-auto flex">
        <main className="flex-1 py-8 px-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile</h1>
          <ProfileSection title="Personal Information" action={{ label: "Edit", href: "/profile/edit" }}>
            <div className="grid grid-cols-3 gap-6 py-6">
              <InfoField label="Name"          value={user?.name ?? "—"} />
              <InfoField label="Email Address" value={user?.email ?? "—"} />
              <InfoField label="Username"      value={username} />
            </div>
          </ProfileSection>
          <ProfileSection title="Shipping Addresses" action={{ label: "Add", href: "/profile/shipping" }}>
            <div className="py-6">
              <p className="text-sm text-gray-500">You do not have a shipping address saved.</p>
            </div>
          </ProfileSection>

          {/* ── Size Preferences ───────────────────────────────────────── */}
          <Section title="Size Preferences" action={{ label: "Edit", href: "/profile/sizes" }}>
            <div className="grid grid-cols-2 gap-10 py-6">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">My Shoe Sizes</p>
                <Link href="/profile/sizes" className="text-sm font-semibold text-[#08a05c] no-underline hover:underline">
                  Set Sizes
                </Link>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">My Apparel Sizes</p>
                <Link href="/profile/sizes" className="text-sm font-semibold text-[#08a05c] no-underline hover:underline">
                  Set Sizes
                </Link>
              </div>
            </div>
          </Section>

          {/* ── Account Type ───────────────────────────────────────────── */}
          <Section title="Account Type" action={{ label: "Edit", href: "/profile/account-type" }}>
            <div className="py-6">
              <p className="text-sm text-gray-900 font-medium capitalize">
                {user?.role === "admin" ? "Administrator" :
                 user?.role === "seller" ? "Seller" : "Individual"}
              </p>
            </div>
          </Section>

          {/* ── Activity Stats ─────────────────────────────────────────── */}
          <div className="mt-8 grid grid-cols-4 gap-4">
            {[
              { label: "Orders",    value: orderCount.count,    href: "/profile/buying",   color: "text-blue-600",   bg: "bg-blue-50" },
              { label: "Listings",  value: listingCount.count,  href: "/profile/selling",  color: "text-green-600",  bg: "bg-green-50" },
              { label: "Bids",      value: bidCount.count,      href: "/profile/buying",   color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Watchlist", value: watchlistCount.count, href: "/profile/favorites", color: "text-purple-600", bg: "bg-purple-50" },
            ].map((stat) => (
              <Link key={stat.label} href={stat.href} className="no-underline">
                <div className={`${stat.bg} rounded-xl p-4 hover:opacity-90 transition-opacity`}>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 border-b border-gray-100">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="px-4 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 no-underline hover:border-gray-500 hover:text-gray-900 transition-colors"
          >
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}