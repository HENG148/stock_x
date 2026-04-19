"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function NavSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /// Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const search = () => {
    const q = inputRef.current?.value.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="flex-1 max-w-150">
      <div className="flex items-center gap-2.5 h-10 px-3.5 rounded-lg bg-gray-100 border-[1.5px] border-transparent focus-within:bg-white focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/6 transition-all">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#aaa"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Search for brand, color, etc."
          aria-label="Search products"
          className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400 font-[inherit]"
        />
        <kbd className="shrink-0 text-[11px] text-gray-400 bg-gray-200 rounded px-1.5 py-0.5 font-[inherit]">
          Ctrl + K
        </kbd>
      </div>
    </div>
  );
}