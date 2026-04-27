import { auth } from "@/src/auth";
import { redirect } from "next/navigation";

export default async function WalletPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Wallet</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Available Balance", value: "$0.00",   icon: "💰", color: "bg-green-50  text-green-600" },
          { label: "Pending Payouts",   value: "$0.00",   icon: "⏳", color: "bg-orange-50 text-orange-600" },
          { label: "StockX Credits",    value: "$0.00",   icon: "🎁", color: "bg-purple-50 text-purple-600" },
        ].map((card) => (
          <div key={card.label} className={`${card.color.split(" ")[0]} rounded-xl p-5 border border-gray-100`}>
            <span className="text-2xl">{card.icon}</span>
            <p className={`text-xl font-bold mt-2 ${card.color.split(" ")[1]}`}>{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center py-16">
        <div className="text-4xl mb-3">💳</div>
        <p className="text-base font-semibold text-gray-700">No payment methods saved</p>
        <p className="text-sm text-gray-400 mt-1 mb-4">Add a card to start buying and selling</p>
        <button className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg border-none cursor-pointer hover:bg-gray-700 transition-colors">
          Add Payment Method
        </button>
      </div>
    </div>
  );
}