import { POPULAR_BRANDS } from "@/src/types/type";
import Image from "next/image";
import Link from "next/link";

export function PopularBrands() {
  return (
    <section className="max-w-350 mx-auto px-6 py-5">
      <div className="flex items-center justify-between mb-7">
        <h2 className="text-[18px] font-bold text-gray-900">Popular Brands</h2>
        <Link
          href="/browse/brands"
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 no-underline hover:text-gray-600 transition-colors group"
        >
          See All
          <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-0.5 transition-transform"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {POPULAR_BRANDS.map((brand) => (
          <Link
            key={brand.name}
            href={brand.href}
            className="no-underline group"
          >
            <div className="relative rounded-2xl overflow-hidden w-full h-44">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="object-contain rounded-2xl"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}