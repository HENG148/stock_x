import Link from "next/link";

export function ProfileSection({
  title, 
  action, 
  children
}: {
    title: string;
    action?: {
      label: string; 
      href: string;
    }
    children: React.ReactNode
  }) {
  return (
    <div className="mb-2 border-b border-gray-100">
      <div className="flex items-center justify-between py-4">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="px-4 py-1.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 no-underline hover:border-gray-500 hover:text-gray-900 transition-colors"
          >
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}