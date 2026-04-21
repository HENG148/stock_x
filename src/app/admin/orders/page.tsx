import { db } from "@/src/db";
import { orders, users } from "@/src/db/schema";
import { desc, eq } from "drizzle-orm";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-orange-50 text-orange-600",
  confirmed: "bg-blue-50 text-blue-600",
  shipped:   "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-500",
};

export default async function AdminOrdersPage() {
  const allOrders = await db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
      buyerEmail: users.email,
      buyerName: users.name
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt))
  
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">{allOrders.length} total orders</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Order ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Buyer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
              </tr>
            </thead>

            <tbody>
              {allOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    No order yet.
                  </td>
                </tr>
              ) : (
                  allOrders.map((order) => (
                    <tr key={order.id} className="border-b broder-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{order.buyerName ?? "—"}</p>
                        <p className="text-xs text-gray-400">{order.buyerEmail}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        ${Number(order.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[order.status ?? "pending"] ?? "bg-gray-100 text-gray-500"}`}>
                          {order.status ?? "pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))
              )} 
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}