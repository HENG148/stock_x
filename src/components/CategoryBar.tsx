'use client'

import { usePathname } from 'next/navigation'
import { NAV_LINKS } from '../types/type'
import Link from 'next/link'

export default function CategoryBar() {
  const pathname = usePathname()
  return (
    <div className='bg-white '>
      <div className='max-w-360 mx-auto px-6 flex items-center overflow-x-auto scrollbar-hide'>
        {NAV_LINKS.map((link) => 
          link.accent ? (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 text-[13px] font-semibold text-[#d4380d] no-underline px-3.5 py-3 whitespace-nowrap border-b-2 border-transparent hover:border-[#d4380d] transition-colors
                ${pathname === link.href ? "border-[#d4380d]": "border-transparent hover:border-[#d4380d]"}
              `}
            >
              {link.label}
            </Link>
          ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 text-[13px] font-medium text-gray-600 no-underline px-4 py-3 whitespace-nowrap border-b-2 transition-colors
                ${pathname === link.href ? 'border-gray-900 text-gray-900' : 'border-transparent hover:text-gray-900 hover:border-gray-900'}`}
              >
                {link.label}
              </Link>
          )
        )}
      </div>
    </div>
  )
}
