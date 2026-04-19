import { NAV_LINKs } from '../types/type'
import Link from 'next/link'

export default function CategoryBar() {
  return (
    <div className='bg-white'>
      <div className='max-w-360 mx-auto px-6 flex items-center overflow-x-auto scrollbar-hide'>
        {NAV_LINKs.map((link) => 
          link.accent ? (
            <Link
              key={link.href}
              href={link.href}
              className='shrink-0 text-[13px] font-semibold text-[#d4380d] no-underline px-3.5 py-3 whitespace-nowrap border-b-2 border-transparent hover:border-[#d4380d] transition-colors'
            >
              {link.label}
            </Link>
          ) : (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 text-[13px] font-medium text-gray-600 no-underline px-3.5 py-3 whitespace-nowrap border-b-2 border-transparent hover:text-gray-900 hover:border-gray-900 transition-colors"
              >
                {link.label}
              </Link>
          )
        )}
      </div>
    </div>
  )
}
