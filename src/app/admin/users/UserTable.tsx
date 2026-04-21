'use client'

import { useState, useTransition } from "react";
import { deleteUser } from "./action";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  password: string | null;
  createdAt: Date | null;
}

export default function UsersTable({ users }: { users: User[] }) {
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  function togglePassword(id: string) {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    })
  }
  function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    startTransition(() => deleteUser(id));
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Password</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#08a05c] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {user.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name ?? "—"}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-mono">
                        {visiblePasswords.has(user.id)
                          ? (user.password ?? "—")
                          : "••••••••"}
                      </span>
                      <button
                        onClick={() => togglePassword(user.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-xs"
                        title={visiblePasswords.has(user.id) ? "Hide" : "Show"}
                      >
                        {visiblePasswords.has(user.id) ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                      user.role === "admin"
                        ? "bg-red-50 text-red-500"
                        : user.role === "seller"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {user.role ?? "customer"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={isPending}
                      className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}