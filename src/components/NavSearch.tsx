  "use client";

  import { useRef, useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
  import { BRANDS, SLUG_MAP, SUBCATEGORIES } from "../types/type";
  import { PLAYER_ROUTES } from "../data/data";

  const SUBCATEGORY_ROUTES: Record<string, string> = {};
  Object.entries(SUBCATEGORIES).forEach(([parentSlug, subs]) => {
    subs.forEach((sub) => {
      SUBCATEGORY_ROUTES[sub.label.toLowerCase()] = `/browse/${parentSlug}?sub=${sub.label}`;
      SUBCATEGORY_ROUTES[sub.slug.toLowerCase()] = `/browse/${parentSlug}?sub=${sub.label}`;
    })
  })

  const CATEGORY_ROUTES: Record<string, string> = {};
  Object.entries(SLUG_MAP).forEach(([slug, filter]) => {
    CATEGORY_ROUTES[filter.label.toLowerCase()] = `/browse/${slug}`;
    CATEGORY_ROUTES[slug.toLowerCase()] = `/browse/${slug}`;
  });

  const HISTORY_KEY = "search_history";
const MAX_HISTORY = 8;

function getHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(query: string) {
  const prev = getHistory().filter((h) => h !== query);
  const next = [query, ...prev].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

function removeHistory(query: string) {
  const next = getHistory().filter((h) => h !== query);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function NavSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

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
  
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleFocus = () => {
    setHistory(getHistory());
    setFocused(true);
  };

  const search = (q?: string) => {
    const query = q ?? inputRef.current?.value.trim();
    if (!query) return;
    const lower = query.toLowerCase();

    saveHistory(query);
    setHistory(getHistory());
    setFocused(false);
    if (inputRef.current) inputRef.current.value = "";
    setInputValue("");

    const routeTables = [PLAYER_ROUTES, SUBCATEGORY_ROUTES, CATEGORY_ROUTES];
    for (const table of routeTables) {
      if (table[lower]) { router.push(table[lower]); return; }
      const partial = Object.entries(table).find(
        ([key]) => key.includes(lower) || lower.includes(key)
      );
      if (partial) { router.push(partial[1]); return; }
    }

    const brandMatch = BRANDS.find((b) => b.toLowerCase() === lower);
    if (brandMatch) {
      router.push(`/browse?brand=${encodeURIComponent(brandMatch)}`);
      return;
    }
    router.push(`/browse?q=${encodeURIComponent(query)}`);
  };

  const handleRemove = (e: React.MouseEvent, item: string) => {
    e.stopPropagation();
    removeHistory(item);
    setHistory(getHistory());
  };

  const filteredHistory = inputValue
    ? history.filter((h) => h.toLowerCase().includes(inputValue.toLowerCase()))
    : history;

  const showDropdown = focused && filteredHistory.length > 0;

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

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recent Searches</span>
              <button
                onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]); }}
                className="text-xs text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
              >
                Clear all
              </button>
            </div>
            {filteredHistory.map((item) => (
              <div
                key={item}
                onClick={() => search(item)}
                className="flex items-center justify-between px-3.5 py-2.5 hover:bg-gray-50 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
                <button
                  onClick={(e) => handleRemove(e, item)}
                  className="text-gray-300 hover:text-gray-500 bg-transparent border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-base leading-none"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }