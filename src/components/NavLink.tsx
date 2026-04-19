import Link from "next/link";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[13px] font-medium text-gray-600 no-underline px-2.5 py-1.5 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      {children}
    </Link>
  );
}