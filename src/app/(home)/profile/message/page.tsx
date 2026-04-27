import { auth } from "@/src/auth";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Message Center</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center py-16">
        <div className="text-4xl mb-3">🔔</div>
        <p className="text-base font-semibold text-gray-700">No messages yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Order updates and notifications will appear here
        </p>
      </div>
    </div>
  );
}