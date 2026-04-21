import { FOOTER_COLS } from "@/src/types/type";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 px-8 py-10 text-xs text-gray-500">
      <p className="text-2xl font-semibold text-gray-900 mb-8">StockX.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-8 mb-8">
        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <p className="font-semibold text-gray-900 text-xs mb-2">{col.title}</p>
            {col.links.map((link) => (
              <Link key={link} href="#" className="block leading-loose hover:text-gray-900">
                {link}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* App store + Trustpilot */}
      <div className="flex items-center gap-4 py-5 border-t border-gray-200">
        <a href="#" className="flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2">
          {/* Apple icon SVG */}
          <svg width="16" height="20" viewBox="0 0 24 28" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.3.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.37 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <div>
            <p className="text-[9px] opacity-70">Download on the</p>
            <p className="text-sm font-semibold -mt-0.5">App Store</p>
          </div>
        </a>
        <a href="#" className="flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2">
          {/* Play Store icon SVG */}
          <svg width="16" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.18 23.76c.3.17.64.22.98.14l12.29-7.1-2.58-2.59-10.69 9.55zm-1.9-20.1C1.1 4 1 4.4 1 4.87v14.26c0 .48.1.88.28 1.21l.07.06 7.99-7.99v-.19L1.35 3.6l-.07.06zm17.62 9.65l-2.27-1.31-2.85 2.85 2.85 2.84 2.29-1.32c.65-.38.65-1.68-.02-2.06zM4.16.24L16.45 7.35l-2.58 2.58L3.18.38c.34-.09.69-.04.98.14z"/>
          </svg>
          <div>
            <p className="text-[9px] opacity-70">GET IT ON</p>
            <p className="text-sm font-semibold -mt-0.5">Google Play</p>
          </div>
        </a>
        <div className="flex items-center gap-2 ml-4 text-xs">
          <span className="font-semibold text-gray-900">Great</span>
          <span className="text-[#00b67a] text-sm">★★★★★</span>
          <span>4.2 out of 5</span>
          <span className="text-[#00b67a] font-semibold">✦ Trustpilot</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between py-4 border-t border-gray-200 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {/* StockX X logo */}
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="4" fill="black"/>
            <path d="M8 8l9.5 13L8 32h3l8-9.5 6.5 9.5H32L22 18.5 31.5 8h-3L19 17 13 8H8z" fill="white"/>
          </svg>
          <button className="border border-gray-400 rounded-full px-4 py-1.5 text-xs text-gray-800 hover:border-gray-700">
            Cambodia &nbsp;|&nbsp; English &nbsp;|&nbsp; $ USD
          </button>
        </div>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          {/* X, Facebook, Instagram, YouTube — add SVGs here */}
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <Link href="#">Terms</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Your Privacy Choices</Link>
          <span>©2026 StockX. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}