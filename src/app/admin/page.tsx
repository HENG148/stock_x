
import { users, products, orders, categories } from "@/src/db/schema";
import { db } from "@/src/db";
import { count, sum } from "drizzle-orm";
import Link from "next/link";

export default async function AdminPage() {
  const [[userCount], [productCount], [orderCount], [categoryCount], [revenue]] =
    await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(products),
      db.select({ count: count() }).from(orders),
      db.select({ count: count() }).from(categories),
      db.select({ total: sum(orders.total) }).from(orders),
    ]);

  const stats = [
    {
      label: "Total Users",
      value: userCount.count,
      icon: "👥",
      href: "/admin/users",
      color: "bg-blue-50 text-blue-600"
    },
    {
      label: "Total Products",
      value: productCount.count,
      icon: "👟",
      href: "/admin/products",
      color: "bg-green-50 text-green-600"
    },
    {
      label: "Total Orders",
      value: orderCount.count,
      icon: "📦",
      href: "/admin/orders",
      color: "bg-orange-50 text-orange-600"
    },
    {
      label: "Categories",
      value: categoryCount.count,
      icon: "🗂",
      href: "/admin/categories",
      color: "bg-purple-50 text-purple-600"
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome to the StockX admin panel</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="no-underline">
            <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center text-xl mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
        <p className="text-3xl font-bold text-gray-900">
          ${Number(revenue.total ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}