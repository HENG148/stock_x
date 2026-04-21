'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useMemo } from "react";

interface BreadcrumbProps {
  postTitle?: string;
}

function slugToLable(slug: string): string{
  return slug
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ postTitle }) => {
  const pathname = usePathname()
  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    const segments = pathname.split("/").filter(Boolean);
    let currentPath = "";
    return segments.map((seg, i) => {
      currentPath += `/${seg}`
      const isLast = i === seg.length - 1;
      const label = isLast && postTitle ? postTitle : slugToLable((seg))
      return { path: currentPath, label, isLast };
    })
  }, [pathname, postTitle]);
  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5">
      <Link
        href="/"
        className="text-[14px] font-mono text-[#555] hover:text-white transition-colors"
      >
        Home
      </Link>

      {breadcrumbs.map((crumb) => (
        <Fragment key={crumb.path}>
          <span className="text-[#333] font-mono text-[11px]">/</span>
          {crumb.isLast ? (
            <span className="text-[14px] font-mono text-[#888] max-w-80 truncate">
              {crumb.label}
            </span>
          ) : (
              <Link
                href={crumb.path}
                className="text-[14px] font-mono text-[#555] hover:text-white transition-colors">
                {crumb.label}
              </Link>
          )}
        </Fragment>
      ))}
    </nav>
  )
}