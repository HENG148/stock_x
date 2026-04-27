import Image from "next/image";
import Link from "next/link";
import { toggleWatchlist } from "../server/recommend";
import { HeartIcon, XpressIcon } from "./icons/icon";

export type RecommendedProduct = {
  id: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  lowestAsk: string | null;
  slug?: string | null;
  category?: string | null;
};

export function ProductCard({
  product,
  isWatched,
  userId,
}: {
    product: RecommendedProduct;
    isWatched: boolean;
    userId?: string
  }) {
  const category = product.category?.toLowerCase() ?? "products";
  const href = `/${category}/${product.slug ?? product.id}`;
  // const href =`/product/${product.slug}`
  const price = product.lowestAsk
    ? `$${Number(product.lowestAsk).toLocaleString()}`
    : "-";

  return (
    <div className="group relative flex flex-col w-52">
      <div className="relative bg-white rounded-2xl overflow-hidden aspect-square "> {/* border border-gray-100, shadow-xs, mb-3 */}
        {product.imageUrl ? (
          <Link href={href} className="block w-full h-full">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="300px"
              className="object-contain aspect-ratio p-6 transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-20" fill="none">
              <path d="M10 40 L40 10 L70 40 L40 70 Z" stroke="#999" strokeWidth="3" />
            </svg>
          </div>
        )}

        {userId ? (
          <form
            action={toggleWatchlist.bind(null, { productId: product.id, userId, isWatched })}
            className="absolute top-2.5 right-2.5 z-10"
          >
            <button
              type="submit"
              aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
            >
              <HeartIcon filled={isWatched} />
            </button>
          </form>
        ) : (
          <div className="absolute top-2.5 right-2.5 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm shadow-sm">
            <HeartIcon filled={false} />
          </div>
        )}
      </div>

      <Link href={href} className="flex flex-col gap-0 min-w-0 no-underline">
        <p className="text-[14px] font-medium text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">Lowest Ask</p>
        <p className="text-[17px] font-bold text-gray-900 mt-0.5">{price}</p>
      </Link>

      <div className="flex items-center gap-1 mt-1.5">
        <XpressIcon />
        <span className="text-[11px] font-semibold text-gray-500">Xpress Ship</span>
      </div>
    </div>
  );
}
  // return (
  //   <div className="group relative flex flex-col min-w-0">
  //     <Link href={href} className="block relative bg-gray-50 rounded-lg overflow-hidden aspect-square mb-3">
  //       {product.imageUrl ? (
  //         <Image
  //           src={product.imageUrl}
  //           alt={product.name}
  //           fill
  //           sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
  //           className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
  //         />
  //       ) : (
  //           <div className="absolute inset-0 flex items-center justify-center">
  //             <svg viewBox="0 0 80 80" className="w-16 h-16 opacity-20" fill="none">
  //               <path d="M10 40 L40 10 L70 40 L40 70 Z" stroke="#999" strokeWidth="3" />
  //             </svg>
  //           </div>
  //       )}

  //       {userId && (
  //         <form
  //           action={toggleWatchlist.bind(null, { productId: product.id, userId, isWatched})}
  //           className="absolute top-2 right-2"
  //         >
  //           <button
  //             type="submit"
  //             aria-label={isWatched ? "Remove from watchlist" : "Add to watchlist"}
  //             className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
  //           >
  //             <HeartIcon filled={isWatched} />
  //           </button>
  //         </form>
  //       )}
  //     </Link>

  //     <Link href={href} className="no underline flex flex-col gap-0.5 min-w-0">
  //       <p className="text-[13px] font-medium text-gray-900 leading-snug line-clamp-2">
  //         {product.name}
  //       </p>
  //       <p className="text-[12px] text-gray-400 mt-0.5">Lowest Ask</p>
  //       <p className="text-[15px] font-bold text-gray-900">{price}</p>
  //     </Link>

  //     <div className="flex items-center gap-1 mt-1.5">
  //       <XpressIcon />
  //       <span className="text-[11px] font-semibold text-gray-500">Xpress Ship</span>
  //     </div>
  //   </div>
  // )
// }