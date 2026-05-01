'use client'

import { markAllAsRead, markAsRead } from "@/src/server/notifications";
import { useEffect, useRef, useState } from "react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string | null;
  isRead: boolean | null;
  link: string | null;
  createdAt: Date | null;
};

interface BellButtonProps {
  notifications: Notification[];
  userId: string
}

export function BellButton({ notifications: initial, userId }: BellButtonProps) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);
  const unread = items.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    };
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAll = async () => {
    await markAllAsRead(userId);
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const handleClick = async (item: Notification) => {
    if (!item.isRead) {
      await markAsRead(item.id);
      setItems((prev) => prev.map((n) => n.id === item.id ? { ...n, isRead: true } : n))
    }
    if (item.link) window.location.href = item.link;
    setOpen(false)
  }

  const ICONS: Record<string, string> = {
    new_order: "🛍️",
    new_bid: "🏷️",
    new_product: "👟",
    discount: "🎉",
  };

    return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer flex items-center"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-900">Notifications</span>
            {unread > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-[#08a05c] font-semibold bg-transparent border-none cursor-pointer hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="text-3xl mb-2">🔔</span>
              <p className="text-sm font-semibold text-gray-700">No notifications</p>
              <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !item.isRead ? "bg-green-50/50" : ""
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{ICONS[item.type] ?? "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!item.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                      {item.title}
                    </p>
                    {item.message && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.message}</p>
                    )}
                    <p className="text-xs text-gray-300 mt-1">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                  {!item.isRead && (
                    <span className="w-2 h-2 bg-[#08a05c] rounded-full shrink-0 mt-1.5" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// export function BellButton() {
//   return (
//     <button
//       aria-label="Notifications"
//       className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer flex items-center"
//     >
//       <svg
//         width="18"
//         height="18"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//         <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//       </svg>
//     </button>
//   );
// }