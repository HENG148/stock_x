import React from 'react'
import { buildUrl } from '../BuildUrl';
import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}

export default function Pagination({ currentPage, totalPages, params }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
    .reduce<(number | "...")[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);
  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {currentPage > 1 && (
        <Link
          href={buildUrl(params, { page: String(currentPage - 1) })}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 no-underline hover:bg-gray-100 transition-colors"
        >
          ← Prev
        </Link>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <Link
            key={p}
            href={buildUrl(params, { page: String(p) })}
            className={`px-3 py-1.5 rounded-lg text-sm no-underline transition-colors ${
              p === currentPage
                ? "bg-gray-900 text-white font-semibold"
                : "border border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildUrl(params, { page: String(currentPage + 1) })}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 no-underline hover:bg-gray-100 transition-colors"
        >
          Next →
        </Link>
      )}
    </div>
  )
}
