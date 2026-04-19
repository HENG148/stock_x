import Link from "next/link";

interface DropdownLinkProps {
  href: string;
  children: React.ReactNode
}

export function DropdownLink({ href, children }: DropdownLinkProps) {
  return (
    <Link
      href={href}
      className="block px-4 py-2.5 text-sm text-gray-600 no-underline hover:bg-gray-50 hover:text-gray-900 transition-colors"
    >
      {children}
    </Link>
  )
}